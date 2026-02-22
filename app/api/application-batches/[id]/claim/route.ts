import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { claimNextBatchTask } from "@/lib/server/applicationBatches/runner";

export const runtime = "nodejs";

const ParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = await ctx.params;
  const parsed = ParamsSchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });

  const claimed = await claimNextBatchTask({
    userId,
    batchId: parsed.data.id,
  });

  if (claimed.kind === "not_found") {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(claimed, { status: 200 });
}
