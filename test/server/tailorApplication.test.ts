import { afterEach, describe, expect, it, vi } from "vitest";

const buildTailorPrompts = vi.hoisted(() =>
  vi.fn(() => ({
    systemPrompt: "system",
    userPrompt: "user",
  })),
);

vi.mock("@/lib/server/ai/buildPrompt", () => ({
  buildTailorPrompts,
}));

vi.mock("@/lib/server/promptRuleTemplates", () => ({
  getActivePromptSkillRulesForUser: vi.fn(() => ({
    id: "rules-active-1",
    locale: "en-AU",
    cvRules: ["cv-rule"],
    coverRules: ["cover-rule"],
    hardConstraints: ["json-only"],
  })),
}));

import { tailorApplicationContent } from "@/lib/server/ai/tailorApplication";
import * as providers from "@/lib/server/ai/providers";

const INPUT = {
  baseSummary: "Experienced full-stack engineer focused on product delivery.",
  jobTitle: "Software Engineer",
  company: "Example Co",
  description: "Build customer-facing features with TypeScript and React.",
};

describe("tailorApplicationContent", () => {
  const originalKey = process.env.GEMINI_API_KEY;
  const originalModel = process.env.GEMINI_MODEL;

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalKey;
    process.env.GEMINI_MODEL = originalModel;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("keeps base summary when API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;

    const result = await tailorApplicationContent(INPUT);
    expect(result.cvSummary).toBe(INPUT.baseSummary);
    expect(result.source.cv).toBe("base");
  });

  it("keeps base summary when AI response is invalid", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.spyOn(providers, "callProvider").mockResolvedValueOnce("not-json");

    const result = await tailorApplicationContent(INPUT);
    expect(result.cvSummary).toBe(INPUT.baseSummary);
    expect(result.source.cv).toBe("base");
  });

  it("uses default skill rules when prompting the model", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.spyOn(providers, "callProvider").mockResolvedValueOnce(
      JSON.stringify({
        cvSummary: "AI Summary",
        cover: {
          paragraphOne: "One",
          paragraphTwo: "Two",
          paragraphThree: "Three",
        },
      }),
    );

    await tailorApplicationContent({ ...INPUT, userId: "user-1" });

    expect(buildTailorPrompts).toHaveBeenCalled();
    const passedRules = buildTailorPrompts.mock.calls[0][0] as {
      cvRules: string[];
      coverRules: string[];
    };
    expect(passedRules.cvRules.length).toBeGreaterThan(0);
    expect(passedRules.coverRules.length).toBeGreaterThan(0);
  });

  it("builds cover evidence from resume snapshot and passes it to prompt builder", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.spyOn(providers, "callProvider").mockResolvedValueOnce(
      JSON.stringify({
        cvSummary: "AI Summary",
        cover: {
          paragraphOne: "One",
          paragraphTwo: "Two",
          paragraphThree: "Three",
        },
      }),
    );

    await tailorApplicationContent({
      ...INPUT,
      userId: "user-1",
      description:
        "Design backend APIs and improve CI/CD deployment reliability on AWS cloud platforms.",
      resumeSnapshot: {
        summary: "Backend engineer focused on API delivery and platform reliability.",
        experiences: [
          {
            title: "Software Engineer",
            company: "Acme",
            bullets: ["Built Java APIs and automated CI/CD deployment pipelines on AWS."],
          },
        ],
        projects: [
          {
            name: "Payments Platform",
            stack: "Java, AWS",
            bullets: ["Improved deployment reliability and API response consistency."],
          },
        ],
        skills: [{ category: "Cloud", items: ["AWS", "Docker"] }],
      },
    });

    const passedInput = buildTailorPrompts.mock.calls[0][1] as {
      coverContext?: {
        topResponsibilities: string[];
        matchedEvidence: string[];
      };
    };
    expect(passedInput.coverContext?.topResponsibilities.length).toBeGreaterThan(0);
    expect(passedInput.coverContext?.matchedEvidence.join(" ")).toContain("AWS");
    expect(passedInput.coverContext?.matchedEvidence.join(" ")).toContain("API");
  });

  it("retries with provider default model when custom model fails", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    process.env.GEMINI_MODEL = "gemini-2.5-pro";

    const callProviderSpy = vi
      .spyOn(providers, "callProvider")
      .mockRejectedValueOnce(new Error("OPENAI_400"))
      .mockResolvedValueOnce(
        JSON.stringify({
          cvSummary: "AI Summary",
          cover: {
            paragraphOne: "One",
            paragraphTwo: "Two",
            paragraphThree: "Three",
          },
        }),
      );

    const result = await tailorApplicationContent({ ...INPUT, userId: "user-1" });

    expect(result.reason).toBe("ai_ok");
    expect(callProviderSpy).toHaveBeenNthCalledWith(
      1,
      "gemini",
      expect.objectContaining({ model: "gemini-2.5-pro" }),
    );
    expect(callProviderSpy).toHaveBeenNthCalledWith(
      2,
      "gemini",
      expect.objectContaining({ model: "gemini-2.5-flash" }),
    );
  });
});
