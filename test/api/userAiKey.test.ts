import { beforeEach, describe, expect, it, vi } from "vitest";

const aiProviderStore = vi.hoisted(() => ({
  findUnique: vi.fn(),
  upsert: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    userAiProviderConfig: aiProviderStore,
  },
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/server/crypto/encryption", () => ({
  encryptSecret: vi.fn(() => ({
    ciphertext: "cipher",
    iv: "iv",
    tag: "tag",
  })),
}));

import { getServerSession } from "next-auth/next";
import { GET, POST, DELETE } from "@/app/api/user-ai-key/route";

describe("user ai key api", () => {
  beforeEach(() => {
    aiProviderStore.findUnique.mockReset();
    aiProviderStore.upsert.mockReset();
    aiProviderStore.delete.mockReset();
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  it("returns null when config missing", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    aiProviderStore.findUnique.mockResolvedValueOnce(null);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.config).toBeNull();
  });

  it("upserts config on POST", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    aiProviderStore.upsert.mockResolvedValueOnce({
      id: "cfg-1",
      provider: "GEMINI",
      model: "gemini-2.5-flash",
    });

    const res = await POST(
      new Request("http://localhost/api/user-ai-key", {
        method: "POST",
        body: JSON.stringify({
          provider: "gemini",
          model: "gemini-2.5-flash",
          apiKey: "secret-key",
        }),
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.config.provider).toBe("gemini");
  });

  it("deletes config on DELETE", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    aiProviderStore.delete.mockResolvedValueOnce({
      id: "cfg-1",
    });

    const res = await DELETE();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.deleted).toBe(true);
  });
});
