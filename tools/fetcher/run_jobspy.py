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

SCRAPE_RETRIES = 2
SCRAPE_BACKOFF_SEC = 2
IMPORT_RETRIES = 2


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
    r'citizen|citizenship|australian\s+citizen|au\s+citizen|nz\s+citizen'
    r')\b'
)

EXCLUDE_CLEARANCE_RE = re.compile(
    r'(?i)\b(?:baseline\s+clearance|NV1|NV2|security\s+clearance)\b'
)

EXCLUDE_SPONSORSHIP_RE = re.compile(
    r'(?i)\b(?:'
    r'sponsorship\s+not\s+available|'
    r'sponsorship\s+unavailable|'
    r'no\s+sponsorship|'
    r'no\s+visa\s+sponsorship|'
    r'will\s+not\s+sponsor|'
    r'cannot\s+sponsor|'
    r'unable\s+to\s+sponsor|'
    r'not\s+able\s+to\s+sponsor'
    r')\b'
)

HARD_CLEARANCE_RE = re.compile(
    r'(?i)\b(?:baseline\s+clearance|NV1|NV2|security\s+clearance)\b'
    r'(?:(?:[^.]{0,40})\b(?:required|must\s+have|mandatory|only)\b)'
)

SOFT_CLEARANCE_RE = re.compile(
    r'(?i)\b(?:baseline\s+clearance|NV1|NV2|security\s+clearance)\b'
    r'(?:(?:[^.]{0,40})\b(?:preferred|nice\s+to\s+have|bonus|a\s+plus)\b)'
)

HARD_RIGHTS_RE = re.compile(
    r'(?i)\b(?:required|must\s+have|must\s+be|mandatory|only)\b'
    r'(?:(?:[^.]{0,40})\b(?:'
    r'(?:australian\s+)?citizen(?:ship)?|'
    r'(?:permanent\s+resident|permanent\s+residency|PR)|'
    r'(?:nz\s+citizen|new\s+zealand\s+citizen)'
    r')\b)'
    r'|'
    r'\b(?:'
    r'(?:australian\s+)?citizen(?:ship)?|'
    r'(?:permanent\s+resident|permanent\s+residency|PR)|'
    r'(?:nz\s+citizen|new\s+zealand\s+citizen)'
    r')\b'
    r'(?:(?:[^.]{0,40})\b(?:required|must\s+have|must\s+be|mandatory|only)\b)'
)

SOFT_RIGHTS_RE = re.compile(
    r'(?i)\b(?:'
    r'(?:citizen|citizenship|permanent\s+resident|permanent\s+residency|PR|nz\s+citizen|new\s+zealand\s+citizen)'
    r')\b'
    r'(?:(?:[^.]{0,40})\b(?:welcome|eligible|encouraged)\b)'
)


def _build_query_phrases(queries: List[str]) -> List[str]:
    phrases: List[str] = []
    for q in queries or []:
        q2 = _normalize_text((q or "").strip().strip('"').strip("'"))
        if q2:
            phrases.append(q2.lower())
    return phrases


