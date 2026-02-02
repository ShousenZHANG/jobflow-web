# Resume Profile & Application Generation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add ResumeProfile CRUD and Application generation pipeline with LaTeX rendering and external PDF compile call.

**Architecture:** ResumeProfile stored per user, upserted via API. Jobs page can trigger generation with selected experience section. Generation calls LLM (mockable), renders LaTeX placeholders, sends to Azure VM compile API, stores results, and records Application.

**Tech Stack:** Next.js App Router, Prisma, React Hook Form, Vercel Serverless APIs, Tailwind/shadcn.

---

### Task 1: Add ResumeProfile data access helpers

**Files:**
- Modify: `lib/server/prisma.ts` (if helper patterns exist)
- Create: `lib/server/resumeProfile.ts`
- Test: `test/server/resumeProfile.test.ts` (or similar existing test location)

**Step 1: Write the failing test**

```ts
import { upsertResumeProfile, getResumeProfile } from "@/lib/server/resumeProfile";

test("upserts and fetches resume profile", async () => {
  const userId = "user-1";
  await upsertResumeProfile(userId, { summary: "A", skills: ["React"] });
  const profile = await getResumeProfile(userId);
  expect(profile?.summary).toBe("A");
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- "test/server/resumeProfile.test.ts"`
Expected: FAIL (module not found or function not defined)

**Step 3: Write minimal implementation**

```ts
export async function upsertResumeProfile(userId, data) { /* prisma.resumeProfile.upsert */ }
export async function getResumeProfile(userId) { /* prisma.resumeProfile.findUnique */ }
```

**Step 4: Run test to verify it passes**

Run: `npm test -- "test/server/resumeProfile.test.ts"`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/server/resumeProfile.ts test/server/resumeProfile.test.ts
git commit -m "feat: add resume profile data access"
```

---

### Task 2: ResumeProfile API routes

**Files:**
- Create: `app/api/resume-profile/route.ts`
- Test: `test/api/resumeProfile.test.ts`

**Step 1: Write failing test**

```ts
test("GET returns empty profile for new user", async () => { /* call GET route */ });
```

**Step 2: Run test to verify it fails**

Run: `npm test -- "test/api/resumeProfile.test.ts"`
Expected: FAIL

**Step 3: Minimal implementation**
- GET: return existing profile or null
- POST: upsert with payload

**Step 4: Run test to verify it passes**

Run: `npm test -- "test/api/resumeProfile.test.ts"`
Expected: PASS

**Step 5: Commit**

```bash
git add app/api/resume-profile/route.ts test/api/resumeProfile.test.ts
git commit -m "feat: resume profile api"
```

---

### Task 3: Resume page UI

**Files:**
- Create: `app/(app)/resume/page.tsx`
- Create: `components/resume/ResumeForm.tsx`
- Modify: `app/(app)/TopNav.tsx` (add Resume link)
- Test: `app/(app)/resume/ResumeForm.test.tsx`

**Step 1: Write failing test**
```ts
test("renders summary and skills inputs", () => { /* render and expect */ });
```

**Step 2: Run test to verify it fails**
Run: `npm test -- "app/(app)/resume/ResumeForm.test.tsx"`

**Step 3: Implement minimal UI**
- Form with summary textarea, skills tag input, latest experience fields, bullet list editor
- Save button calls API

**Step 4: Run test to verify it passes**

**Step 5: Commit**

```bash
git add app/(app)/resume page/components tests
git commit -m "feat: resume profile form"
```

---

### Task 4: LaTeX placeholder renderer

**Files:**
- Create: `lib/server/latex/renderResume.ts`
- Test: `test/server/renderResume.test.ts`

**Step 1: Write failing test**

```ts
const tex = renderResume({ summary: "A", skills: ["React"], bullets: ["X"] });
expect(tex).toContain("A");
expect(tex).toContain("\\item X");
```

**Step 2: Run test to verify it fails**

**Step 3: Implement**
- Replace placeholders in `sections/summary.tex`, `sections/skills.tex`, selected experience file

**Step 4: Run tests**

**Step 5: Commit**

---

### Task 5: Application generation API

**Files:**
- Create: `app/api/applications/generate/route.ts`
- Create: `lib/server/applicationGenerator.ts`
- Test: `test/api/applicationGenerate.test.ts`

**Step 1: Write failing test**
- Mock LLM response and mock compile API

**Step 2: Run test to verify it fails**

**Step 3: Implement**
- Load ResumeProfile + Job
- Call LLM (stubbed)
- Render LaTeX
- Call Azure compile API
- Store files in Blob
- Create Application record

**Step 4: Run tests**

**Step 5: Commit**

---

### Task 6: Applications list page

**Files:**
- Create: `app/(app)/applications/page.tsx`
- Create: `app/api/applications/route.ts`
- Test: `app/(app)/applications/ApplicationsList.test.tsx`

---

### Task 7: Wiring Jobs page to generate

**Files:**
- Modify: `app/(app)/jobs/JobsClient.tsx`
- Test: `app/(app)/jobs/JobsClient.test.tsx`

Add "Generate Resume" button with experience selection dropdown.

---

Plan complete and saved to `docs/plans/2026-02-02-resume-profile-implementation.md`. Two execution options:

1. Subagent-Driven (this session) – I dispatch fresh subagent per task and review between tasks.
2. Parallel Session (separate) – Open new session with executing-plans and execute plan tasks with checkpoints.

Which approach?
