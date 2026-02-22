import { describe, expect, it } from "vitest";

import { buildGlobalSkillPackFiles } from "@/lib/server/ai/skillPack";
import { DEFAULT_RULES } from "@/lib/server/ai/promptSkills";

describe("skill pack cover prompt template", () => {
  it("includes resume summary keyword bolding guidance with JSON-only framing", () => {
    const files = buildGlobalSkillPackFiles(DEFAULT_RULES);
    const resumePrompt = files.find(
      (file) => file.name === "jobflow-skill-pack/prompts/resume-user-prompt-template.txt",
    );

    expect(resumePrompt).toBeTruthy();
    if (!resumePrompt) return;

    const text = resumePrompt.content;
    expect(text).toContain("In cvSummary, bold JD-critical keywords using clean markdown **keyword** markers.");
    expect(text).toContain("JSON-only requirement applies to outer output structure");
  });

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

  it("exports formal JSON schemas for resume and cover contracts", () => {
    const files = buildGlobalSkillPackFiles(DEFAULT_RULES);
    const resumeSchema = files.find(
      (file) => file.name === "jobflow-skill-pack/schema/output-schema.resume.json",
    );
    const coverSchema = files.find(
      (file) => file.name === "jobflow-skill-pack/schema/output-schema.cover.json",
    );

    expect(resumeSchema).toBeTruthy();
    expect(coverSchema).toBeTruthy();
    if (!resumeSchema || !coverSchema) return;

    const resumeParsed = JSON.parse(resumeSchema.content);
    const coverParsed = JSON.parse(coverSchema.content);

    expect(resumeParsed.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
    expect(resumeParsed.type).toBe("object");
    expect(coverParsed.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
    expect(coverParsed.type).toBe("object");
  });

  it("supports redacted skill pack context export", () => {
    const files = buildGlobalSkillPackFiles(
      DEFAULT_RULES,
      {
        resumeSnapshot: {
          summary: "secret summary",
          experiences: [{ title: "Engineer", bullets: ["secret bullet"] }],
        },
        resumeSnapshotUpdatedAt: "2026-02-23T00:00:00.000Z",
      },
      { redactContext: true },
    );
    const context = files.find((file) => file.name === "jobflow-skill-pack/context/resume-snapshot.json");

    expect(context).toBeTruthy();
    if (!context) return;

    const parsed = JSON.parse(context.content);
    expect(parsed.summary).toBe("[REDACTED]");
    expect(Array.isArray(parsed.experiences)).toBe(true);
    expect(parsed.experiences).toHaveLength(0);
  });
});
