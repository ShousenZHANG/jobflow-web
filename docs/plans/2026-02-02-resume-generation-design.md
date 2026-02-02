# Resume Generation Design (Master Resume + JD Tailoring)

## Summary
Design a SaaS flow where users maintain a single master resume and generate job-specific resume/cover PDFs using JD data. The system keeps templates fixed, replaces only approved sections, and stores only applied versions. Rendering is done in Vercel Serverless; PDF compilation is handled by a dedicated Azure VM service.

## Goals
- One master resume per user (ResumeProfile).
- AI only edits summary, skills, and a selected experience section.
- Deterministic LaTeX rendering from structured JSON (no raw LaTeX from the model).
- PDF compiled off Vercel for stability.
- Store only applied versions (Application records + PDF/tex URLs).

## Non-Goals
- Multiple resume templates (future).
- Free-form LaTeX editing by users.
- Saving drafts for every preview (save only on apply).

## Architecture & Data Flow
1) User edits master resume at `/resume` and saves.
2) User selects a job + experience section to tailor.
3) Vercel API gathers JD + ResumeProfile and calls LLM.
4) LLM returns structured JSON (summary/skills/bullets/cover).
5) Vercel renders LaTeX by replacing placeholders and wrapping bullets.
6) Vercel calls Azure VM PDF service to compile.
7) PDFs/tex are stored in Blob; Application record is created.

## Data Model
### ResumeProfile
- user_id
- summary
- skills (json array)
- latestRoleTitle / latestCompany / latestLocation
- latestStart / latestEnd
- latestBullets (json array)

### Application
- user_id, job_id, resumeProfileId
- company, role
- resumeTexUrl, resumePdfUrl
- coverTexUrl, coverPdfUrl

## API Design
### GET /api/resume-profile
Returns current master resume (or empty structure).

### POST /api/resume-profile
Upserts master resume for current user.

### POST /api/applications/generate
Input: jobId, experienceSection, includeCover
Process: fetch JD + profile -> call LLM -> render LaTeX -> compile PDF -> store -> create Application.

### GET /api/applications
List previously applied records for downloads.

## Template Strategy
Fixed LaTeX templates with placeholders:
- `{{SUMMARY}}`
- `{{SKILLS}}`
- `{{EXPERIENCE_BULLETS}}`
- `{{COVER_COMPANY}}`
- `{{COVER_ROLE}}`
- `{{COVER_BODY}}`

Bullets are generated from arrays into `\begin{highlights} ... \end{highlights}`.

## External PDF Compile Service (Azure VM)
- Minimal HTTP API: POST /compile { tex } -> PDF
- Vercel handles retries and error parsing.

## Error Handling
- LLM failure -> clear error to user, no files saved.
- Render failure -> abort, log context.
- PDF compile failure -> return error, keep tex for debugging.
- Storage failure -> retry once, then fail.

## Testing
- Unit: ResumeProfile upsert, LLM JSON validation, LaTeX renderer.
- Integration: Application generation with mocked LLM/VM.
- Frontend: form save, generate flow, download links.

## Security
- All endpoints require auth (user_id scoping).
- Azure VM API secured with shared secret.
- Blob URLs stored and scoped per user.
