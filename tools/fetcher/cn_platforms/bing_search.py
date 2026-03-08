"""Bing search engine proxy for CN job platforms.

Instead of hitting job sites directly (which triggers anti-scraping),
we search Bing for "keyword city site:zhipin.com" and parse the results.
This works from any IP (including overseas GitHub Actions).
"""
import logging
import random
import re
import time
from typing import Any, Dict, List, Optional
from urllib.parse import quote, urlparse

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
]

# Map platform names to their domains for site: search
PLATFORM_SITES: Dict[str, str] = {
    "boss": "zhipin.com",
    "lagou": "lagou.com",
    "liepin": "liepin.com",
    "zhilian": "zhaopin.com",
}

RATE_LIMIT_DELAY = 3.0  # seconds between Bing requests

# Salary pattern: e.g. "15-25K", "15k-25k", "15-25千", "1-2万"
SALARY_RE = re.compile(
    r"(\d+)\s*[kK千万]?\s*[-–~]\s*(\d+)\s*[kK千万]",
)


def _rand_ua() -> str:
    return random.choice(USER_AGENTS)


def _extract_salary(text: str) -> str:
    """Try to extract salary range from search snippet."""
    m = SALARY_RE.search(text)
    return m.group(0) if m else ""


def _extract_company_from_snippet(snippet: str, site: str) -> str:
    """Try to extract company name from Bing snippet text."""
    # Bing snippets for job sites often include "公司名 - 职位" or "公司名招聘"
    # This is best-effort
    if site == "boss":
        # Boss snippets: "公司名招聘前端工程师" or "公司名 · 前端"
        m = re.match(r"^(.{2,20}?)(?:招聘|·|—|-|发布)", snippet)
        if m:
            return m.group(1).strip()
    return ""


def _parse_bing_results(html: str, site_domain: str, site_name: str) -> List[Dict[str, Any]]:
    """Parse Bing search result HTML into job dicts."""
    soup = BeautifulSoup(html, "html.parser")
    results: List[Dict[str, Any]] = []

    for item in soup.select("li.b_algo"):
        title_el = item.select_one("h2 a")
        if not title_el:
            continue

        title_text = title_el.get_text(strip=True)
        url = title_el.get("href", "")

        # Filter: only keep results from the target site
        parsed = urlparse(url)
        if site_domain not in parsed.netloc:
            continue

        snippet_el = item.select_one(".b_caption p") or item.select_one("p")
        snippet = snippet_el.get_text(strip=True) if snippet_el else ""

        # Clean title: remove site suffixes like "- Boss直聘", "- 拉勾网"
        clean_title = re.sub(
            r"\s*[-–|_·]\s*(Boss直聘|BOSS直聘|拉勾网|拉勾|猎聘|猎聘网|智联招聘)\s*$",
            "",
            title_text,
        ).strip()
        if not clean_title:
            clean_title = title_text

        salary = _extract_salary(title_text + " " + snippet)
        company = _extract_company_from_snippet(snippet, site_name)

        results.append({
            "title": clean_title,
            "company": company,
            "location": "",  # Will be filled by city param in caller
            "jobUrl": url,
            "description": snippet,
            "salary": salary,
            "site": f"bing_{site_name}",
        })

    return results


def fetch_bing(
    queries: List[str],
    city: str,
    sites: Optional[List[str]] = None,
    salary_range: Optional[Dict[str, int]] = None,
    results_per_query: int = 30,
) -> List[Dict[str, Any]]:
    """Fetch job listings via Bing search engine proxy.

    For each query+site combo, searches Bing with "query city site:domain"
    and parses the organic results.

    Args:
        queries: Job title keywords, e.g. ["前端工程师", "React开发"]
        city: Chinese city name, e.g. "上海"
        sites: Platform names to search via Bing, e.g. ["boss", "lagou"].
               Defaults to ["boss", "lagou"] (the ones that block overseas IPs).
        salary_range: Optional min/max filter (applied post-fetch).
        results_per_query: Target number of results per query+site combo.
    """
    if sites is None:
        sites = ["boss", "lagou"]

    all_results: List[Dict[str, Any]] = []
    session = requests.Session()

    for site_name in sites:
        domain = PLATFORM_SITES.get(site_name)
        if not domain:
            logger.warning("Unknown platform for Bing search: %s", site_name)
            continue

        for query in queries:
            search_query = f"{query} {city} site:{domain}"
            # Bing pagination: first=1, first=11, first=21, ...
            fetched = 0
            for offset in range(0, results_per_query, 10):
                params = {
                    "q": search_query,
                    "first": str(offset + 1),
                    "count": "10",
                }
                try:
                    resp = session.get(
                        "https://www.bing.com/search",
                        params=params,
                        headers={
                            "User-Agent": _rand_ua(),
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                        },
                        timeout=15,
                    )
                    if resp.status_code == 429:
                        logger.warning("Bing rate limited for '%s' site:%s", query, domain)
                        break
                    resp.raise_for_status()

                    page_results = _parse_bing_results(resp.text, domain, site_name)
                    if not page_results:
                        break

                    # Fill in city for results missing location
                    for r in page_results:
                        if not r["location"]:
                            r["location"] = city

                    all_results.extend(page_results)
                    fetched += len(page_results)
                    logger.info(
                        "Bing query='%s' site=%s offset=%d fetched=%d",
                        query, domain, offset, len(page_results),
                    )

                    if fetched >= results_per_query:
                        break
                except Exception as e:
                    logger.error("Bing fetch error query='%s' site=%s: %s", query, domain, e)
                    break

                time.sleep(RATE_LIMIT_DELAY + random.uniform(0, 1))

    logger.info("Bing total: %d results", len(all_results))
    return all_results
