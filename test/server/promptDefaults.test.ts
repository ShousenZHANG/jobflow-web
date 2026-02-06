import { describe, expect, it } from "vitest";

import { DEFAULT_COVER_RULES, DEFAULT_CV_RULES } from "@/lib/shared/aiPromptDefaults";
import { DEFAULT_RULES } from "@/lib/server/ai/promptSkills";
import { buildTailorPrompts } from "@/lib/server/ai/buildPrompt";

describe("default prompt rules", () => {
  it("includes recruiter-level and XYZ bullet guidance in CV rules", () => {
    const cvText = DEFAULT_CV_RULES.join("\n").toLowerCase();
    expect(cvText).toContain("senior recruiter");
    expect(cvText).toContain("google xyz");
  });

  it("keeps strict three-paragraph cover structure", () => {
    const coverText = DEFAULT_COVER_RULES.join("\n").toLowerCase();
    expect(coverText).toContain("exactly three short paragraphs");
    expect(coverText).toContain("paragraph 1");
    expect(coverText).toContain("paragraph 2");
    expect(coverText).toContain("paragraph 3");
  });

  it("uses recruiter role in system prompt", () => {
    const prompts = buildTailorPrompts(DEFAULT_RULES, {
      baseSummary: "Base summary",
      jobTitle: "Software Engineer",
      company: "Example Co",
      description: "Build product features.",
    });
    expect(prompts.systemPrompt.toLowerCase()).toContain("senior recruiter-level");
  });
});

