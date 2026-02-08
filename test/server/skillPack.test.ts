import { describe, expect, it } from "vitest";

import { buildGlobalSkillPackFiles } from "@/lib/server/ai/skillPack";
import { DEFAULT_RULES } from "@/lib/server/ai/promptSkills";

describe("skill pack cover prompt template", () => {
  it("includes recruiter-style top-3 alignment, full keyword bolding guidance, and natural-professional tone", () => {
    const files = buildGlobalSkillPackFiles(DEFAULT_RULES);
    const coverPrompt = files.find(
      (file) => file.name === "jobflow-skill-pack/prompts/cover-user-prompt-template.txt",
    );

    expect(coverPrompt).toBeTruthy();
    if (!coverPrompt) return;

    const text = coverPrompt.content;
    expect(text).toContain("Top-3 JD responsibilities");
    expect(text).toContain("Bold all JD-critical keywords");
    expect(text).toContain("professional but natural");
  });
});
