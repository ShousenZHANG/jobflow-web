import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchRunStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
  updateMany: vi.fn(),
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
import { POST } from "@/app/api/fetch-runs/[id]/trigger/route";

const RUN_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("fetch run trigger api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    fetchRunStore.findFirst.mockReset();
    fetchRunStore.updateMany.mockReset();
    process.env.GITHUB_OWNER = "o";
    process.env.GITHUB_REPO = "r";
    process.env.GITHUB_TOKEN = "t";
    process.env.GITHUB_WORKFLOW_FILE = "jobspy-fetch.yml";
    process.env.GITHUB_REF = "master";
  });

  it("keeps QUEUED and takes a dispatch lock instead of setting RUNNING", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    fetchRunStore.findFirst.mockResolvedValueOnce({
      id: RUN_ID,
      status: "QUEUED",
      queries: { title: "Software Engineer", queries: ["Software Engineer"] },
      updatedAt: new Date("2026-02-14T00:00:00Z"),
    });
    fetchRunStore.updateMany.mockResolvedValue({ count: 1 });

    // 204 responses cannot include a body in the Response constructor.
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(new Request(`http://localhost/api/fetch-runs/${RUN_ID}/trigger`, { method: "POST" }), {
      params: Promise.resolve({ id: RUN_ID }),
    });

    expect(res.status).toBe(200);
    expect(fetchRunStore.updateMany).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalled();
  });

  it("is idempotent when already dispatched", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    fetchRunStore.findFirst.mockResolvedValueOnce({
      id: RUN_ID,
      status: "QUEUED",
      queries: {
        title: "Software Engineer",
        queries: ["Software Engineer"],
        dispatchMeta: { dispatchedAt: "2026-02-14T00:00:01.000Z" },
      },
      updatedAt: new Date("2026-02-14T00:00:00Z"),
    });

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(new Request(`http://localhost/api/fetch-runs/${RUN_ID}/trigger`, { method: "POST" }), {
      params: Promise.resolve({ id: RUN_ID }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.alreadyDispatched).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
