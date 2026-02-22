import { beforeEach, describe, expect, it, vi } from "vitest";

const runner = vi.hoisted(() => ({
  createRetryBatchFromFailed: vi.fn(),
  BatchRunnerError: class BatchRunnerError extends Error {
    code: "NOT_FOUND" | "INVALID_STATE";

    constructor(code: "NOT_FOUND" | "INVALID_STATE", message: string) {
      super(message);
      this.code = code;
    }
  },
}));

vi.mock("@/lib/server/applicationBatches/runner", () => runner);

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { POST } from "@/app/api/application-batches/[id]/retry-failed/route";

const BATCH_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("application batch retry-failed api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    runner.createRetryBatchFromFailed.mockReset();
  });

  it("creates a new queued retry batch", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    runner.createRetryBatchFromFailed.mockResolvedValueOnce({
      sourceBatchId: BATCH_ID,
      batch: {
        id: "660e8400-e29b-41d4-a716-446655440000",
        scope: "NEW",
        status: "QUEUED",
        totalCount: 4,
        createdAt: new Date("2026-02-22T10:00:00Z"),
      },
    });

    const res = await POST(
      new Request(`http://localhost/api/application-batches/${BATCH_ID}/retry-failed`, {
        method: "POST",
        body: JSON.stringify({ limit: 20 }),
      }),
      { params: Promise.resolve({ id: BATCH_ID }) },
    );
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.batch.status).toBe("QUEUED");
    expect(json.batch.totalCount).toBe(4);
  });
});
