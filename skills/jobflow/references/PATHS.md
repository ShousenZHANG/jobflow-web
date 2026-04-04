# Joblit paths reference

Quick index of the most commonly used locations.

## App routes (pages)

- `app/(app)/jobs/` — Jobs list + detail, filters, manual Add job (AU), Generate CV/CL
- `app/(app)/fetch/` — Create FetchRun (AU: JobSpy/LinkedIn; CN: platforms)
- `app/(app)/resume/` — Master resume editor
- `app/(app)/resume/rules/` — Prompt rules UI (download skill pack, manage templates)
- `app/(auth)/`, `app/(marketing)/` — auth + marketing pages

## API routes

- `GET/POST /api/jobs` — list jobs; manual add job (POST) in AU
- `GET/PATCH/DELETE /api/jobs/[id]` — job detail, status update, delete
- `POST /api/fetch-runs` — create FetchRun
- `POST /api/fetch-runs/[id]/trigger` — dispatch GitHub Actions workflow
- `GET /api/fetch-runs/[id]/config` — worker pulls run config
- `PATCH /api/fetch-runs/[id]/update` — worker updates status/imported count
- `POST /api/admin/import` — bulk job import (guarded by `x-import-secret`)
- `POST /api/applications/prompt` — build prompt + `promptMeta` + expected schema
- `POST /api/applications/manual-generate` — import strict JSON + render PDFs (requires `promptMeta`)
- `app/api/prompt-rules/*` — prompt templates + skill pack download
- `app/api/application-batches/*` — batch CV/CL workflows

## Server and data

- `lib/shared/canonicalizeJobUrl.ts` — stable URL normalization
- `lib/server/ai/*` — prompt contract, skill pack builder, schema validation
- `lib/server/latex/*` — LaTeX render for resume/cover
- `prisma/schema.prisma` — DB models

## Fetch workers (Python)

- `tools/fetcher/run_jobspy.py` — JobSpy runner (currently LinkedIn)
- `tools/fetcher/run_cn_fetcher.py` — CN platforms runner
- `tools/fetcher/cn_platforms/*` — boss/lagou/liepin/zhilian + search proxy utilities

