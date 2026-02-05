import { describe, expect, it, vi } from "vitest";
import { getUserAiProvider, upsertUserAiProvider } from "@/lib/server/userAiProvider";

const providerStore = vi.hoisted(() => ({
  findUnique: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    userAiProviderConfig: providerStore,
  },
}));

describe("user ai provider data access", () => {
  it("upserts and fetches config", async () => {
    providerStore.upsert.mockResolvedValueOnce({ provider: "GEMINI" });
    providerStore.findUnique.mockResolvedValueOnce({ provider: "GEMINI" });

    const userId = "user-1";
    await upsertUserAiProvider(userId, {
      provider: "GEMINI",
      model: "gemini-2.5-flash",
      apiKeyCiphertext: "c",
      apiKeyIv: "i",
      apiKeyTag: "t",
    });
    const config = await getUserAiProvider(userId);
    expect(config?.provider).toBe("GEMINI");
  });
});
