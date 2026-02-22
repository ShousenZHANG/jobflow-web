import { beforeEach, describe, expect, it, vi } from "vitest";

const runner = vi.hoisted(() => ({
  runBatchStep: vi.fn(),
}));

vi.mock("@/lib/server/applicationBatches/runner", () => runner);

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { POST } from "@/app/api/application-batches/[id]/trigger/route";

const BATCH_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("application batch trigger api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    runner.runBatchStep.mockReset();
  });

  it("runs one batch step and returns latest progress", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    runner.runBatchStep.mockResolvedValueOnce({
      outcome: "processed",
      taskId: "task-1",
      jobId: "job-1",
      taskStatus: "SUCCEEDED",
      batchStatus: "RUNNING",
      progress: {
        pending: 3,
        running: 0,
        succeeded: 1,
        failed: 0,
        skipped: 0,
      },
    });

    const res = await POST(
      new Request(`http://localhost/api/application-batches/${BATCH_ID}/trigger`, {
        method: "POST",
      }),
      { params: Promise.resolve({ id: BATCH_ID }) },
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.outcome).toBe("processed");
    expect(json.taskStatus).toBe("SUCCEEDED");
    expect(json.progress.pending).toBe(3);
  });
});
