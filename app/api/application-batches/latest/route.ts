import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireSession, UnauthorizedError } from "@/lib/server/auth/requireSession";
import type { SessionContext } from "@/lib/server/auth/requireSession";
import { unauthorizedError } from "@/lib/server/api/errorResponse";

export const runtime = "nodejs";

export async function GET() {
  let ctx: SessionContext;
  try {
    ctx = await requireSession();
  } catch (err) {
    if (err instanceof UnauthorizedError) return unauthorizedError();
    throw err;
  }
  const { userId } = ctx;

  const batch = await prisma.applicationBatch.findFirst({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  });

  if (!batch) {
    return NextResponse.json({
      batchId: null,
      status: null,
      updatedAt: null,
    });
  }

  return NextResponse.json({
    batchId: batch.id,
    status: batch.status,
    updatedAt: batch.updatedAt.toISOString(),
  });
}

