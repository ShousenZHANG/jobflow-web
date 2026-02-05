import { afterEach, describe, expect, it, vi } from "vitest";

const buildTailorPrompts = vi.hoisted(() =>
  vi.fn(() => ({
    systemPrompt: "system",
    userPrompt: "user",
  })),
);

const getAiPromptProfile = vi.hoisted(() => vi.fn());
const getUserAiProvider = vi.hoisted(() => vi.fn());
const decryptSecret = vi.hoisted(() => vi.fn(() => "user-key"));
const encryptSecret = vi.hoisted(() =>
  vi.fn(() => ({ ciphertext: "cipher", iv: "iv", tag: "tag" })),
);

vi.mock("@/lib/server/ai/buildPrompt", () => ({
  buildTailorPrompts,
}));

vi.mock("@/lib/server/aiPromptProfile", () => ({
  getAiPromptProfile,
}));

vi.mock("@/lib/server/userAiProvider", () => ({
  getUserAiProvider,
}));

vi.mock("@/lib/server/crypto/encryption", () => ({
  decryptSecret,
  encryptSecret,
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
  const originalEncKey = process.env.APP_ENC_KEY;

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalKey;
    process.env.GEMINI_MODEL = originalModel;
    process.env.APP_ENC_KEY = originalEncKey;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("keeps base summary when API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    getUserAiProvider.mockResolvedValueOnce(null);

    const result = await tailorApplicationContent(INPUT);
    expect(result.cvSummary).toBe(INPUT.baseSummary);
    expect(result.source.cv).toBe("base");
  });

  it("keeps base summary when AI response is invalid", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    getUserAiProvider.mockResolvedValueOnce(null);
    vi.spyOn(providers, "callProvider").mockResolvedValueOnce("not-json");

    const result = await tailorApplicationContent(INPUT);
    expect(result.cvSummary).toBe(INPUT.baseSummary);
    expect(result.source.cv).toBe("base");
  });

  it("uses user-specific rules when profile exists", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    getAiPromptProfile.mockResolvedValueOnce({
      cvRules: ["CUSTOM CV RULE"],
      coverRules: ["CUSTOM COVER RULE"],
    });
    getUserAiProvider.mockResolvedValueOnce(null);
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
    const passedRules = buildTailorPrompts.mock.calls[0][0];
    expect(passedRules.cvRules).toEqual(["CUSTOM CV RULE"]);
    expect(passedRules.coverRules).toEqual(["CUSTOM COVER RULE"]);
  });

  it("uses user provider config when present", async () => {
    process.env.GEMINI_API_KEY = "";
    getUserAiProvider.mockReset();
    getUserAiProvider.mockResolvedValue({
      provider: "OPENAI",
      model: "gpt-4o",
      apiKeyCiphertext: "cipher",
      apiKeyIv: "iv",
      apiKeyTag: "tag",
    });
    const callProviderSpy = vi
      .spyOn(providers, "callProvider")
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

    await tailorApplicationContent({ ...INPUT, userId: "user-1" });

    expect(getUserAiProvider).toHaveBeenCalledWith("user-1");
    expect(decryptSecret).toHaveBeenCalled();
    expect(callProviderSpy).toHaveBeenCalledWith(
      "openai",
      expect.objectContaining({ apiKey: "user-key", model: "gpt-4o" }),
    );
  });
});
