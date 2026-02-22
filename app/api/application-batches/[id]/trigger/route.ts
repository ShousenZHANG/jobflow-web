import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { runBatchStep } from "@/lib/server/applicationBatches/runner";

export const runtime = "nodejs";

const ParamsSchema = z.object({
  id: z.string().uuid(),
});

const BodySchema = z
  .object({
    maxSteps: z.coerce.number().int().min(1).max(20).optional().default(1),
  });

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = await ctx.params;
  const parsedParams = ParamsSchema.safeParse(params);
  if (!parsedParams.success) return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });

  const json = await req.json().catch(() => ({}));
  const parsedBody = BodySchema.safeParse(json ?? {});
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  let lastResult: Awaited<ReturnType<typeof runBatchStep>> | null = null;
  for (let index = 0; index < parsedBody.data.maxSteps; index += 1) {
    const result = await runBatchStep({
      userId,
      batchId: parsedParams.data.id,
    });
    lastResult = result;
    if (result.outcome !== "processed") break;
  }

  if (!lastResult) {
    return NextResponse.json({ error: "NO_STEP_EXECUTED" }, { status: 400 });
  }

  if (lastResult.outcome === "not_found") {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(lastResult, { status: 200 });
}
