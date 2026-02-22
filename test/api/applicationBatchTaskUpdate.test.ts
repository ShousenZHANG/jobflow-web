import { beforeEach, describe, expect, it, vi } from "vitest";

const runner = vi.hoisted(() => ({
  completeBatchTask: vi.fn(),
}));

vi.mock("@/lib/server/applicationBatches/runner", () => runner);

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { PATCH } from "@/app/api/application-batches/[id]/tasks/[taskId]/route";

const BATCH_ID = "550e8400-e29b-41d4-a716-446655440000";
const TASK_ID = "660e8400-e29b-41d4-a716-446655440000";

describe("application batch task update api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    runner.completeBatchTask.mockReset();
  });

  it("updates task to succeeded and returns aggregated progress", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    runner.completeBatchTask.mockResolvedValueOnce({
      taskStatus: "SUCCEEDED",
      batchStatus: "RUNNING",
      progress: {
        pending: 2,
        running: 0,
        succeeded: 3,
        failed: 0,
        skipped: 0,
      },
    });

    const res = await PATCH(
      new Request(`http://localhost/api/application-batches/${BATCH_ID}/tasks/${TASK_ID}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "SUCCEEDED" }),
      }),
      { params: Promise.resolve({ id: BATCH_ID, taskId: TASK_ID }) },
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.batchStatus).toBe("RUNNING");
    expect(json.progress.succeeded).toBe(3);
  });
});
