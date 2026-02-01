import unittest

import os
import sys

import pandas as pd

sys.path.append(os.path.dirname(__file__))
import run_jobspy as rj  # noqa: E402


class RunJobspyDedupeTests(unittest.TestCase):
    def test_dedupe_jobs_collapses_title_company_location(self):
        df = pd.DataFrame(
            [
                {
                    "job_url": "https://example.com/a?ref=1",
                    "title": "Frontend Engineer",
                    "company": "Acme",
                    "location": "Sydney",
                },
                {
                    "job_url": "https://example.com/a?ref=2",
                    "title": "Frontend Engineer",
                    "company": "Acme",
                    "location": "Sydney",
                },
            ]
        )

        deduped = rj.dedupe_jobs(df)
        self.assertEqual(len(deduped), 1)

    def test_filter_title_includes_description_match_when_enforced(self):
        df = pd.DataFrame(
            [
                {
                    "title": "Senior Software Engineer",
                    "description": "Build web apps.",
                    "company": "Acme",
                    "location": "Sydney",
                },
                {
                    "title": "Software Engineer",
                    "description": "Work on product.",
                    "company": "Beta",
                    "location": "Sydney",
                },
            ]
        )

        out = rj.filter_title(
            df,
            queries=["Software Engineer"],
            enforce_include=True,
            exclude_terms=["senior"],
        )
        self.assertEqual(len(out), 1)
        self.assertEqual(out.iloc[0]["title"], "Software Engineer")

    def test_filter_description_only_drops_hard_required_years(self):
        df = pd.DataFrame(
            [
                {
                    "title": "Software Engineer",
                    "description": "Minimum of 5 years of experience is required.",
                    "company": "Acme",
                    "location": "Sydney",
                },
                {
                    "title": "Frontend Engineer",
                    "description": "5+ years experience preferred.",
                    "company": "Beta",
                    "location": "Sydney",
                },
            ]
        )

        out = rj.filter_description(
            df,
            exclude_rights=False,
            exclude_clearance=False,
            exclude_sponsorship=False,
            exclude_years=[5],
        )
        self.assertEqual(len(out), 1)
        self.assertEqual(out.iloc[0]["title"], "Frontend Engineer")

    def test_filter_description_drops_years_under_requirements_section(self):
        df = pd.DataFrame(
            [
                {
                    "title": "Web Developer",
                    "description": (
                        "What we're looking for\n\n"
                        "5-10 years experience as a Web Developer working on customer-facing websites."
                    ),
                    "company": "Acme",
                    "location": "Sydney",
                },
                {
                    "title": "Frontend Engineer",
                    "description": "Nice to have: 5+ years experience.",
                    "company": "Beta",
                    "location": "Sydney",
                },
            ]
        )

        out = rj.filter_description(
            df,
            exclude_rights=False,
            exclude_clearance=False,
            exclude_sponsorship=False,
            exclude_years=[5],
        )
        self.assertEqual(len(out), 1)
        self.assertEqual(out.iloc[0]["title"], "Frontend Engineer")

    def test_filter_description_only_drops_hard_rights_requirement(self):
        df = pd.DataFrame(
            [
                {
                    "title": "Software Engineer",
                    "description": "Australian citizen required for this role.",
                    "company": "Acme",
                    "location": "Sydney",
                },
                {
                    "title": "Data Engineer",
                    "description": (
                        "Applicant must be an Australian Citizen or Australian Permanent Resident "
                        "to be considered."
                    ),
                    "company": "Gamma",
                    "location": "Sydney",
                },
                {
                    "title": "Frontend Engineer",
                    "description": "Australian citizens and PR welcome to apply.",
                    "company": "Beta",
                    "location": "Sydney",
                },
            ]
        )

        out = rj.filter_description(
            df,
            exclude_rights=True,
            exclude_clearance=False,
            exclude_sponsorship=False,
            exclude_years=None,
        )
        self.assertEqual(len(out), 1)
        self.assertEqual(out.iloc[0]["title"], "Frontend Engineer")

    def test_filter_description_only_drops_hard_clearance_requirement(self):
        df = pd.DataFrame(
            [
                {
                    "title": "Software Engineer",
                    "description": "Baseline clearance required.",
                    "company": "Acme",
                    "location": "Sydney",
                },
                {
                    "title": "Frontend Engineer",
                    "description": "Security clearance preferred.",
                    "company": "Beta",
                    "location": "Sydney",
                },
            ]
        )

        out = rj.filter_description(
            df,
            exclude_rights=False,
            exclude_clearance=True,
            exclude_sponsorship=False,
            exclude_years=None,
        )
        self.assertEqual(len(out), 1)
        self.assertEqual(out.iloc[0]["title"], "Frontend Engineer")

    def test_filter_description_only_drops_hard_sponsorship_requirement(self):
        df = pd.DataFrame(
            [
                {
                    "title": "Software Engineer",
                    "description": "Sponsorship not available for this role.",
                    "company": "Acme",
                    "location": "Sydney",
                },
                {
                    "title": "Frontend Engineer",
                    "description": "Sponsorship may be available for the right candidate.",
                    "company": "Beta",
                    "location": "Sydney",
                },
            ]
        )

        out = rj.filter_description(
            df,
            exclude_rights=False,
            exclude_clearance=False,
            exclude_sponsorship=True,
            exclude_years=None,
        )
        self.assertEqual(len(out), 1)
        self.assertEqual(out.iloc[0]["title"], "Frontend Engineer")

    def test_clean_description_lightweight_preserves_structure(self):
        raw = "<p>Minimum of 5 years required.</p> Must-have: Python."
        cleaned = rj._clean_description_text(raw)
        self.assertIn("Minimum of 5 years required.", cleaned)
        self.assertIn("Must-have: Python.", cleaned)
        self.assertNotIn("<p>", cleaned)


if __name__ == "__main__":
    unittest.main()
