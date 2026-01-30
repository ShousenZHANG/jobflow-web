# Jobs Scroll Areas + Toolbar Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move “Posted: newest” + results into the main search row, add ScrollArea-based internal scrolling for Results and JD, and eliminate page-level scrollbar jitter.

**Architecture:** Introduce a reusable ScrollArea component (Radix/shadcn) and wrap the Results list and JD content in it. Restructure the search toolbar grid to include sort/results in the top row and keep all scrolling inside the two panels. Lock body scroll while on `/jobs` and ensure layout uses `flex-1/min-h-0` to prevent viewport scrolling.

**Tech Stack:** Next.js app router, React, Tailwind, Radix UI ScrollArea (via shadcn-style component), Vitest + React Testing Library.

---

### Task 1: Add ScrollArea UI component

**Files:**
- Create: `components/ui/scroll-area.tsx`
- Modify: `package.json` (dependency)

**Step 1: Write the failing test**

Add a test that imports the ScrollArea component (it should fail before component exists).

File: `app/(app)/jobs/JobsClient.test.tsx`
```tsx
import { ScrollArea } from "@/components/ui/scroll-area";

it("exposes ScrollArea component", () => {
  expect(ScrollArea).toBeDefined();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run app/(app)/jobs/JobsClient.test.tsx`
Expected: FAIL with module not found for `@/components/ui/scroll-area` or missing dependency.

**Step 3: Write minimal implementation**

1) Install Radix ScrollArea:
```bash
npm i @radix-ui/react-scroll-area
```

2) Create `components/ui/scroll-area.tsx`:
```tsx
"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      className="flex touch-none select-none p-0.5 transition-colors"
      orientation="vertical"
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-slate-400/40" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run app/(app)/jobs/JobsClient.test.tsx`
Expected: PASS for the new ScrollArea import.

**Step 5: Commit**

```bash
git add components/ui/scroll-area.tsx package.json package-lock.json app/(app)/jobs/JobsClient.test.tsx
git commit -m "feat(ui): add ScrollArea component"
```

---

### Task 2: Restructure toolbar (merge Posted + results into top row)

**Files:**
- Modify: `app/(app)/jobs/JobsClient.tsx`
- Test: `app/(app)/jobs/JobsClient.test.tsx`

**Step 1: Write the failing test**

Add test IDs to ensure top toolbar contains sort + results badge in same container.

Test (update after code change):
```tsx
const toolbar = screen.getByTestId("jobs-toolbar");
expect(within(toolbar).getByTestId("jobs-sort")).toBeInTheDocument();
expect(within(toolbar).getByTestId("jobs-results-count")).toBeInTheDocument();
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run app/(app)/jobs/JobsClient.test.tsx`
Expected: FAIL because test IDs do not exist yet.

**Step 3: Write minimal implementation**

In `JobsClient.tsx`:
- Add `data-testid="jobs-toolbar"` to the top search/filter block.
- Move the “Posted: newest” Select and results count pill into the same grid row (after status filter).
- Remove the bottom row that previously held these elements.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run app/(app)/jobs/JobsClient.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/(app)/jobs/JobsClient.tsx app/(app)/jobs/JobsClient.test.tsx
git commit -m "refactor(jobs): merge sort/results into top toolbar"
```

---

### Task 3: Replace list/detail scroll with ScrollArea

**Files:**
- Modify: `app/(app)/jobs/JobsClient.tsx`
- Test: `app/(app)/jobs/JobsClient.test.tsx`

**Step 1: Write the failing test**

Add test IDs for scroll containers:
```tsx
expect(screen.getByTestId("jobs-results-scroll")).toBeInTheDocument();
expect(screen.getByTestId("jobs-details-scroll")).toBeInTheDocument();
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run app/(app)/jobs/JobsClient.test.tsx`
Expected: FAIL (IDs not present).

**Step 3: Write minimal implementation**

In `JobsClient.tsx`:
- Import `ScrollArea` from `@/components/ui/scroll-area`.
- Wrap Results list container with `<ScrollArea data-testid="jobs-results-scroll" className="h-full">`.
- Wrap JD detail content container with `<ScrollArea data-testid="jobs-details-scroll" className="h-full">`.
- Ensure parent panels keep `min-h-0` and `flex-1` so ScrollArea gets height.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run app/(app)/jobs/JobsClient.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/(app)/jobs/JobsClient.tsx app/(app)/jobs/JobsClient.test.tsx
git commit -m "feat(jobs): use ScrollArea for list and details"
```

---

### Task 4: Ensure page-level scroll is locked and layout stable

**Files:**
- Modify: `app/(app)/layout.tsx`
- Modify: `app/RouteTransition.tsx`
- Modify: `app/(app)/jobs/JobsClient.tsx`
- Modify: `app/globals.css`
- Test: `app/(app)/jobs/JobsClient.test.tsx`

**Step 1: Write the failing test**

Add a test to verify `jobs-no-scroll` is applied after render:
```tsx
await waitFor(() => {
  expect(document.body.classList.contains("jobs-no-scroll")).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run app/(app)/jobs/JobsClient.test.tsx`
Expected: FAIL (class not applied).

**Step 3: Write minimal implementation**

In `JobsClient.tsx`:
- Keep/ensure `useEffect` adds/removes `jobs-no-scroll`.

In `globals.css`:
```css
body.jobs-no-scroll { overflow: hidden; }
```

In layout:
- Ensure top-level uses `flex` + `flex-1` + `min-h-0` where needed (already present).

**Step 4: Run test to verify it passes**

Run: `npm test -- --run app/(app)/jobs/JobsClient.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/(app)/jobs/JobsClient.tsx app/globals.css app/(app)/layout.tsx app/RouteTransition.tsx app/(app)/jobs/JobsClient.test.tsx
git commit -m "fix(jobs): lock body scroll and stabilize layout"
```

---

### Task 5: Full verification

**Step 1: Run tests**

Run: `npm test`
Expected: PASS.

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS.

**Step 3: Run build**

Run: `npm run build`
Expected: PASS.

**Step 4: Commit verification note**

```bash
git status
```
Expected: clean working tree.

---

Plan complete and saved to `docs/plans/2026-01-30-jobs-scrollarea-layout.md`. Two execution options:

1. Subagent-Driven (this session) — I dispatch fresh subagent per task, review between tasks, fast iteration  
2. Parallel Session (separate) — Open new session with executing-plans, batch execution with checkpoints

Which approach? 
