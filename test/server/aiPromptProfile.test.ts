import { beforeEach, describe, expect, it, vi } from "vitest";

const aiPromptProfileStore = vi.hoisted(() => ({
  findUnique: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    aiPromptProfile: aiPromptProfileStore,
  },
}));

import { getAiPromptProfile, upsertAiPromptProfile } from "@/lib/server/aiPromptProfile";

describe("ai prompt profile data access", () => {
  beforeEach(() => {
    aiPromptProfileStore.findUnique.mockReset();
    aiPromptProfileStore.upsert.mockReset();
  });

  it("upserts and fetches ai prompt profile", async () => {
    const userId = "user-1";
    aiPromptProfileStore.upsert.mockResolvedValueOnce({
      id: "ai-1",
      userId,
      cvRules: ["A"],
      coverRules: ["B"],
    });
    aiPromptProfileStore.findUnique.mockResolvedValueOnce({
      id: "ai-1",
      userId,
      cvRules: ["A"],
      coverRules: ["B"],
    });

    await upsertAiPromptProfile(userId, { cvRules: ["A"], coverRules: ["B"] });
    const profile = await getAiPromptProfile(userId);

    expect(aiPromptProfileStore.upsert).toHaveBeenCalledWith({
      where: { userId },
      create: { userId, cvRules: ["A"], coverRules: ["B"] },
      update: { cvRules: ["A"], coverRules: ["B"] },
    });
    expect(profile?.cvRules).toEqual(["A"]);
  });
});

