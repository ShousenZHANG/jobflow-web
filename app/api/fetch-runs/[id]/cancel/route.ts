import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const ParamsSchema = z.object({ id: z.string().uuid() });

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = await ctx.params;
  const parsed = ParamsSchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });

  const run = await prisma.fetchRun.findFirst({
    where: { id: parsed.data.id, userId },
    select: { id: true, status: true },
  });
  if (!run) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  if (run.status === "SUCCEEDED" || run.status === "FAILED") {
    return NextResponse.json({ error: "ALREADY_FINISHED", status: run.status }, { status: 409 });
  }

  await prisma.fetchRun.update({
    where: { id: run.id },
    data: { status: "FAILED", error: "Cancelled by user" },
  });

  return NextResponse.json({ ok: true });
}
