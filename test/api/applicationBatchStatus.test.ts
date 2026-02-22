import { beforeEach, describe, expect, it, vi } from "vitest";

const applicationBatchStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

const applicationBatchTaskStore = vi.hoisted(() => ({
  groupBy: vi.fn(),
  findFirst: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    applicationBatch: applicationBatchStore,
    applicationBatchTask: applicationBatchTaskStore,
  },
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { GET } from "@/app/api/application-batches/[id]/route";

const BATCH_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("application batch status api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    applicationBatchStore.findFirst.mockReset();
    applicationBatchTaskStore.groupBy.mockReset();
    applicationBatchTaskStore.findFirst.mockReset();
  });

  it("returns task progress counters and next pending task", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });

    applicationBatchStore.findFirst.mockResolvedValueOnce({
      id: BATCH_ID,
      scope: "NEW",
      status: "RUNNING",
      totalCount: 5,
      createdAt: new Date("2026-02-22T10:00:00.000Z"),
      updatedAt: new Date("2026-02-22T10:01:00.000Z"),
      startedAt: new Date("2026-02-22T10:00:05.000Z"),
      completedAt: null,
      error: null,
    });
    applicationBatchTaskStore.groupBy.mockResolvedValueOnce([
      { status: "PENDING", _count: { _all: 2 } },
      { status: "RUNNING", _count: { _all: 1 } },
      { status: "SUCCEEDED", _count: { _all: 2 } },
    ]);
    applicationBatchTaskStore.findFirst.mockResolvedValueOnce({
      id: "task-1",
      jobId: "job-1",
      job: {
        id: "job-1",
        title: "Software Engineer",
        company: "Acme",
      },
    });

    const res = await GET(new Request(`http://localhost/api/application-batches/${BATCH_ID}`), {
      params: Promise.resolve({ id: BATCH_ID }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.batch.id).toBe(BATCH_ID);
    expect(json.progress.pending).toBe(2);
    expect(json.progress.running).toBe(1);
    expect(json.progress.succeeded).toBe(2);
    expect(json.progress.failed).toBe(0);
    expect(json.nextTask.jobTitle).toBe("Software Engineer");
  });
});
