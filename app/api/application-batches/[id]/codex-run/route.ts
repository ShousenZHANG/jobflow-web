import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { requireSession, UnauthorizedError } from "@/lib/server/auth/requireSession";
import type { SessionContext } from "@/lib/server/auth/requireSession";
import { unauthorizedError } from "@/lib/server/api/errorResponse";
import { getBatchProgress } from "@/lib/server/applicationBatches/runner";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import {
  buildBatchRunContext,
  claimBatchRunTasks,
  deriveBatchStatusFromRun,
} from "@/lib/server/applicationBatches/codexRunContext";

export const runtime = "nodejs";

const ParamsSchema = z.object({
  id: z.string().uuid(),
});

const BodySchema = z.object({
  maxSteps: z.coerce.number().int().min(1).max(20).optional().default(1),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  let session: SessionContext;
  try {
    session = await requireSession();
  } catch (err) {
    if (err instanceof UnauthorizedError) return unauthorizedError();
    throw err;
  }
  const { userId } = session;

  const parsedParams = ParamsSchema.safeParse(await ctx.params);
  if (!parsedParams.success) return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });

  const json = await req.json().catch(() => ({}));
  const parsedBody = BodySchema.safeParse(json ?? {});
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  const batch = await prisma.applicationBatch.findFirst({
    where: {
      id: parsedParams.data.id,
      userId,
    },
    select: {
      id: true,
      scope: true,
      status: true,
      totalCount: true,
      error: true,
    },
  });
  if (!batch) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const profile = await getResumeProfile(userId);
  if (!profile) {
    return NextResponse.json(
      {
        error: "NO_PROFILE",
        message: "Create and save your master resume before running codex batch.",
      },
      { status: 404 },
    );
  }

  const maxSteps = parsedBody.data.maxSteps;
  const runContext = await buildBatchRunContext({ userId, profile });
  const claimed = await claimBatchRunTasks({
    userId,
    batchId: batch.id,
    batchStatus: batch.status,
    maxSteps,
  });

  if (claimed.kind === "not_found") {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const progress = await getBatchProgress({
    userId,
    batchId: batch.id,
  });

  const batchStatus = deriveBatchStatusFromRun({
    initialBatchStatus: batch.status,
    progress,
    claimedCount: claimed.tasks.length,
    stopReason: claimed.stopReason,
    claimedDoneStatus: claimed.doneStatus,
    terminalStatus: claimed.terminalStatus,
  });

  return NextResponse.json({
    batch: {
      id: batch.id,
      scope: batch.scope,
      status: batchStatus,
      totalCount: batch.totalCount,
      error: batch.error,
    },
    progress,
    context: runContext,
    tasks: claimed.tasks,
    execution: {
      requestedMaxSteps: maxSteps,
      claimedCount: claimed.tasks.length,
      stopReason: claimed.stopReason,
    },
  });
}
