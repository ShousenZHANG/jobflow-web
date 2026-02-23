import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

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

