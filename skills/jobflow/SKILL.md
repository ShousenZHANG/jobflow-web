---
name: jobflow
description: Use when working in the Jobflow repo (jobflow-web) or when discussing job fetch (JobSpy/LinkedIn/Seek/CN platforms), resume/cover tailoring, prompt rules/skill pack, or PDF export. Provides structure, key paths, and non-negotiable conventions.
---

# Jobflow (jobflow-web)

Job-search command center: fetch → triage → tailor CV/CL → export PDFs.

## When to Use

- You are in the `ShousenZHANG/jobflow-web` repo, or the user mentions Jobflow/jobflow-web.
- The task involves job intake (JobSpy/LinkedIn, Seek manual add, CN platforms), prompt rules/skill pack, CV/CL generation, batch workflows, or PDF export.

## Mental Model

- **Intake**
  - AU: FetchRun → GitHub Actions → Python JobSpy → import jobs (dedupe + tombstones)
  - CN: FetchRun → GitHub Actions → Python CN fetcher → import jobs
- **Workspace**: Jobs list + detail, search/filter, status `NEW`/`APPLIED`/`REJECTED`
- **Tailoring**: prompt → external model → strict JSON import → LaTeX render → PDF

## Key Paths (start here)

- UI pages: `app/(app)/` (`jobs`, `fetch`, `resume`, `resume/rules`)
- API routes: `app/api/` (`jobs`, `fetch-runs`, `applications`, `application-batches`, `prompt-rules`, `admin/import`)
- Server modules: `lib/server/` (AI prompts, LaTeX/PDF, persistence)
- Fetch workers: `tools/fetcher/` (`run_jobspy.py`, `run_cn_fetcher.py`, `cn_platforms/`)
- Schema: `prisma/schema.prisma`

More: `references/PATHS.md` and `references/FLOWS.md`.

## Non‑Negotiable Rules

- **Job dedupe**: unique `(userId, jobUrl)`; normalize with `canonicalizeJobUrl()`.
- **Manual generate**: never call `manual-generate` without the matching `promptMeta` from the prompt response.
- **Batch run**: do not use `/trigger` for Codex/batch execution (disabled by design); follow `AGENTS.md`.