def _normalize_text(text: str) -> str:
    if not text:
        return ""
    s = str(text).lower()
    # Normalize separators so "full-stack" matches "full stack".
    s = re.sub(r"[^a-z0-9]+", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _fingerprint_value(value: Any) -> str:
    return _normalize_text(value or "")


def dedupe_jobs(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return df
    out = df.copy()
    out["fingerprint"] = (
        out.get("title", "").apply(_fingerprint_value)
        + "|"
        + out.get("company", "").apply(_fingerprint_value)
        + "|"
        + out.get("location", "").apply(_fingerprint_value)
    )
    out = out.drop_duplicates(subset=["fingerprint"], keep="first")
    return out.drop(columns=["fingerprint"], errors="ignore")


def _build_exclude_title_re(terms: List[str]) -> Optional[re.Pattern]:
    cleaned = [re.escape(t.strip().lower()) for t in terms if t and t.strip()]
    if not cleaned:
        return None
    return re.compile(r'(?i)\b(?:' + "|".join(cleaned) + r')\b')


def filter_title(
    df: pd.DataFrame,
    queries: List[str],
    enforce_include: bool,
    exclude_terms: Optional[List[str]] = None,
) -> pd.DataFrame:
    if df.empty:
        return df
    t = df["title"].fillna("")
    exclude_re = _build_exclude_title_re(exclude_terms or [])
    if exclude_re:
        exc = t.apply(lambda s: bool(exclude_re.search(s)))
    else:
        exc = t.apply(lambda s: False)
    out = df[~exc].copy()
    # Mainline behavior: do not enforce query inclusion here. Filters should be explicit,
    # e.g., exclude_terms (like "senior") selected by the user.
    return out


def _build_exp_years_re(years: List[int]) -> Optional[re.Pattern]:
    if not years:
        return None
    nums = "|".join(str(y) for y in sorted(set(years)))
    pattern = rf'''(?ix)
    (?:\b|[^a-z])
    (?:minimum\s+of|at\s+least|minimum)?
    \s*
    (?:
        (?:{nums})
        (?:\s*[\+\-–—]\s*\d+)? 
    )
    \s*
    (?:years?|yrs?|y[.]?)[’']?
    (?:\s*(?:of))?
    (?:\s+\w{{0,3}}){{0,2}}?
    \s*(?:
        experience|exp|work\s+experience|industry\s+experience|professional\s+experience|
        relevant\s+experience|commercial\s+experience|hands[-\s]?on\s+experience
    )\b
    |
    (?:\b|[^a-z])
    (?:minimum\s+of|at\s+least|minimum)?
    \s*
    (?:
        (?:{nums})
        (?:\s*[\+\-–—]\s*\d+)? 
    )
    \s*
    (?:years?|yrs?|y[.]?)[’']?
    \s*(?:in|within|as|on)
    (?:\s+\w{{0,4}}){{0,6}}?
    \s*(?:role|roles|position|industry|field|capacity|function|environment)\b
    '''
    return re.compile(pattern, re.UNICODE)


def _extract_min_years_from_text(text: str) -> Optional[int]:
    if not text:
        return None
    s = str(text).lower()
    s = s.replace("–", "-").replace("—", "-")
    s = s.replace("＋", "+").replace("﹢", "+")
    s = re.sub(r"\s+", " ", s)

    candidates: List[int] = []

    # at least / minimum of X years
    for m in re.finditer(r"\b(?:at\s+least|minimum(?:\s+of)?)\s+(\d{1,2})\s*(?:years?|yrs?)\b", s):
        candidates.append(int(m.group(1)))

    # X+ years / X yrs+
    for m in re.finditer(r"\b(\d{1,2})\s*\+\s*(?:years?|yrs?)\b", s):
        candidates.append(int(m.group(1)))
    for m in re.finditer(r"\b(\d{1,2})\s*(?:years?|yrs?)\s*\+\b", s):
        candidates.append(int(m.group(1)))

    # X-Y years / X to Y years
    for m in re.finditer(r"\b(\d{1,2})\s*(?:-|\sto\s)\s*(\d{1,2})\s*(?:years?|yrs?)\b", s):
        candidates.append(int(m.group(1)))

    # X years of experience / X years experience
    for m in re.finditer(r"\b(\d{1,2})\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)\b", s):
        candidates.append(int(m.group(1)))

    if not candidates:
        return None
    return min(candidates)


def _extract_required_min_years_from_text(text: str) -> Optional[int]:
    if not text:
        return None
    s = str(text).lower()
    s = s.replace("\u2013", "-").replace("\u2014", "-")
    s = s.replace("\uff0b", "+")
    s = re.sub(r"\s+", " ", s)

    # Skip soft qualifiers
    if re.search(r"\b(preferred|nice to have|nice-to-have|bonus|plus|desired|a plus)\b", s):
        return None

    hard_markers = r"(required|must have|must-have|mandatory|minimum of|at least)"
    section_markers = r"(what we'?re looking for|requirements|qualifications|must haves|must-haves)"

    candidates: List[int] = []
    for m in re.finditer(rf"\b{hard_markers}\s+(\d{{1,2}})\s*(?:years?|yrs?)\b", s):
        candidates.append(int(m.group(2)))

    for m in re.finditer(rf"\b(\d{{1,2}})\s*\+\s*(?:years?|yrs?)\b.*\b{hard_markers}\b", s):
        candidates.append(int(m.group(1)))

    for m in re.finditer(rf"\b{hard_markers}\b.*\b(\d{{1,2}})\s*(?:years?|yrs?)\b", s):
        candidates.append(int(m.group(2)))

    if not candidates and re.search(rf"\b{section_markers}\b", s):
        fallback = _extract_min_years_from_text(s)
        if fallback is not None:
            candidates.append(fallback)

    if not candidates:
        return None
    return min(candidates)


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
    if exclude_years:
        thresholds = sorted(set(int(y) for y in exclude_years))
        min_years = desc.apply(_extract_required_min_years_from_text)
        years = min_years.apply(lambda v: v is not None and any(v >= y for y in thresholds))
        matched_years_count = int(years.sum())
    else:
        years = pd.Series(False, index=desc.index)
        matched_years_count = 0
    if exclude_rights:
        hard_rights = desc.str.contains(HARD_RIGHTS_RE, na=False)
        soft_rights = desc.str.contains(SOFT_RIGHTS_RE, na=False)
        rights = hard_rights & ~soft_rights
    else:
        rights = pd.Series(False, index=desc.index)
    if exclude_clearance:
        hard_clearance = desc.str.contains(HARD_CLEARANCE_RE, na=False)
        soft_clearance = desc.str.contains(SOFT_CLEARANCE_RE, na=False)
        clearance = hard_clearance & ~soft_clearance
    else:
        clearance = pd.Series(False, index=desc.index)
    sponsorship = (
        desc.str.contains(EXCLUDE_SPONSORSHIP_RE, na=False)
        if exclude_sponsorship
        else pd.Series(False, index=desc.index)
    )
    filtered = df[~(years | rights | clearance | sponsorship)].copy()
    if exclude_years:
        logger.info("Description filter: years matched=%s thresholds=%s", matched_years_count, thresholds)
    return filtered


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
    # Lightweight cleanup: remove HTML and normalize common escape artifacts
    s = s.replace("\u2013", "-").replace("\u2014", "-")
    s = s.replace("\uff0b", "+").replace("\uff1a", ":")
    s = s.replace("\\+", "+").replace("\\-", "-").replace("\\&", "&")
    s = s.replace("\\/", "/").replace("\\(", "(").replace("\\)", ")")
    s = s.replace("\\_", "_").replace("\\*", "*").replace("\\#", "#")
    s = s.replace("\\'", "'").replace('\\"', '"')
    s = s.replace("\\", "")
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"[ \t\r\f\v]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n\n", s)
    return s.strip()


def clean_description(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty or "description" not in df.columns:
        return df
    out = df.copy()
    out["description"] = out["description"].fillna("").apply(_clean_description_text)
    return out


def fetch_linkedin(queries: List[str], location: str, hours_old: int, results_wanted: int) -> pd.DataFrame:
    dfs: List[pd.DataFrame] = []
    for term in queries:
        df = None
        for attempt in range(SCRAPE_RETRIES + 1):
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
                break
            except Exception as e:
                if attempt >= SCRAPE_RETRIES:
                    logger.error("scrape_jobs failed term=%s error=%s", term, e)
                    df = None
                else:
                    time.sleep(SCRAPE_BACKOFF_SEC * (attempt + 1))
        if df is None:
            continue
        if df is None or df.empty:
            continue
        df = df.loc[:, df.notna().any(axis=0)]
        if "job_url" in df.columns:
            df = df.drop_duplicates(subset=["job_url"], keep="first")
        df["source_query"] = term
        dfs.append(df)
    if not dfs:
        return pd.DataFrame()
    out = pd.concat(dfs, ignore_index=True, sort=False)
    if "job_url" in out.columns:
        out = out.drop_duplicates(subset=["job_url"], keep="first")
    return out


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

    exclude_rights = apply_excludes and "identity_requirement" in exclude_desc_rules
    exclude_clearance = False
    exclude_sponsorship = False
    exclude_years: List[int] = []
    if apply_excludes:
        if "exp_3" in exclude_desc_rules:
            exclude_years.append(3)
        if "exp_4" in exclude_desc_rules:
            exclude_years.append(4)
        if "exp_5" in exclude_desc_rules:
            exclude_years.append(5)
        if "exp_7" in exclude_desc_rules:
            exclude_years.append(7)

    filter_desc = apply_excludes and bool(
        exclude_rights or exclude_clearance or exclude_sponsorship or exclude_years
    )

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
        logger.info("Fetched %s rows before filtering", len(df))
        df = filter_title(
            df,
            search_terms,
            enforce_include=include_from_queries,
            exclude_terms=exclude_title_terms if apply_excludes else None,
        )
        logger.info("Rows after title filter: %s", len(df))
        # Clean before description exclusion for more consistent matching
        df = clean_description(df)
        if filter_desc:
            df = filter_description(
                df,
                exclude_rights=exclude_rights,
                exclude_clearance=exclude_clearance,
                exclude_sponsorship=exclude_sponsorship,
                exclude_years=exclude_years,
            )
            logger.info("Rows after description filter: %s", len(df))
        df = keep_columns(df)
        df = dedupe_jobs(df)
        items = df.to_dict(orient="records")

    # Import into DB via Vercel API (chunked to avoid payload/time limits)
    imported = 0
    if items:
        batch_size = 50
        for i in range(0, len(items), batch_size):
            batch = items[i : i + batch_size]
            imp_res = None
            for attempt in range(IMPORT_RETRIES + 1):
                imp_res = requests.post(
                    f"{base}/api/admin/import",
                    headers=headers_secret("IMPORT_SECRET", "x-import-secret"),
                    data=json.dumps({"userEmail": user_email, "items": batch}),
                    timeout=120,
                )
                if imp_res.ok:
                    break
                if attempt >= IMPORT_RETRIES:
                    raise RuntimeError(
                        f"import failed status={imp_res.status_code} body={imp_res.text}"
                    )
                time.sleep(2 * (attempt + 1))
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
