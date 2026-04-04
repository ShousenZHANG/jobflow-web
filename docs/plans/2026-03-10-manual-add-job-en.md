# Manual Add Job (EN) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** In EN mode (market AU), allow users to manually add a single job from the Jobs page (e.g. from Seek) via a modal; duplicate jobUrl is rejected with 409; new jobs appear in the list and work with Generate CV/CL.

**Architecture:** POST /api/jobs already exists but currently upserts; change to create-only and return 409 when (userId, jobUrl) exists. Add "Add job" button to the left of Search in the Jobs toolbar (AU only), opening a modal with form; on success refetch list and close modal; on 409 show inline error.

**Tech Stack:** Next.js App Router, Prisma, React Query, existing Dialog/Input/Textarea/Button, zod.

**Spec:** `docs/superpowers/specs/2026-03-10-manual-add-job-en-design.md`

---

## File structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `app/api/jobs/route.ts` | POST: replace upsert with findFirst + create; return 409 when job exists for (userId, jobUrl). |
| Create | `test/api/jobsCreate.test.ts` | Tests for POST /api/jobs: 401, 400, 409 duplicate, 201 success. |
| Modify | `app/(app)/jobs/JobsClient.tsx` | Add "Add job" button (left of Search, market===AU), Add-job modal with form, submit to POST /api/jobs, handle 201/409/400, refetch list. |
| Modify | `messages/en.json` | Add key for "Add job" button label if not present (optional; can use literal "Add job" in code). |

---

## Chunk 1: API behavior and tests

### Task 1: POST /api/jobs — reject duplicate (409)

**Files:**
- Modify: `app/api/jobs/route.ts` (POST handler)

- [ ] **Step 1: Change POST from upsert to create-with-409**

In `app/api/jobs/route.ts`, replace the `prisma.job.upsert` block (lines 243–265) with:

1. After parsing and canonicalizing `jobUrl`, call `prisma.job.findUnique({ where: { userId_jobUrl: { userId, jobUrl } }, select: { id: true } })`.
2. If found, return `NextResponse.json({ error: "JOB_URL_EXISTS" }, { status: 409 })`.
3. Otherwise `prisma.job.create` with the same payload (userId, jobUrl, title, company, location, jobType, jobLevel, description; market and status use schema defaults "AU" and "NEW"). Return 201 and `{ id: created.id }`.

Ensure `CreateSchema` trims `title`: use `z.string().trim().min(1)` for title. Optional string fields can remain as-is (empty string can be stored or normalized to null in create payload).

- [ ] **Step 2: Commit**

```bash
git add app/api/jobs/route.ts
git commit -m "feat(api): POST /api/jobs reject duplicate jobUrl with 409"
```

### Task 2: Tests for POST /api/jobs

**Files:**
- Create: `test/api/jobsCreate.test.ts`

- [ ] **Step 3: Add failing tests for POST /api/jobs**

Create `test/api/jobsCreate.test.ts` with:

- Mock `@/lib/server/prisma` (prisma.job.findUnique, prisma.job.create).
- Mock `getServerSession` to return a user for success cases and null for 401.
- Test: no session → 401.
- Test: invalid body (missing jobUrl or title) → 400.
- Test: valid body, findUnique returns existing job → 409 and body `{ error: "JOB_URL_EXISTS" }`.
- Test: valid body, findUnique returns null, create returns { id } → 201 and body `{ id }`.

Use a valid URL for jobUrl (e.g. `https://www.seek.com.au/job/123`). Trim title in test payloads where relevant.

- [ ] **Step 4: Run tests**

```bash
cd joblit && npx vitest run test/api/jobsCreate.test.ts -v
```

Expected: all tests pass (implementation already changed in Task 1).

- [ ] **Step 5: Commit**

```bash
git add test/api/jobsCreate.test.ts
git commit -m "test(api): POST /api/jobs 401, 400, 409, 201"
```

