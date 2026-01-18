# Jobflow

Jobflow is a modern job search dashboard that helps you fetch, review, and track job opportunities in one clean workflow. It combines a Next.js app, Prisma/Postgres, NextAuth, and an automated JobSpy-based fetcher that runs via GitHub Actions.

## Key Features

- Clean dashboard for reviewing jobs and updating status
- Fetch page to run curated searches with filters
- Smart search across title, company, and location
- Job-level filtering and pagination with smooth UX
- Markdown-enhanced job descriptions with keyword highlighting
- Async fetch progress with persistent panel
- Robust import pipeline with retries and dedupe

## Tech Stack

- Next.js App Router
- Prisma + PostgreSQL (Neon)
- NextAuth (Google, GitHub)
- Tailwind CSS + shadcn/ui
- JobSpy (Python) via GitHub Actions

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` - start dev server
- `npm run lint` - lint
- `npm run build` - production build
- `npm run start` - start production server

## Environment Variables

Create a `.env` file with the following (example names shown):

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
- `GITHUB_TOKEN` (PAT with workflow access)
- `GITHUB_WORKFLOW_FILE` (default: `jobspy-fetch.yml`)
- `GITHUB_REF` (default: `master`)
- `JOBFLOW_WEB_URL` (public app URL for fetcher callbacks)
- `FETCH_RUN_SECRET` (shared secret for fetcher config endpoint)
- `IMPORT_SECRET` (shared secret for import endpoint)

## App Structure

- `app/(marketing)` - landing/dashboard home
- `app/(auth)` - login
- `app/(app)` - authenticated app (jobs, fetch)
- `app/api` - API routes
- `tools/fetcher/run_jobspy.py` - JobSpy runner
- `prisma/schema.prisma` - database schema

## Fetch Flow (End-to-End)

1. User starts a fetch in `/fetch`
2. App creates a `FetchRun` and triggers GitHub Actions
3. GitHub Action runs `run_jobspy.py`
4. Fetcher pulls run config from `/api/fetch-runs/[id]/config`
5. JobSpy scrapes jobs, cleans and filters descriptions
6. Results import via `/api/admin/import` (chunked, deduped)
7. Progress is updated in `/api/fetch-runs/[id]/update`

## Jobs API

`GET /api/jobs`

Supports:
- `limit` (default 10)
- `cursor`
- `status` (`NEW`, `APPLIED`, `REJECTED`)
- `q` (search across title/company/location)
- `location`
- `jobLevel`
- `sort` (`newest`, `oldest`)

`PATCH /api/jobs/[id]` updates status  
`DELETE /api/jobs/[id]` removes a job

## Database Notes

Jobs are deduped on `(userId, jobUrl)`. Re-running the same fetch will update existing records instead of creating duplicates.

## Deployment (Vercel)

This project works with private GitHub repos. Set the repo connection in Vercel and configure all environment variables above. If you use a subdirectory, make sure Vercel’s root directory is set correctly.

## Troubleshooting

- 403 GitHub Action dispatch: check PAT permissions (`workflow` scope).
- Missing results: increase `resultsWanted` / `hoursOld`, or review exclusion rules.
- Import failures: check `JOBFLOW_WEB_URL`, `FETCH_RUN_SECRET`, `IMPORT_SECRET`.

## License

Private/internal use unless stated otherwise.
