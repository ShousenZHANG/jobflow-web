# Master Resume PDF Preview (Step-Triggered) Design

Date: 2026-02-03

## Goal
Provide a step-based Master Resume flow where the PDF preview updates only when the user clicks "Next" or "Save". This avoids heavy re-renders while still giving accurate previews.

## User Experience
- 6-step wizard: Personal info, Summary, Experience, Projects, Education, Skills.
- Each step validates only its required fields.
- "Next" and "Save" trigger profile save + PDF preview refresh.
- Right panel shows a PDF preview iframe with loading and error states.

## Data Model
Single ResumeProfile model with sections:
- basics (fullName, title, email, phone)
- links (label, url)
- summary
- experiences (title, company, location, dates, bullets[])
- projects (name, role, dates, link?, bullets[])
- education (school, degree, location, dates, details?)
- skills (category, items[])

## Data Flow
1) On load: GET /api/resume-profile -> populate form state.
2) On Next/Save:
   - Validate current step required fields.
   - POST /api/resume-profile (upsert).
   - POST /api/resume-pdf to generate PDF.
   - Update preview iframe with new blob URL.

## Validation (per step)
- Personal: fullName, title, email, phone required.
- Summary: non-empty summary.
- Experience: each entry requires title, company, dates; bullets empty lines trimmed.
- Projects: each entry requires name, role, dates; bullets trimmed.
- Education: school, degree, dates required.
- Skills: category required, items optional but trimmed.

## Error Handling
- Save failure: toast + block step progression.
- Preview failure: step can progress, preview shows error + retry button.
- Loading state in preview while generating.

## Testing
- Component tests: step validation, preview refresh on Next/Save.
- API tests: /api/resume-pdf returns error when profile missing.

## Out of Scope
- Real-time PDF generation on each keystroke.
- AI-generated content.
