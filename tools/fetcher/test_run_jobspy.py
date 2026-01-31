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


if __name__ == "__main__":
    unittest.main()
