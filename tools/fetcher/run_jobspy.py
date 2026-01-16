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
    r'must\s+have\s+(?:full\s+)?work(?:ing)?\s+rights'
    r')\b'
)

EXCLUDE_CLEARANCE_RE = re.compile(
    r'(?i)\b(?:baseline\s+clearance|NV1|NV2|security\s+clearance)\b'
)

EXCLUDE_SPONSORSHIP_RE = re.compile(
    r'(?i)\b(?:sponsorship\s+not\s+available|no\s+sponsorship)\b'
)


def _build_query_phrases(queries: List[str]) -> List[str]:
    phrases: List[str] = []
    for q in queries or []:
        q2 = (q or "").strip().strip('"').strip("'")
        if q2:
            phrases.append(q2.lower())
    return phrases


def _build_exclude_title_re(terms: List[str]) -> Optional[re.Pattern]:
    cleaned = [re.escape(t.strip().lower()) for t in terms if t and t.strip()]
    if not cleaned:
        return None
    return re.compile(r'(?i)\\b(?:' + "|".join(cleaned) + r')\\b')


def filter_title(
    df: pd.DataFrame,
    queries: List[str],
    enforce_include: bool,
    exclude_terms: Optional[List[str]] = None,
    use_default_excludes: bool = False,
) -> pd.DataFrame:
    if df.empty:
        return df
    t = df["title"].fillna("")
    exclude_re = _build_exclude_title_re(exclude_terms or [])
    if exclude_re:
        exc = t.apply(lambda s: bool(exclude_re.search(s)))
    elif use_default_excludes:
        exc = t.apply(lambda s: bool(TITLE_EXCLUDE_PAT.search(s)))
    else:
        exc = t.apply(lambda s: False)
    out = df[~exc].copy()
    if enforce_include:
        phrases = _build_query_phrases(queries)
        if phrases:
            low = out["title"].fillna("").str.lower()
            mask = low.apply(lambda s: any(p in s for p in phrases))
            out = out[mask].copy()
    return out


def _build_exp_years_re(years: List[int]) -> Optional[re.Pattern]:
    if not years:
        return None
    nums = "|".join(str(y) for y in sorted(set(years)))
    pattern = rf'''(?ix)
    (?:\\b|[^a-z])
    (?:
        (?:{nums})
        (?:\\s*[\\+\\-–—]\\s*\\d+)? 
    )
    \\s*
    (?:years?|yrs?|y[.]?)
    (?:\\s*(?:of|in))?
    (?:\\s+\\w{{0,3}}){{0,2}}?
    \\s*(?:experience|exp|work\\s+experience)\\b
    '''
    return re.compile(pattern, re.UNICODE)


def filter_description(
    df: pd.DataFrame,
    exclude_rights: bool,
    exclude_clearance: bool,
    exclude_sponsorship: bool,
    exclude_years: Optional[List[int]] = None,
) -> pd.DataFrame:
    if df.empty or "description" not in df.columns:
        return df
    desc = df["description"].fillna("")
    years_re = _build_exp_years_re(exclude_years or [])
    years = desc.str.contains(years_re, na=False) if years_re else pd.Series(False, index=desc.index)
    rights = desc.str.contains(EXCLUDE_RIGHTS_RE, na=False) if exclude_rights else pd.Series(False, index=desc.index)
    clearance = (
        desc.str.contains(EXCLUDE_CLEARANCE_RE, na=False)
        if exclude_clearance
        else pd.Series(False, index=desc.index)
    )
    sponsorship = (
        desc.str.contains(EXCLUDE_SPONSORSHIP_RE, na=False)
        if exclude_sponsorship
        else pd.Series(False, index=desc.index)
    )
    return df[~(years | rights | clearance | sponsorship)].copy()


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


