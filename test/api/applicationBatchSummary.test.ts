import { beforeEach, describe, expect, it, vi } from "vitest";

const applicationBatchStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

const applicationBatchTaskStore = vi.hoisted(() => ({
  groupBy: vi.fn(),
  findMany: vi.fn(),
}));

const applicationStore = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    applicationBatch: applicationBatchStore,
    applicationBatchTask: applicationBatchTaskStore,
    application: applicationStore,
  },
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { GET } from "@/app/api/application-batches/[id]/summary/route";

const BATCH_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("application batch summary api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    applicationBatchStore.findFirst.mockReset();
    applicationBatchTaskStore.groupBy.mockReset();
    applicationBatchTaskStore.findMany.mockReset();
    applicationStore.findMany.mockReset();
  });

  it("returns success/failure/remaining summary for codex batch run", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    applicationBatchStore.findFirst.mockResolvedValueOnce({
      id: BATCH_ID,
      scope: "NEW",
      status: "RUNNING",
      totalCount: 4,
      error: null,
      createdAt: new Date("2026-02-22T10:00:00.000Z"),
      updatedAt: new Date("2026-02-22T10:02:00.000Z"),
      startedAt: new Date("2026-02-22T10:00:10.000Z"),
      completedAt: null,
    });
    applicationBatchTaskStore.groupBy.mockResolvedValueOnce([
      { status: "PENDING", _count: { _all: 1 } },
      { status: "SUCCEEDED", _count: { _all: 2 } },
      { status: "FAILED", _count: { _all: 1 } },
    ]);
    applicationBatchTaskStore.findMany
      .mockResolvedValueOnce([
        {
          id: "task-failed-1",
          jobId: "job-3",
          status: "FAILED",
          error: "PARSE_FAILED",
          attempt: 1,
          updatedAt: new Date("2026-02-22T10:01:00.000Z"),
          job: { title: "Backend Engineer", company: "Acme", jobUrl: "https://example.com/3" },
        },
      ])
      .mockResolvedValueOnce([
        {
          id: "task-ok-1",
          jobId: "job-1",
          status: "SUCCEEDED",
          completedAt: new Date("2026-02-22T10:00:40.000Z"),
          job: { title: "Frontend Engineer", company: "Acme", jobUrl: "https://example.com/1" },
        },
      ]);
    applicationStore.findMany.mockResolvedValueOnce([
      {
        jobId: "job-1",
        resumePdfUrl: "https://blob.vercel-storage.com/r1.pdf",
        coverPdfUrl: "https://blob.vercel-storage.com/c1.pdf",
      },
    ]);

    const res = await GET(
      new Request(`http://localhost/api/application-batches/${BATCH_ID}/summary`),
      { params: Promise.resolve({ id: BATCH_ID }) },
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.batch.id).toBe(BATCH_ID);
    expect(json.progress.pending).toBe(1);
    expect(json.progress.succeeded).toBe(2);
    expect(json.progress.failed).toBe(1);
    expect(json.remainingCount).toBe(1);
    expect(json.failed).toHaveLength(1);
    expect(json.failed[0].error).toBe("PARSE_FAILED");
    expect(json.succeeded).toHaveLength(1);
    expect(json.succeeded[0].artifacts.resumePdfUrl).toContain("vercel-storage");
  });
});