---

## Chunk 2: Jobs page UI

### Task 3: Add job button and modal (EN only)

**Files:**
- Modify: `app/(app)/jobs/JobsClient.tsx`

- [ ] **Step 6: Add state and handler for Add-job modal**

In `JobsClient.tsx`:

- Add state: `addJobOpen` (boolean), `addJobForm` (object: jobUrl, title, company, location, jobType, jobLevel, description), `addJobError` (string | null), `addJobSubmitting` (boolean).
- Add handler `submitAddJob`: set addJobSubmitting true, addJobError null; POST `/api/jobs` with JSON body from addJobForm; on 201: close modal, clear form, call `queryClient.invalidateQueries` for the jobs list query (same queryKey as the existing list fetch); on 409: set addJobError to "This job link already exists."; on 400/401/5xx: set addJobError to a generic or server message; finally set addJobSubmitting false.

- [ ] **Step 7: Place Add job button and Add-job modal in JSX**

- In the toolbar, locate the div with `data-testid="jobs-toolbar"` and the last column `<div className="flex items-end gap-2">` that contains the Search button.
- When `market === "AU"`, render an "Add job" button **before** the Search button (same div, same flex). Button opens the modal: `onClick={() => setAddJobOpen(true)}`. Use similar styling to existing primary/secondary buttons (e.g. outline variant for Add job so Search remains primary).
- Add a `Dialog` (reuse existing `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` pattern from the same file): open state `addJobOpen`, onOpenChange set `addJobOpen` and clear `addJobError` when closing.
- Inside the dialog: form with fields Job URL (input type url), Title (input text), Company, Location, Job type, Job level, Description (Textarea). Required: Job URL and Title. Buttons: Cancel (close modal), Add (submit; disabled when addJobSubmitting or missing required fields). Display `addJobError` above the buttons or below the form when non-null.

- [ ] **Step 8: Wire form to state and submit**

- Bind each input to `addJobForm` and `setAddJobForm` (or individual setters). On Add click, call `submitAddJob`. Prevent default on form submit if using a form element.

- [ ] **Step 9: Invalidate jobs list on success**

- Ensure the jobs list is refetched after 201. Use the same `queryClient` and query key as the existing jobs fetch in this component (e.g. the key used in `useQueries` or `useQuery` for the jobs list). After 201, call `queryClient.invalidateQueries({ queryKey: [...] })` so the list updates and the new job appears.

- [ ] **Step 10: Manual check and commit**

- Run app; in EN mode open Jobs page, click Add job, submit with a new Seek URL and title; confirm job appears and duplicate URL shows "This job link already exists."
- Commit UI changes.

```bash
git add "app/(app)/jobs/JobsClient.tsx"
git commit -m "feat(jobs): Add job button and modal (EN only)"
```

---

## Chunk 3: i18n and polish (optional)

### Task 4: Copy and accessibility

- [ ] **Step 11: Add translation key (optional)**

If the project uses `useTranslations("jobs")` or similar for the Jobs page, add a key for the Add job button (e.g. `addJob`) in `messages/en.json` under the jobs section and use it in the button label. If not, the literal "Add job" is acceptable per spec.

- [ ] **Step 12: Accessibility**

Ensure the modal has a proper title (DialogTitle) and that the form error is associated or announced (e.g. aria-describedby or role="alert" for addJobError).

- [ ] **Step 13: Final verification**

- Run full test suite for changed areas: `npx vitest run test/api/jobsCreate.test.ts` and any JobsClient tests if present.
- Confirm EN-only: switch to CN (zh locale), confirm Add job button is not visible.

---

## Summary

- **API:** POST /api/jobs create-only; 409 when (userId, jobUrl) exists; 201 with `{ id }` on create.
- **UI:** Jobs page toolbar, Add job button to the left of Search (AU only), modal with form, success → close + refetch, 409 → show "This job link already exists."
