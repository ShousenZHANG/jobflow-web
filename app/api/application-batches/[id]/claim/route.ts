import { NextResponse } from "next/server";
import { z } from "zod";
import { claimNextBatchTask } from "@/lib/server/applicationBatches/runner";
import { requireSession, UnauthorizedError } from "@/lib/server/auth/requireSession";
import type { SessionContext } from "@/lib/server/auth/requireSession";
import { unauthorizedError } from "@/lib/server/api/errorResponse";

export const runtime = "nodejs";

const ParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  let session: SessionContext;
  try {
    session = await requireSession();
  } catch (err) {
    if (err instanceof UnauthorizedError) return unauthorizedError();
    throw err;
  }
  const { userId } = session;

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