def _clean_description_text(text: str) -> str:
    if not text:
        return ""
    s = str(text)
    # Remove common escape backslashes (e.g., "2\+")
    s = s.replace("\\+", "+").replace("\\-", "-").replace("\\&", "&")
    s = s.replace("\\/", "/").replace("\\(", "(").replace("\\)", ")")
    s = s.replace("\\_", "_").replace("\\*", "*").replace("\\#", "#")
    s = s.replace("\\'", "'").replace('\\"', '"')
    # Drop stray backslashes that remain
    s = s.replace("\\", "")
    # Remove HTML tags
    s = re.sub(r"<[^>]+>", " ", s)
    # Remove markdown emphasis and headers
    s = re.sub(r"[*_`#]{1,}", "", s)
    # Normalize bullets and separators
    s = re.sub(r"\s*[•·]\s*", "\n- ", s)
    s = re.sub(r"\s*-\s*", "\n- ", s)
    # Collapse whitespace and blank lines
    s = re.sub(r"[ \t\r\f\v]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n\n", s)
    s = s.strip()
    return s


def clean_description(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty or "description" not in df.columns:
        return df
    out = df.copy()
    out["description"] = out["description"].fillna("").apply(_clean_description_text)
    return out


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
    raw_queries = run["queries"] or {}
    if isinstance(raw_queries, list):
        queries = raw_queries
        title_query = queries[0] if queries else ""
        apply_excludes = bool(run.get("filterDescription") if run.get("filterDescription") is not None else True)
        exclude_title_terms: List[str] = []
        exclude_desc_rules: List[str] = []
    elif isinstance(raw_queries, dict):
        title_query = (raw_queries.get("title") or "").strip()
        queries = raw_queries.get("queries") or ([title_query] if title_query else [])
        apply_excludes = bool(raw_queries.get("applyExcludes", True))
        exclude_title_terms = raw_queries.get("excludeTitleTerms") or []
        exclude_desc_rules = raw_queries.get("excludeDescriptionRules") or []
    else:
        raise RuntimeError("run.queries must be a list or object")

    location = run.get("location") or "Sydney, New South Wales, Australia"
    hours_old = int(run.get("hoursOld") or 48)
    results_wanted = int(run.get("resultsWanted") or 120)
    include_from_queries = bool(run.get("includeFromQueries") or False)
    filter_desc = apply_excludes and bool(
        exclude_rights or exclude_clearance or exclude_sponsorship or exclude_years
    )

    exclude_rights = apply_excludes and "work_rights" in exclude_desc_rules
    exclude_clearance = apply_excludes and "security_clearance" in exclude_desc_rules
    exclude_sponsorship = apply_excludes and "no_sponsorship" in exclude_desc_rules
    exclude_years: List[int] = []
    if apply_excludes:
        if "exp_4" in exclude_desc_rules:
            exclude_years.append(4)
        if "exp_5" in exclude_desc_rules:
            exclude_years.append(5)
        if "exp_7" in exclude_desc_rules:
            exclude_years.append(7)

    # Mark running
    requests.patch(
        f"{base}/api/fetch-runs/{run_id}/update",
        headers=headers_secret("FETCH_RUN_SECRET", "x-fetch-run-secret"),
        data=json.dumps({"status": "RUNNING"}),
        timeout=30,
    ).raise_for_status()

    t0 = time.time()
    search_terms = [title_query] if title_query else queries
    df = fetch_linkedin(search_terms, location, hours_old, results_wanted)
    if df.empty:
        items: List[Dict[str, Any]] = []
    else:
        df = filter_title(
            df,
            search_terms,
            enforce_include=include_from_queries,
            exclude_terms=exclude_title_terms if apply_excludes else None,
            use_default_excludes=False,
        )
        if filter_desc:
            df = filter_description(
                df,
                exclude_rights=exclude_rights,
                exclude_clearance=exclude_clearance,
                exclude_sponsorship=exclude_sponsorship,
                exclude_years=exclude_years,
            )
        df = clean_description(df)
        df = keep_columns(df)
        items = df.to_dict(orient="records")

    # Import into DB via Vercel API (chunked to avoid payload/time limits)
    imported = 0
    if items:
        batch_size = 50
        for i in range(0, len(items), batch_size):
            batch = items[i : i + batch_size]
            imp_res = requests.post(
                f"{base}/api/admin/import",
                headers=headers_secret("IMPORT_SECRET", "x-import-secret"),
                data=json.dumps({"userEmail": user_email, "items": batch}),
                timeout=120,
            )
            if not imp_res.ok:
                raise RuntimeError(f"import failed status={imp_res.status_code} body={imp_res.text}")
            imported += int(imp_res.json().get("imported", 0))

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

