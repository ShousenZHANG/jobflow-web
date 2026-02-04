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

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { GET, POST } from "@/app/api/ai-prompt-profile/route";

describe("ai prompt profile api", () => {
  beforeEach(() => {
    aiPromptProfileStore.findUnique.mockReset();
    aiPromptProfileStore.upsert.mockReset();
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  it("returns null when profile missing", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    aiPromptProfileStore.findUnique.mockResolvedValueOnce(null);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.profile).toBeNull();
  });

  it("upserts profile on POST", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    aiPromptProfileStore.upsert.mockResolvedValueOnce({
      id: "ai-1",
      userId: "user-1",
      cvRules: ["A"],
      coverRules: ["B"],
    });

    const payload = {
      cvRules: ["A"],
      coverRules: ["B"],
    };

    const res = await POST(
      new Request("http://localhost/api/ai-prompt-profile", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.profile.cvRules).toEqual(["A"]);
  });
});

