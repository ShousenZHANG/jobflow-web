# Resume PDF Download (Master Resume) Design

## Goal
Add a **Generate PDF** action to the Master Resume screen that downloads a PDF rendered from the saved resume profile. No preview, no server-side storage.

## Constraints
- Must use existing Master Resume profile (saved data only).
- No PDF storage or history.
- Runs in Vercel for API; LaTeX compilation happens externally (Azure VM).
- Single default template (no template selector).
- File name: `resume-<fullName>-<date>.pdf`.

## Recommended Architecture
**Vercel API ¡ú Azure VM LaTeX compile service ¡ú PDF download**

Why:
- Vercel serverless cannot reliably run LaTeX binaries.
- Azure VM gives stable, controllable compile environment.
- Fits mainstream product architecture and scalability.

## User Flow
1. User saves Master Resume.
2. User clicks **Generate PDF** in Preview area.
3. UI shows loading + toast feedback.
4. Backend generates `.tex` from saved resume profile, calls VM compile API, returns PDF.
5. Frontend downloads file.

## UI / UX
- Button location: **Preview panel**, below the snapshot.
- Label: ¡°Generate PDF¡±.
- Disabled state: until profile is saved (or missing required fields).
- Feedback: loading state + success/error toast.

## API Design
### POST /api/resume-pdf
- Auth required.
- Reads `ResumeProfile` for user.
- Builds LaTeX source (existing template renderer).
- Calls external compile endpoint.
- Returns PDF response with `Content-Disposition: attachment`.

**Response:**
- `200 application/pdf` on success.
- `400/404` if no profile or missing required data.
- `500` on compile error.

## External Compile Service (Azure VM)
### POST /compile
- Headers: `x-api-key` for auth.
- Body: JSON with `tex` string.
- Returns `application/pdf` bytes.
- Enforces timeouts, size limits.

## Security & Validation
- LaTeX escaping for user fields.
- Input length limits (server-side).
- Timeout & max output size on VM.
- API key stored in Vercel env (`LATEX_RENDER_URL`, `LATEX_RENDER_TOKEN`).

## Testing
- Unit tests for `POST /api/resume-pdf` using mocked renderer & compile call.
- Ensure build does not call external service.

## Open Questions
- Where to store the VM API key? (Vercel env)
- Should we gate Generate PDF by ¡°profile saved¡± or allow one-off drafts? (chosen: saved-only)

