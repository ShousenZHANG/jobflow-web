import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export const runtime = "nodejs";

const ParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  void req;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = await ctx.params;
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
