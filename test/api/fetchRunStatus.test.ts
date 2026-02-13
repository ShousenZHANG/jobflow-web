import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchRunStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    fetchRun: fetchRunStore,
  },
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { GET } from "@/app/api/fetch-runs/[id]/route";

const RUN_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("fetch run status api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    fetchRunStore.findFirst.mockReset();
  });

  it("returns resolved query terms for UI progress transparency", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    fetchRunStore.findFirst.mockResolvedValueOnce({
      id: RUN_ID,
      status: "RUNNING",
      importedCount: 0,
      error: null,
      createdAt: new Date("2026-02-13T00:00:00Z"),
      updatedAt: new Date("2026-02-13T00:00:10Z"),
      queries: {
        title: "Software Engineer",
        queries: ["Software Engineer", "Frontend Engineer", "Backend Engineer"],
        smartExpand: true,
      },
    });

    const res = await GET(new Request(`http://localhost/api/fetch-runs/${RUN_ID}`), {
      params: Promise.resolve({ id: RUN_ID }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.run.queryTitle).toBe("Software Engineer");
    expect(json.run.queryTerms).toEqual([
      "Software Engineer",
      "Frontend Engineer",
      "Backend Engineer",
    ]);
    expect(json.run.smartExpand).toBe(true);
  });
});

