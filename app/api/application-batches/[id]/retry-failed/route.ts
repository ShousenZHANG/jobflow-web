import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { BatchRunnerError, createRetryBatchFromFailed } from "@/lib/server/applicationBatches/runner";

export const runtime = "nodejs";

const ParamsSchema = z.object({
  id: z.string().uuid(),
});

const BodySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).optional(),
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

  try {
    const result = await createRetryBatchFromFailed({
      userId,
      sourceBatchId: parsedParams.data.id,
      limit: parsedBody.data.limit,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof BatchRunnerError && error.code === "NOT_FOUND") {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    if (error instanceof BatchRunnerError && error.code === "INVALID_STATE") {
      return NextResponse.json({ error: "INVALID_STATE", message: error.message }, { status: 409 });
    }
    throw error;
  }
}
