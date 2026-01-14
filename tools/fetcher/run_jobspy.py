import os
import re
import json
import time
import logging
from typing import Any, Dict, List, Optional

import requests
import pandas as pd
from jobspy import scrape_jobs

logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s %(name)s: %(message)s')
logger = logging.getLogger("jobspy_runner")


TITLE_EXCLUDE_PAT = re.compile(r'(?i)\b(?:senior|sr\.?|lead|principal|architect|manager|head|director|staff)\b')

EXCLUDE_EXP_YEARS_RE = re.compile(
    r'''(?ix)
    (?:\b|[^a-z])
    (?:
        (?:[4-9]|[1-9]\d)
        (?:\s*[\+\-–—]\s*\d+)?
    )
    \s*
    (?:years?|yrs?|y[.]?)
    (?:\s*(?:of|in))?
    (?:\s+\w{0,3}){0,2}?
    \s*(?:experience|exp|work\s+experience)\b
    ''',
    re.UNICODE
)

EXCLUDE_RIGHTS_RE = re.compile(
    r'(?i)\b(?:'
    r'permanent\s+resident|permanent\s+residency|PR\s*(?:only|required)?|'
    r'citizen|citizenship|australian\s+citizen|au\s+citizen|nz\s+citizen|'
    r'baseline\s+clearance|NV1|NV2|security\s+clearance|'
    r'must\s+have\s+(?:full\s+)?work(?:ing)?\s+rights|'
    r'sponsorship\s+not\s+available|no\s+sponsorship'
    r')\b'
)


def _build_query_phrases(queries: List[str]) -> List[str]:
    phrases: List[str] = []
    for q in queries or []:
        q2 = (q or "").strip().strip('"').strip("'")
        if q2:
            phrases.append(q2.lower())
    return phrases


def filter_title(df: pd.DataFrame, queries: List[str], enforce_include: bool) -> pd.DataFrame:
    if df.empty:
        return df
    t = df["title"].fillna("")
    exc = t.apply(lambda s: bool(TITLE_EXCLUDE_PAT.search(s)))
    out = df[~exc].copy()
    if enforce_include:
        phrases = _build_query_phrases(queries)
        if phrases:
            low = out["title"].fillna("").str.lower()
            mask = low.apply(lambda s: any(p in s for p in phrases))
            out = out[mask].copy()
    return out


def filter_description(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty or "description" not in df.columns:
        return df
    desc = df["description"].fillna("")
    years = desc.str.contains(EXCLUDE_EXP_YEARS_RE, na=False)
    rights = desc.str.contains(EXCLUDE_RIGHTS_RE, na=False)
    return df[~(years | rights)].copy()


def keep_columns(df: pd.DataFrame) -> pd.DataFrame:
    # Normalize jobspy column names to our import schema
    out = df.copy()
    if "job_url" not in out.columns and "job_url_direct" in out.columns:
        out["job_url"] = out["job_url_direct"]

    if "job_type" not in out.columns and "employment_type" in out.columns:
        out["job_type"] = out["employment_type"]
    if "job_level" not in out.columns and "seniority_level" in out.columns:
        out["job_level"] = out["seniority_level"]

    for c in ["job_url", "title", "company", "location", "job_type", "job_level", "description"]:
        if c not in out.columns:
            out[c] = ""

    return out[["job_url", "title", "company", "location", "job_type", "job_level", "description"]].fillna("")


def fetch_linkedin(queries: List[str], location: str, hours_old: int, results_wanted: int) -> pd.DataFrame:
    dfs: List[pd.DataFrame] = []
    for term in queries:
        try:
            df = scrape_jobs(
                site_name=["linkedin"],
                search_term=term,
                location=location,
                hours_old=hours_old,
                results_wanted=results_wanted,
                verbose=0,
                linkedin_fetch_description=True,
            )
        except Exception as e:
            logger.error("scrape_jobs failed term=%s error=%s", term, e)
            continue
        if df is None or df.empty:
            continue
        df = df.loc[:, df.notna().any(axis=0)]
        df["source_query"] = term
        dfs.append(df)
    if not dfs:
        return pd.DataFrame()
    return pd.concat(dfs, ignore_index=True, sort=False)


def api_base() -> str:
    base = os.environ.get("JOBFLOW_WEB_URL", "").strip().rstrip("/")
    if not base:
        raise RuntimeError("JOBFLOW_WEB_URL is not set")
    return base


def headers_secret(secret_env: str, header_name: str) -> Dict[str, str]:
    secret = os.environ.get(secret_env, "").strip()
    if not secret:
        raise RuntimeError(f"{secret_env} is not set")
    return {header_name: secret, "Content-Type": "application/json"}


def main():
    run_id = os.environ.get("RUN_ID", "").strip()
    if not run_id:
        raise RuntimeError("RUN_ID is not set")

    base = api_base()

    # Get run config
    cfg_res = requests.get(
        f"{base}/api/fetch-runs/{run_id}/config",
        headers=headers_secret("FETCH_RUN_SECRET", "x-fetch-run-secret"),
        timeout=30,
    )
    cfg_res.raise_for_status()
    run = cfg_res.json()["run"]

    user_email = run["userEmail"]
    queries = run["queries"] or []
    if not isinstance(queries, list):
        raise RuntimeError("run.queries must be a list")

    location = run.get("location") or "Sydney, New South Wales, Australia"
    hours_old = int(run.get("hoursOld") or 48)
    results_wanted = int(run.get("resultsWanted") or 120)
    include_from_queries = bool(run.get("includeFromQueries") or False)
    filter_desc = bool(run.get("filterDescription") if run.get("filterDescription") is not None else True)

    # Mark running
    requests.patch(
        f"{base}/api/fetch-runs/{run_id}/update",
        headers=headers_secret("FETCH_RUN_SECRET", "x-fetch-run-secret"),
        data=json.dumps({"status": "RUNNING"}),
        timeout=30,
    ).raise_for_status()

    t0 = time.time()
    df = fetch_linkedin(queries, location, hours_old, results_wanted)
    if df.empty:
        items: List[Dict[str, Any]] = []
    else:
        df = filter_title(df, queries, enforce_include=include_from_queries)
        if filter_desc:
            df = filter_description(df)
        df = keep_columns(df)
        items = df.to_dict(orient="records")

    # Import into DB via Vercel API
    imp_res = requests.post(
        f"{base}/api/admin/import",
        headers=headers_secret("IMPORT_SECRET", "x-import-secret"),
        data=json.dumps({"userEmail": user_email, "items": items}),
        timeout=120,
    )
    imp_res.raise_for_status()
    imported = int(imp_res.json().get("imported", 0))

    # Update run
    requests.patch(
        f"{base}/api/fetch-runs/{run_id}/update",
        headers=headers_secret("FETCH_RUN_SECRET", "x-fetch-run-secret"),
        data=json.dumps({"status": "SUCCEEDED", "importedCount": imported, "error": None}),
        timeout=30,
    ).raise_for_status()

    logger.info("Done. imported=%s elapsed=%.1fs", imported, time.time() - t0)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        # Best effort: mark failed
        try:
            rid = os.environ.get("RUN_ID", "").strip()
            if rid:
                requests.patch(
                    f"{api_base()}/api/fetch-runs/{rid}/update",
                    headers=headers_secret("FETCH_RUN_SECRET", "x-fetch-run-secret"),
                    data=json.dumps({"status": "FAILED", "error": str(e)}),
                    timeout=30,
                )
        except Exception:
            pass
        raise

