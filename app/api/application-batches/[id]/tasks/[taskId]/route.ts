import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { BatchRunnerError, completeBatchTask } from "@/lib/server/applicationBatches/runner";

export const runtime = "nodejs";

const ParamsSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
});

const BodySchema = z.object({
  status: z.enum(["SUCCEEDED", "FAILED", "SKIPPED"]),
  error: z.string().trim().max(500).optional().nullable(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string; taskId: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = await ctx.params;
  const parsedParams = ParamsSchema.safeParse(params);
  if (!parsedParams.success) return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });

  const json = await req.json().catch(() => null);
  const parsedBody = BodySchema.safeParse(json);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await completeBatchTask({
      userId,
      batchId: parsedParams.data.id,
      taskId: parsedParams.data.taskId,
      status: parsedBody.data.status,
      error: parsedBody.data.error,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof BatchRunnerError && error.code === "NOT_FOUND") {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    if (error instanceof BatchRunnerError && error.code === "INVALID_STATE") {
      return NextResponse.json({ error: "INVALID_STATE" }, { status: 409 });
    }
    throw error;
  }
}
