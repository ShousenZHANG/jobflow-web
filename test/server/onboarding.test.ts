import { describe, expect, it } from "vitest";

import {
  ONBOARDING_TASKS,
  defaultOnboardingChecklist,
  isOnboardingComplete,
  mergeOnboardingChecklists,
  normalizeOnboardingChecklist,
} from "@/lib/onboarding";

describe("onboarding task model", () => {
  it("defines three ordered guide tasks focused on resume, fetch, and first CV PDF", () => {
    expect(ONBOARDING_TASKS.map((task) => task.id)).toEqual([
      "resume_setup",
      "first_fetch",
      "generate_first_pdf",
    ]);
  });

  it("creates a checklist with all guide tasks defaulting to false", () => {
    expect(defaultOnboardingChecklist()).toEqual({
      resume_setup: false,
      first_fetch: false,
      generate_first_pdf: false,
    });
  });

  it("normalizes invalid values and keeps valid booleans", () => {
    expect(
      normalizeOnboardingChecklist({
        resume_setup: true,
        first_fetch: "yes",
      }),
    ).toEqual({
      resume_setup: true,
      first_fetch: false,
      generate_first_pdf: false,
    });
  });

  it("treats onboarding as complete only when all tasks are done", () => {
    const incomplete = {
      resume_setup: true,
      first_fetch: true,
      generate_first_pdf: false,
    };
    const complete = {
      ...incomplete,
      generate_first_pdf: true,
    };

    expect(isOnboardingComplete(incomplete)).toBe(false);
    expect(isOnboardingComplete(complete)).toBe(true);
  });

  it("merges task updates without regressing completed items", () => {
    const afterFirstTask = {
      ...defaultOnboardingChecklist(),
      resume_setup: true,
    };
    const staleSecondPayload = {
      resume_setup: false,
      first_fetch: true,
    };

    expect(
      mergeOnboardingChecklists(afterFirstTask, staleSecondPayload),
    ).toEqual({
      resume_setup: true,
      first_fetch: true,
      generate_first_pdf: false,
    });
  });
});
