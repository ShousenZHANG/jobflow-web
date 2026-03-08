"""Tests for Bing search proxy module."""
import pytest
from unittest.mock import patch, MagicMock
from cn_platforms.bing_search import (
    _parse_bing_results,
    _extract_salary,
    _extract_company_from_snippet,
    fetch_bing,
)


# -- Sample Bing HTML for parsing tests --

SAMPLE_BING_HTML = """
<html><body>
<ol id="b_results">
  <li class="b_algo">
    <h2><a href="https://www.zhipin.com/job_detail/abc123.html">前端工程师 - Boss直聘</a></h2>
    <div class="b_caption"><p>字节跳动招聘前端工程师，薪资15-25K，要求3年经验React开发</p></div>
  </li>
  <li class="b_algo">
    <h2><a href="https://www.zhipin.com/job_detail/def456.html">React开发工程师 - BOSS直聘</a></h2>
    <div class="b_caption"><p>阿里巴巴·React高级工程师，20-35K，杭州</p></div>
  </li>
  <li class="b_algo">
    <h2><a href="https://www.example.com/unrelated">Some unrelated result</a></h2>
    <div class="b_caption"><p>This should be filtered out</p></div>
  </li>
  <li class="b_algo">
    <h2><a href="https://www.zhipin.com/job_detail/ghi789.html">全栈开发</a></h2>
    <div class="b_caption"><p>创业公司全栈岗位</p></div>
  </li>
</ol>
</body></html>
"""

SAMPLE_LAGOU_HTML = """
<html><body>
<ol id="b_results">
  <li class="b_algo">
    <h2><a href="https://www.lagou.com/jobs/12345.html">Java后端 - 拉勾网</a></h2>
    <div class="b_caption"><p>腾讯Java后端，25-40K</p></div>
  </li>
</ol>
</body></html>
"""


class TestExtractSalary:
    def test_standard_k_range(self):
        assert _extract_salary("薪资15-25K") == "15-25K"

    def test_lowercase_k(self):
        assert _extract_salary("20k-35k") == "20k-35k"

    def test_chinese_unit(self):
        assert _extract_salary("15-25千") == "15-25千"

    def test_no_salary(self):
        assert _extract_salary("前端工程师招聘") == ""

    def test_salary_in_context(self):
        assert _extract_salary("字节跳动招聘前端，薪资15-25K，React") == "15-25K"


class TestExtractCompany:
    def test_boss_recruiting_pattern(self):
        result = _extract_company_from_snippet("字节跳动招聘前端工程师", "boss")
        assert result == "字节跳动"

    def test_boss_dot_pattern(self):
        result = _extract_company_from_snippet("阿里巴巴·React高级工程师", "boss")
        assert result == "阿里巴巴"

    def test_non_boss_returns_empty(self):
        result = _extract_company_from_snippet("字节跳动招聘前端工程师", "lagou")
        assert result == ""


class TestParseBingResults:
    def test_parses_boss_results(self):
        results = _parse_bing_results(SAMPLE_BING_HTML, "zhipin.com", "boss")
        # Should get 3 results (filters out example.com)
        assert len(results) == 3
        # First result
        assert results[0]["title"] == "前端工程师"
        assert results[0]["jobUrl"] == "https://www.zhipin.com/job_detail/abc123.html"
        assert results[0]["site"] == "bing_boss"
        assert results[0]["salary"] == "15-25K"
        # Second result
        assert results[1]["title"] == "React开发工程师"
        assert "20-35K" in results[1]["salary"]

    def test_parses_lagou_results(self):
        results = _parse_bing_results(SAMPLE_LAGOU_HTML, "lagou.com", "lagou")
        assert len(results) == 1
        assert results[0]["title"] == "Java后端"
        assert results[0]["site"] == "bing_lagou"
        assert "25-40K" in results[0]["salary"]

    def test_filters_non_target_domains(self):
        results = _parse_bing_results(SAMPLE_BING_HTML, "lagou.com", "lagou")
        assert len(results) == 0  # No lagou links in the boss HTML

    def test_empty_html(self):
        results = _parse_bing_results("<html><body></body></html>", "zhipin.com", "boss")
        assert results == []


class TestFetchBing:
    @patch("cn_platforms.bing_search.requests.Session")
    def test_fetches_and_parses(self, mock_session_cls):
        mock_session = MagicMock()
        mock_session_cls.return_value = mock_session
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.text = SAMPLE_BING_HTML
        mock_resp.raise_for_status = MagicMock()
        mock_session.get.return_value = mock_resp

        results = fetch_bing(
            queries=["前端工程师"],
            city="上海",
            sites=["boss"],
            results_per_query=10,
        )
        assert len(results) > 0
        assert all(r["location"] == "上海" for r in results)
        assert mock_session.get.called

    @patch("cn_platforms.bing_search.requests.Session")
    def test_handles_429_rate_limit(self, mock_session_cls):
        mock_session = MagicMock()
        mock_session_cls.return_value = mock_session
        mock_resp = MagicMock()
        mock_resp.status_code = 429
        mock_session.get.return_value = mock_resp

        results = fetch_bing(
            queries=["前端"],
            city="北京",
            sites=["boss"],
        )
        assert results == []

    @patch("cn_platforms.bing_search.requests.Session")
    def test_handles_network_error(self, mock_session_cls):
        mock_session = MagicMock()
        mock_session_cls.return_value = mock_session
        mock_session.get.side_effect = Exception("Network error")

        results = fetch_bing(
            queries=["前端"],
            city="杭州",
            sites=["boss"],
        )
        assert results == []

    @patch("cn_platforms.bing_search.requests.Session")
    def test_multiple_sites(self, mock_session_cls):
        mock_session = MagicMock()
        mock_session_cls.return_value = mock_session
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.text = SAMPLE_BING_HTML
        mock_resp.raise_for_status = MagicMock()
        mock_session.get.return_value = mock_resp

        results = fetch_bing(
            queries=["前端"],
            city="上海",
            sites=["boss", "lagou"],
            results_per_query=10,
        )
        # boss results should be found, lagou won't match (HTML only has zhipin links)
        boss_results = [r for r in results if "boss" in r["site"]]
        assert len(boss_results) > 0

    def test_unknown_platform_skipped(self):
        results = fetch_bing(
            queries=["前端"],
            city="上海",
            sites=["unknown_platform"],
        )
        assert results == []
