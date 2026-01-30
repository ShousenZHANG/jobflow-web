# Jobs Instant Filter Performance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make filter changes feel instant by debouncing inputs, keeping previous results visible with skeleton overlay, and canceling in-flight requests.

**Architecture:** Debounce all filter inputs into a single `debouncedFilters` object used in the React Query `queryKey`. Enable request cancellation via `AbortSignal`, keep previous data on screen while `isFetching`, and show a light skeleton overlay to hide latency without resetting scroll.

**Tech Stack:** Next.js (app router), React 19, TanStack React Query, Tailwind CSS, Vitest + Testing Library.

---

### Task 1: Add a reusable debounce hook

**Files:**
- Create: `hooks/useDebouncedValue.ts`
- Test: `test/useDebouncedValue.test.tsx`

**Step 1: Write the failing test**

```tsx
import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

describe("useDebouncedValue", () => {
  it("debounces updates by the delay", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 200 } },
    );

    expect(result.current).toBe("a");
    rerender({ value: "ab", delay: 200 });

    vi.advanceTimersByTime(150);
    expect(result.current).toBe("a");

    vi.advanceTimersByTime(50);
    expect(result.current).toBe("ab");
    vi.useRealTimers();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- test/useDebouncedValue.test.tsx`
Expected: FAIL with "Cannot find module '@/hooks/useDebouncedValue'" or missing export.

**Step 3: Write minimal implementation**

```ts
import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- test/useDebouncedValue.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add hooks/useDebouncedValue.ts test/useDebouncedValue.test.tsx
git commit -m "feat: add debounced value hook"
```

---

### Task 2: Debounce all filters and cancel in-flight requests

**Files:**
- Modify: `app/(app)/jobs/JobsClient.tsx`
- Test: `app/(app)/jobs/JobsClient.test.tsx`

**Step 1: Write the failing test**

```tsx
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

it("debounces keyword changes before fetching", async () => {
  vi.useFakeTimers();
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

  const input = await screen.findByPlaceholderText("e.g. software engineer");
  await user.clear(input);
  await user.type(input, "designer");

  // Not yet fetched within 150ms
  vi.advanceTimersByTime(150);
  expect(global.fetch).not.toHaveBeenCalledWith(expect.stringContaining("q=designer"), expect.anything());

  // After 200ms debounce, fetch fires
  vi.advanceTimersByTime(60);
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("q=designer"), expect.anything());

  vi.useRealTimers();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- app/(app)/jobs/JobsClient.test.tsx`
Expected: FAIL because debounce isn¡¯t implemented for all filters and fetch timing doesn¡¯t match.

**Step 3: Implement debounced filters + abort support**

- Create a `filters` object from `q`, `statusFilter`, `locationFilter`, `jobLevelFilter`, `sortOrder`, `pageSize`.
- Use `useDebouncedValue(filters, 200)` and build `queryString` from the debounced object.
- Update `useQuery` `queryFn` signature to accept `signal` and pass it into `fetch` (cancels prior in-flight requests).
- Keep `placeholderData` (or `keepPreviousData: true`) and `staleTime` (e.g. 30s).
- Ensure cursor reset effect depends on `queryString` (already exists).

Minimal snippet for queryFn:

```ts
queryFn: async ({ signal }) => {
  const sp = new URLSearchParams(queryString);
  if (cursor) sp.set("cursor", cursor);
  const res = await fetch(`/api/jobs?${sp.toString()}`, { cache: "no-store", signal });
  ...
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- app/(app)/jobs/JobsClient.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/(app)/jobs/JobsClient.tsx app/(app)/jobs/JobsClient.test.tsx
git commit -m "feat: debounce filters and cancel stale job queries"
```

---

### Task 3: Add smooth loading overlay while keeping results visible

**Files:**
- Modify: `app/(app)/jobs/JobsClient.tsx`
- Test: `app/(app)/jobs/JobsClient.test.tsx`

**Step 1: Write the failing test**

```tsx
it("shows a light loading overlay while keeping previous results", async () => {
  renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

  const resultsPane = await screen.findByTestId("jobs-results-scroll");
  expect(resultsPane).toHaveAttribute("data-loading", "false");
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- app/(app)/jobs/JobsClient.test.tsx`
Expected: FAIL because `data-loading` attribute does not exist.

**Step 3: Implement overlay and loading attribute**

- Add `data-loading={loading && items.length > 0}` to results and details containers.
- When `loading && items.length > 0`, apply a subtle `opacity-70` and a lightweight skeleton overlay (e.g. absolute positioned div with 2¨C3 skeleton rows).
- Ensure no scroll reset and no content unmount.

**Step 4: Run test to verify it passes**

Run: `npm test -- app/(app)/jobs/JobsClient.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/(app)/jobs/JobsClient.tsx app/(app)/jobs/JobsClient.test.tsx
git commit -m "feat: add smooth loading overlay for filter updates"
```

---

Plan complete and saved to `docs/plans/2026-01-30-jobs-instant-filtering.md`. Two execution options:

1. Subagent-Driven (this session) ¡ª I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) ¡ª Open new session with executing-plans, batch execution with checkpoints

Which approach?
