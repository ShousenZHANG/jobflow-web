# Joblit flows (high signal)

## 1) FetchRun → GitHub Actions → import → Jobs list

1. UI creates FetchRun: `POST /api/fetch-runs` (market AU or CN).
2. UI triggers: `POST /api/fetch-runs/:id/trigger`.
3. API dispatches GitHub Actions workflow:
   - AU: `jobspy-fetch.yml` (Python `tools/fetcher/run_jobspy.py`)
   - CN: `cn-fetch.yml` (Python `tools/fetcher/run_cn_fetcher.py`)
4. Worker pulls config: `GET /api/fetch-runs/:id/config` (guarded by secret).
5. Worker imports jobs: `POST /api/admin/import` (guarded by `x-import-secret`).
6. Jobs appear in `GET /api/jobs` and the `/jobs` UI.

## 2) Manual Add job (Seek) in AU

1. In `/jobs` (EN/AU), user clicks **Add job**.
2. Client submits `POST /api/jobs` with `{ jobUrl, title, ... }`.
3. API:
   - Canonicalizes URL
   - Rejects duplicates with `409 JOB_URL_EXISTS`
   - Creates job otherwise
4. Client invalidates `jobs` queries and the job appears in list.

## 3) External model CV/CL generation (skill pack + strict JSON import)

1. Download skill pack: `GET /api/prompt-rules/skill-pack` (optional `?redact=true`).
2. Build a per-job prompt: `POST /api/applications/prompt` with `{ jobId, target }`.
3. Generate strict JSON in external model using:
   - skill pack prompt templates and rules
   - expected JSON schema returned by the prompt API
4. Import + render PDFs: `POST /api/applications/manual-generate` with:
   - `jobId`, `target`, `modelOutput` (strict JSON string), and **matching** `promptMeta`

Hard rule: never import without `promptMeta`.

