import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession, UnauthorizedError } from "@/lib/server/auth/requireSession";
import type { SessionContext } from "@/lib/server/auth/requireSession";
import { unauthorizedError } from "@/lib/server/api/errorResponse";

export const runtime = "nodejs";

const ParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function POST(req: Request, routeCtx: { params: Promise<{ id: string }> }) {
  void req;
  let sessionCtx: SessionContext;
  try {
    sessionCtx = await requireSession();
  } catch (err) {
    if (err instanceof UnauthorizedError) return unauthorizedError();
    throw err;
  }
  void sessionCtx;

  const params = await routeCtx.params;
  const parsedParams = ParamsSchema.safeParse(params);
  if (!parsedParams.success) return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });
  return NextResponse.json(
    {
      error: "TRIGGER_DISABLED",
      message:
        "Automatic trigger execution is disabled. Use /codex-run and manual-generate flow from Codex.",
      batchId: parsedParams.data.id,
    },
    { status: 410 },
  );
}
