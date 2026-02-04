import { afterEach, describe, expect, it, vi } from "vitest";

const buildTailorPrompts = vi.hoisted(() =>
  vi.fn(() => ({
    systemPrompt: "system",
    userPrompt: "user",
  })),
);

const getAiPromptProfile = vi.hoisted(() => vi.fn());

vi.mock("@/lib/server/ai/buildPrompt", () => ({
  buildTailorPrompts,
}));

vi.mock("@/lib/server/aiPromptProfile", () => ({
  getAiPromptProfile,
}));

import { tailorApplicationContent } from "@/lib/server/ai/tailorApplication";

const INPUT = {
  baseSummary: "Experienced full-stack engineer focused on product delivery.",
  jobTitle: "Software Engineer",
  company: "Example Co",
  description: "Build customer-facing features with TypeScript and React.",
};

describe("tailorApplicationContent", () => {
  const originalKey = process.env.OPENAI_API_KEY;
  const originalModel = process.env.OPENAI_MODEL;

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalKey;
    process.env.OPENAI_MODEL = originalModel;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("keeps base summary when API key is missing", async () => {
    delete process.env.OPENAI_API_KEY;

    const result = await tailorApplicationContent(INPUT);
    expect(result.cvSummary).toBe(INPUT.baseSummary);
    expect(result.source.cv).toBe("base");
  });

  it("keeps base summary when AI response is invalid", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ choices: [{ message: { content: "not-json" } }] }),
      })),
    );

    const result = await tailorApplicationContent(INPUT);
    expect(result.cvSummary).toBe(INPUT.baseSummary);
    expect(result.source.cv).toBe("base");
  });

  it("uses user-specific rules when profile exists", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    getAiPromptProfile.mockResolvedValueOnce({
      cvRules: ["CUSTOM CV RULE"],
      coverRules: ["CUSTOM COVER RULE"],
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        json: async () => ({}),
      })),
    );

    await tailorApplicationContent({ ...INPUT, userId: "user-1" });

    expect(buildTailorPrompts).toHaveBeenCalled();
    const passedRules = buildTailorPrompts.mock.calls[0][0];
    expect(passedRules.cvRules).toEqual(["CUSTOM CV RULE"]);
    expect(passedRules.coverRules).toEqual(["CUSTOM COVER RULE"]);
  });
});
