# Jobflow

A modern job-search command center for fast, focused hiring workflows. Jobflow combines a sleek Next.js dashboard with a resilient import pipeline, letting users fetch, review, and track opportunities in one clean, real-time experience.

## Why Jobflow

- **Curated job intake** with robust filtering and dedupe
- **Two-pane review flow** for fast scanning and detail reading
- **Instant status tracking** for NEW/APPLIED/REJECTED
- **Rich descriptions** with markdown rendering and keyword highlighting
- **Reliable import pipeline** with retries, tombstones, and safe upserts
- **Fetch progress visibility** that persists across navigation

## Product Highlights

- **Jobs workspace**: split list + details layout, smooth scrolling, smart filters
- **Fetch console**: real-time suggestions, flexible search, and tracked runs
- **Dashboard**: focused entry points with modern, minimal UI
- **Login**: simple, direct sign-in with Google and GitHub

## Tech Stack

- **Next.js App Router** for SSR and routing
- **Prisma + PostgreSQL** for data modeling and access
- **NextAuth** (Google, GitHub) for auth
- **Tailwind CSS + shadcn/ui** for UI design
- **JobSpy (Python)** executed via GitHub Actions

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Scripts

- `npm run dev` start dev server
- `npm run lint` lint codebase
- `npm run build` production build
- `npm run start` start production server

## Environment Variables

Create a `.env` file in the project root.

### App + Auth

- `DATABASE_URL`
- `NEXTAUTH_SECRET` (or `AUTH_SECRET`)
- `NEXTAUTH_URL` (optional for local dev)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`

### Fetcher + GitHub Actions

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_TOKEN` (PAT with workflow scope)
- `GITHUB_WORKFLOW_FILE` (default `jobspy-fetch.yml`)
- `GITHUB_REF` (default `master`)
- `JOBFLOW_WEB_URL` (public app URL for callbacks)
- `FETCH_RUN_SECRET` (shared secret for run config endpoint)
- `IMPORT_SECRET` (shared secret for import endpoint)

## Architecture Overview

- `app/(marketing)` marketing home
- `app/(auth)` login
- `app/(app)` authenticated app (jobs, fetch)
- `app/api` API routes
- `tools/fetcher/run_jobspy.py` JobSpy runner
- `prisma/schema.prisma` database schema

## Fetch Flow (End-to-End)

1. User starts a fetch in `/fetch`
2. App creates a `FetchRun` and triggers GitHub Actions
3. GitHub Action runs `run_jobspy.py`
4. Fetcher pulls config from `/api/fetch-runs/[id]/config`
5. JobSpy scrapes, cleans, and filters descriptions
6. Results import via `/api/admin/import` (deduped, tombstoned)
7. Progress updates via `/api/fetch-runs/[id]/update`

## Jobs API

`GET /api/jobs` supports:

- `limit` (default 10)
- `cursor`
- `status` (`NEW`, `APPLIED`, `REJECTED`)
- `q` (search across title/company/location)
- `location`
- `jobLevel`
- `sort` (`newest`, `oldest`)

`PATCH /api/jobs/[id]` updates status  
`DELETE /api/jobs/[id]` removes a job

## Data & Safety Notes

- Jobs are deduped by `(userId, jobUrl)`.
- Deleted job URLs are tombstoned to prevent re-import.
- Import counts reflect newly created jobs only.

## Deployment (Vercel)

Connect the repo in Vercel and configure all env vars above.  
If you deploy from a subdirectory, set Vercel’s root to `jobflow`.

## Troubleshooting

- **403 GitHub Action dispatch**: confirm PAT has `workflow` scope.
- **Low results**: increase `resultsWanted` or `hoursOld`, review exclusions.
- **Import failures**: verify `JOBFLOW_WEB_URL`, `FETCH_RUN_SECRET`, `IMPORT_SECRET`.

## License

Licensed under the Apache License, Version 2.0. See `LICENSE` and `NOTICE`.
