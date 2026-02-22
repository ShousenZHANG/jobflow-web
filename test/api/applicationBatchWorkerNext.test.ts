import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  requireApplicationBatchWorkerSecret: vi.fn(),
}));

const runner = vi.hoisted(() => ({
  runNextAvailableBatchStep: vi.fn(),
}));

vi.mock("@/lib/server/applicationBatches/auth", () => auth);
vi.mock("@/lib/server/applicationBatches/runner", () => runner);

import { POST } from "@/app/api/application-batches/worker/next/route";

describe("application batch worker next api", () => {
  beforeEach(() => {
    auth.requireApplicationBatchWorkerSecret.mockReset();
    runner.runNextAvailableBatchStep.mockReset();
    auth.requireApplicationBatchWorkerSecret.mockReturnValue(true);
  });

  it("returns idle when no runnable batch exists", async () => {
    runner.runNextAvailableBatchStep.mockResolvedValueOnce({ outcome: "idle" });

    const res = await POST(
      new Request("http://localhost/api/application-batches/worker/next", { method: "POST" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.outcome).toBe("idle");
  });

  it("executes multiple steps when maxSteps is set", async () => {
    runner.runNextAvailableBatchStep
      .mockResolvedValueOnce({
        outcome: "processed",
        batchId: "batch-1",
        userId: "user-1",
        taskId: "task-1",
        jobId: "job-1",
        taskStatus: "SUCCEEDED",
        batchStatus: "RUNNING",
        progress: { pending: 2, running: 0, succeeded: 1, failed: 0, skipped: 0 },
      })
      .mockResolvedValueOnce({
        outcome: "done",
        batchId: "batch-1",
        userId: "user-1",
        batchStatus: "SUCCEEDED",
        progress: { pending: 0, running: 0, succeeded: 3, failed: 0, skipped: 0 },
      });

    const res = await POST(
      new Request("http://localhost/api/application-batches/worker/next", {
        method: "POST",
        body: JSON.stringify({ maxSteps: 5 }),
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.outcome).toBe("done");
    expect(runner.runNextAvailableBatchStep).toHaveBeenCalledTimes(2);
  });
});
