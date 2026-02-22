import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaStore = vi.hoisted(() => ({
  applicationBatch: {
    findFirst: vi.fn(),
    updateMany: vi.fn(),
    update: vi.fn(),
  },
  applicationBatchTask: {
    findFirst: vi.fn(),
    updateMany: vi.fn(),
    groupBy: vi.fn(),
  },
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: prismaStore,
}));

import { claimNextBatchTask } from "@/lib/server/applicationBatches/runner";

describe("application batch runner", () => {
  beforeEach(() => {
    prismaStore.applicationBatch.findFirst.mockReset();
    prismaStore.applicationBatch.updateMany.mockReset();
    prismaStore.applicationBatch.update.mockReset();
    prismaStore.applicationBatchTask.findFirst.mockReset();
    prismaStore.applicationBatchTask.updateMany.mockReset();
    prismaStore.applicationBatchTask.groupBy.mockReset();
  });

  it("reclaims stale RUNNING tasks before claiming next pending task", async () => {
    prismaStore.applicationBatch.findFirst.mockResolvedValueOnce({
      id: "550e8400-e29b-41d4-a716-446655440000",
      status: "RUNNING",
    });

    prismaStore.applicationBatchTask.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 1 });

    prismaStore.applicationBatchTask.findFirst.mockResolvedValueOnce({
      id: "660e8400-e29b-41d4-a716-446655440000",
      jobId: "770e8400-e29b-41d4-a716-446655440000",
      job: {
        title: "Software Engineer",
        company: "Acme",
        jobUrl: "https://example.com/jobs/1",
      },
    });

    const claimed = await claimNextBatchTask({
      userId: "user-1",
      batchId: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(claimed.kind).toBe("claimed");
    expect(prismaStore.applicationBatchTask.updateMany).toHaveBeenCalledTimes(2);
    expect(prismaStore.applicationBatchTask.updateMany.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "RUNNING",
          completedAt: null,
        }),
        data: expect.objectContaining({
          status: "PENDING",
          startedAt: null,
          completedAt: null,
          attempt: { increment: 1 },
        }),
      }),
    );
  });
});

