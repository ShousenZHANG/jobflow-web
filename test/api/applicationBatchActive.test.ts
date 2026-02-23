import { beforeEach, describe, expect, it, vi } from "vitest";

const applicationBatchStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    applicationBatch: applicationBatchStore,
  },
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { GET } from "@/app/api/application-batches/active/route";

describe("application batch active api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    applicationBatchStore.findFirst.mockReset();
  });

  it("returns latest batch id for current user", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    applicationBatchStore.findFirst.mockResolvedValueOnce({
      id: "550e8400-e29b-41d4-a716-446655440000",
      status: "RUNNING",
      updatedAt: new Date("2026-02-22T10:10:00.000Z"),
    });

    const res = await GET(new Request("http://localhost/api/application-batches/active"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.batchId).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(json.status).toBe("RUNNING");
    expect(typeof json.updatedAt).toBe("string");
  });
});
