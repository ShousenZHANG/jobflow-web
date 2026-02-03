# Master Resume Stepper Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the simple resume form with a stepper-based Master Resume workflow that enforces per-step required fields, supports dynamic lists, and saves a full ResumeProfile only at the end.

**Architecture:** A client-side stepper form holds all resume state locally, validates each step before navigation, and posts the final payload to `/api/resume-profile`. ResumeProfile is expanded to include `basics`, `links`, `projects`, and `education` JSON fields, with server schema validation and Prisma persistence.

**Tech Stack:** Next.js App Router, React, Tailwind, Zod, Prisma, Vitest

---

### Task 1: Update ResumeForm tests for stepper flow

**Files:**
- Modify: `app/(app)/resume/ResumeForm.test.tsx`

**Step 1: Write the failing test**

```tsx
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ResumeForm } from "@/components/resume/ResumeForm";

it("renders personal info step with required fields", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ profile: null }), { status: 200 })));
  render(<ResumeForm />);
  expect(await screen.findByText("Personal info")).toBeInTheDocument();
  expect(screen.getByLabelText("Full name")).toBeInTheDocument();
  expect(screen.getByLabelText("Title")).toBeInTheDocument();
  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Phone")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- "app/(app)/resume/ResumeForm.test.tsx"`
Expected: FAIL with missing stepper fields

**Step 3: Write minimal implementation**

(No implementation yet; this is a test-only task.)

**Step 4: Run test to verify it still fails**

Run: `npm test -- "app/(app)/resume/ResumeForm.test.tsx"`
Expected: FAIL

**Step 5: Commit**

```bash
git add app/(app)/resume/ResumeForm.test.tsx
git commit -m "test: add resume stepper expectations"
```

---

### Task 2: Implement stepper-based ResumeForm UI

**Files:**
- Modify: `components/resume/ResumeForm.tsx`

**Step 1: Write the failing test**

(Use tests from Task 1.)

**Step 2: Run test to verify it fails**

Run: `npm test -- "app/(app)/resume/ResumeForm.test.tsx"`
Expected: FAIL

**Step 3: Write minimal implementation**

```tsx
const steps = ["Personal info", "Summary", "Experience", "Projects", "Education", "Skills"];
const [currentStep, setCurrentStep] = useState(0);

const canContinue = () => {
  if (currentStep === 0) return basics.fullName && basics.title && basics.email && basics.phone;
  if (currentStep === 1) return summary.trim().length > 0;
  if (currentStep === 2) return experiences.length > 0 && experiences.every(e => e.title && e.company && e.dates && e.bullets.length > 0);
  if (currentStep === 3) return projects.length > 0 && projects.every(p => p.name && p.role && p.dates && p.bullets.length > 0);
  if (currentStep === 4) return education.length > 0 && education.every(e => e.school && e.degree && e.dates);
  if (currentStep === 5) return skills.length > 0 && skills.every(s => s.label && s.items.length > 0);
  return false;
};
```

Implement:
- Stepper header buttons (disabled for future steps, clickable for completed steps)
- Per-step form blocks for: Personal Info, Summary, Experience, Projects, Education, Skills
- Dynamic list UI with Add/Remove and bullet add/remove
- Right-side preview card
- Save only on final step (POST /api/resume-profile)

**Step 4: Run test to verify it passes**

Run: `npm test -- "app/(app)/resume/ResumeForm.test.tsx"`
Expected: PASS

**Step 5: Commit**

```bash
git add components/resume/ResumeForm.tsx
git commit -m "feat: add stepper master resume form"
```

---

### Task 3: Expand ResumeProfile API + server helpers

**Files:**
- Modify: `lib/server/resumeProfile.ts`
- Modify: `app/api/resume-profile/route.ts`
- Modify: `test/server/resumeProfile.test.ts`
- Modify: `test/api/resumeProfile.test.ts`

**Step 1: Write the failing test**

```ts
const payload = {
  basics: { fullName: "Jane", title: "Engineer", email: "jane@example.com", phone: "123" },
  links: [{ label: "LinkedIn", url: "https://linkedin.com/in/jane" }],
  summary: "Focused engineer.",
  experiences: [{ company: "Example", title: "Engineer", location: "Sydney", dates: "2023-2025", bullets: ["Built"] }],
  projects: [{ name: "Jobflow", role: "Frontend", dates: "2024", bullets: ["Shipped"] }],
  education: [{ school: "UNSW", degree: "MIT", location: "Sydney", dates: "2023-2025" }],
  skills: [{ label: "Frontend", items: ["React"] }],
};
```

**Step 2: Run test to verify it fails**

Run: `npm test -- "test/server/resumeProfile.test.ts"`
Expected: FAIL (schema mismatch)

**Step 3: Write minimal implementation**

```ts
export type ResumeProfileInput = {
  basics?: { fullName: string; title: string; email: string; phone: string } | null;
  links?: { label: string; url: string }[] | null;
  summary?: string | null;
  experiences?: ExperienceEntry[] | null;
  projects?: ProjectEntry[] | null;
  education?: EducationEntry[] | null;
  skills?: { label: string; items: string[] }[] | null;
};
```

Normalize all JSON fields with Prisma.DbNull when null. Update Zod schema to match new fields.

**Step 4: Run tests to verify they pass**

Run:
- `npm test -- "test/server/resumeProfile.test.ts"`
- `npm test -- "test/api/resumeProfile.test.ts"`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/server/resumeProfile.ts app/api/resume-profile/route.ts test/server/resumeProfile.test.ts test/api/resumeProfile.test.ts
git commit -m "feat: expand resume profile payload"
```

---

### Task 4: Update Prisma schema for new ResumeProfile fields

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<new-migration>/migration.sql`

**Step 1: Write the failing test**

(No test; schema change task.)

**Step 2: Run migration to verify it fails before schema update**

Run: `npx prisma migrate dev --name resume_profile_master_fields`
Expected: FAIL or no-op before schema update

**Step 3: Write minimal implementation**

```prisma
model ResumeProfile {
  id        String  @id @default(uuid()) @db.Uuid
  userId    String  @db.Uuid
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  basics      Json?
  links       Json?
  summary     String?
  skills      Json?
  experiences Json?
  projects    Json?
  education   Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  applications Application[]

  @@index([userId, updatedAt])
}
```

**Step 4: Run migration to verify it passes**

Run: `npx prisma migrate dev --name resume_profile_master_fields`
Expected: PASS

**Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: extend resume profile schema"
```

---

### Task 5: Final verification

**Files:**
- No code changes

**Step 1: Run full test suite**

Run: `npm test`
Expected: PASS

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 3: Run build**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git status -sb
```

---

Plan complete and saved to `docs/plans/2026-02-03-master-resume-stepper-implementation.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration

2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
