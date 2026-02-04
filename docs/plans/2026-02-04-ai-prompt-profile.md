# AI Prompt Profile (User-Configurable Skills Rules) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a per-user AI Skills rules profile (CV + Cover rules) with a dedicated `/resume/ai-rules` page. If a user has no profile, default rules remain in effect.

**Architecture:**
- Add `AiPromptProfile` table (1 row per user) to store `cvRules` and `coverRules` as JSON arrays.
- Create API routes to GET/POST the profile with auth and validation.
- Add UI page to edit rules as ¡°one rule per line¡± textareas.
- Update AI tailoring flow to prefer user profile rules when present, otherwise fall back to defaults.

**Tech Stack:** Next.js App Router, Prisma, Zod, React, Tailwind/shadcn.

---

### Task 1: Add Prisma model + migration

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Write failing test (schema check)**
- Skip direct test; Prisma schema change will be validated by `prisma validate` during migration.

**Step 2: Update schema**
- Add model:
  - `AiPromptProfile { id, userId, cvRules Json, coverRules Json, createdAt, updatedAt }`
  - Relation to `User` with `@@unique([userId])` or `userId @unique`.

**Step 3: Run migration**
- Run: `npx prisma migrate dev -n add_ai_prompt_profile`
- Run: `npx prisma generate`

**Step 4: Commit**
```bash
git add prisma/schema.prisma prisma/migrations
```

---

### Task 2: Data access helper

**Files:**
- Create: `lib/server/aiPromptProfile.ts`
- Test: `test/server/aiPromptProfile.test.ts`

**Step 1: Write failing test**
```ts
import { upsertAiPromptProfile, getAiPromptProfile } from "@/lib/server/aiPromptProfile";

test("upserts and fetches ai prompt profile", async () => {
  const userId = "user-1";
  await upsertAiPromptProfile(userId, { cvRules: ["A"], coverRules: ["B"] });
  const profile = await getAiPromptProfile(userId);
  expect(profile?.cvRules).toEqual(["A"]);
});
```

**Step 2: Run test (expect fail)**
Run: `npm test -- test/server/aiPromptProfile.test.ts`

**Step 3: Implement helper**
- `getAiPromptProfile(userId)` -> `prisma.aiPromptProfile.findUnique`
- `upsertAiPromptProfile(userId, data)` -> `upsert`

**Step 4: Run test (expect pass)**
Run: `npm test -- test/server/aiPromptProfile.test.ts`

---

### Task 3: API routes

**Files:**
- Create: `app/api/ai-prompt-profile/route.ts`
- Test: `test/api/aiPromptProfile.test.ts`

**Step 1: Write failing test**
- GET returns null when missing
- POST upserts profile

**Step 2: Run tests (expect fail)**
Run: `npm test -- test/api/aiPromptProfile.test.ts`

**Step 3: Implement**
- GET: `getServerSession`, return profile or null
- POST: validate `cvRules` + `coverRules` as non-empty string arrays, trim, max lengths

**Step 4: Run tests (expect pass)**
Run: `npm test -- test/api/aiPromptProfile.test.ts`

---

### Task 4: Update tailoring flow to use user rules

**Files:**
- Modify: `lib/server/ai/tailorApplication.ts`
- Modify: `lib/server/ai/promptSkills.ts` (add helper to accept overrides)
- Test: `test/server/tailorApplication.test.ts`

**Step 1: Write failing test**
- Mock `getAiPromptProfile` to return custom rules and assert `buildTailorPrompts` receives them.

**Step 2: Implement**
- If profile exists, use its rules in `buildTailorPrompts`.
- Else use default rules.

**Step 3: Run tests**
Run: `npm test -- test/server/tailorApplication.test.ts`

---

### Task 5: UI page `/resume/ai-rules`

**Files:**
- Create: `app/(app)/resume/ai-rules/page.tsx`
- Create: `components/resume/AiRulesForm.tsx`
- Modify: `app/(app)/TopNav.tsx` (add link under Resume dropdown or new nav item)
- Test: `app/(app)/resume/AiRulesForm.test.tsx`

**Step 1: Write failing test**
- Renders two textareas (CV Rules / Cover Rules)
- Save button posts

**Step 2: Implement UI**
- Load profile via GET
- Textarea: one rule per line
- Save -> POST
- If no profile, prefill with defaults

**Step 3: Run tests**
Run: `npm test -- app/(app)/resume/AiRulesForm.test.tsx`

---

### Task 6: Final checks

**Commands:**
- `npm run lint`
- `npm test`
- `npm run build`

---

Plan complete and saved to `docs/plans/2026-02-04-ai-prompt-profile.md`.

Two execution options:

1. Subagent-Driven (this session) ¡ª I dispatch a fresh subagent per task and review between tasks.
2. Parallel Session (separate) ¡ª Open new session with executing-plans and execute plan tasks with checkpoints.

Which approach?