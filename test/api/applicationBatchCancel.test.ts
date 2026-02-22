import { beforeEach, describe, expect, it, vi } from "vitest";

const runner = vi.hoisted(() => ({
  cancelBatch: vi.fn(),
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
import { POST } from "@/app/api/application-batches/[id]/cancel/route";

const BATCH_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("application batch cancel api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    runner.cancelBatch.mockReset();
  });

  it("cancels active batch and returns progress", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    runner.cancelBatch.mockResolvedValueOnce({
      batchStatus: "CANCELLED",
      alreadyTerminal: false,
      progress: { pending: 0, running: 0, succeeded: 2, failed: 0, skipped: 3 },
    });

    const res = await POST(
      new Request(`http://localhost/api/application-batches/${BATCH_ID}/cancel`, { method: "POST" }),
      { params: Promise.resolve({ id: BATCH_ID }) },
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.batchStatus).toBe("CANCELLED");
    expect(json.progress.skipped).toBe(3);
  });
});
