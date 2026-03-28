import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireSession, UnauthorizedError } from "@/lib/server/auth/requireSession";
import type { SessionContext } from "@/lib/server/auth/requireSession";
import { unauthorizedError } from "@/lib/server/api/errorResponse";

export const runtime = "nodejs";

function taskProgressFromGroupBy(
  rows: Array<{ status: string; _count: { _all: number } }>,
) {
  const counts = {
    pending: 0,
    running: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
  };

  for (const row of rows) {
    if (row.status === "PENDING") counts.pending = row._count._all;
    if (row.status === "RUNNING") counts.running = row._count._all;
    if (row.status === "SUCCEEDED") counts.succeeded = row._count._all;
    if (row.status === "FAILED") counts.failed = row._count._all;
    if (row.status === "SKIPPED") counts.skipped = row._count._all;
  }

  return counts;
}

export async function GET(
  _req: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  let ctx: SessionContext;
  try {
    ctx = await requireSession();
  } catch (err) {
    if (err instanceof UnauthorizedError) return unauthorizedError();
    throw err;
  }
  const { userId } = ctx;

  const { id } = await context.params;

  const batch = await prisma.applicationBatch.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
      scope: true,
      status: true,
      totalCount: true,
      error: true,
      createdAt: true,
      updatedAt: true,
      startedAt: true,
      completedAt: true,
    },
  });

  if (!batch) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const grouped = await prisma.applicationBatchTask.groupBy({
    by: ["status"],
    where: {
      batchId: id,
      userId,
    },
    _count: {
      _all: true,
    },
  });

  const nextTask = await prisma.applicationBatchTask.findFirst({
    where: {
      batchId: id,
      userId,
      status: "PENDING",
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      jobId: true,
      job: {
        select: {
          title: true,
          company: true,
          jobUrl: true,
        },
      },
    },
  });

  const progress = taskProgressFromGroupBy(grouped);

  return NextResponse.json({
    batch,
    progress,
    nextTask: nextTask
      ? {
          id: nextTask.id,
          jobId: nextTask.jobId,
          jobTitle: nextTask.job.title,
          company: nextTask.job.company,
          jobUrl: nextTask.job.jobUrl,
        }
      : null,
  });
}
