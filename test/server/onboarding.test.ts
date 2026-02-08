import { describe, expect, it } from "vitest";

import {
  ONBOARDING_TASKS,
  defaultOnboardingChecklist,
  isOnboardingComplete,
  normalizeOnboardingChecklist,
} from "@/lib/onboarding";

describe("onboarding task model", () => {
  it("defines five ordered guide tasks including generate and download", () => {
    expect(ONBOARDING_TASKS.map((task) => task.id)).toEqual([
      "resume_setup",
      "first_fetch",
      "triage_first_job",
      "generate_first_pdf",
      "download_first_pdf",
    ]);
  });

  it("creates a checklist with all guide tasks defaulting to false", () => {
    expect(defaultOnboardingChecklist()).toEqual({
      resume_setup: false,
      first_fetch: false,
      triage_first_job: false,
      generate_first_pdf: false,
      download_first_pdf: false,
    });
  });

  it("normalizes invalid values and keeps valid booleans", () => {
    expect(
      normalizeOnboardingChecklist({
        resume_setup: true,
        first_fetch: "yes",
        triage_first_job: true,
      }),
    ).toEqual({
      resume_setup: true,
      first_fetch: false,
      triage_first_job: true,
      generate_first_pdf: false,
      download_first_pdf: false,
    });
  });

  it("treats onboarding as complete only when all tasks are done", () => {
    const incomplete = {
      resume_setup: true,
      first_fetch: true,
      triage_first_job: true,
      generate_first_pdf: true,
      download_first_pdf: false,
    };
    const complete = {
      ...incomplete,
      download_first_pdf: true,
    };

    expect(isOnboardingComplete(incomplete)).toBe(false);
    expect(isOnboardingComplete(complete)).toBe(true);
  });
});
