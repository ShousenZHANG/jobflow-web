# Master Resume Stepper Design

Date: 2026-02-03

## Goal
Create a multi-step Master Resume form with strict per-step validation, live preview, and a single save action at the end. The flow must guide users to provide all required content for a consistent resume template.

## UX Flow (Stepper)
Steps (in order):
1. Personal Info
2. Summary
3. Professional Experience
4. Projects
5. Education
6. Skills

Rules:
- Users cannot advance unless the current step passes validation.
- Back is allowed for completed steps.
- Save occurs only on the final step.
- Right-side preview shows only completed content.
- Mobile uses vertical steps + optional preview drawer.

## Data Model (ResumeProfile)
- basics: { fullName, title, email, phone }
- links: [{ label, url }]
- summary: string
- experiences: [{ company, title, location, dates, bullets[] }]
- projects: [{ name, role, dates, link?, bullets[] }]
- education: [{ school, degree, location, dates, details? }]
- skills: [{ label, items[] }]

## Validation
- Personal Info: all fields required
- Summary: required, non-empty
- Experience: at least 1 entry, each must have title + company + dates + >=1 bullet
- Projects: at least 1 entry, each must have name + role + dates + >=1 bullet
- Education: at least 1 entry, each must have school + degree + dates
- Skills: at least 1 group, each must have label + >=1 item

## UI Components
- Stepper header with clickable completed steps
- Forms use Input/Textarea with clear labels
- Dynamic list cards for Experience/Projects/Education/Skills
- Bullets use Add/Remove UI (no comma-only input)
- Links allow default items (LinkedIn/GitHub/Portfolio) + custom add

## Save Behavior
- POST /api/resume-profile only on final step
- Frontend caches all steps in local state
- Show toast on save success/failure

## Testing
- ResumeForm tests for stepper rendering, validation gates, add/remove entries, and Save button state
- API tests to verify GET/POST of new profile shape
- Server tests to verify normalization of JSON fields

## Future Extensions
- AI-assisted JD tailoring using the same ResumeProfile schema
- Draft auto-save (optional)
- Versioning (optional)
