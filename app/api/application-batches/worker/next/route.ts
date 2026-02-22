import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApplicationBatchWorkerSecret } from "@/lib/server/applicationBatches/auth";
import { runNextAvailableBatchStep } from "@/lib/server/applicationBatches/runner";

export const runtime = "nodejs";

const BodySchema = z.object({
  maxSteps: z.coerce.number().int().min(1).max(20).optional(),
});

export async function POST(req: Request) {
  if (!requireApplicationBatchWorkerSecret(req)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(json ?? {});
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const maxSteps = parsed.data.maxSteps ?? 1;
  let lastResult: Awaited<ReturnType<typeof runNextAvailableBatchStep>> = { outcome: "idle" };

  for (let index = 0; index < maxSteps; index += 1) {
    const step = await runNextAvailableBatchStep();
    lastResult = step;
    if (step.outcome !== "processed") break;
  }

  return NextResponse.json(lastResult, { status: 200 });
}
