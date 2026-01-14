import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const ParamsSchema = z.object({ id: z.string().uuid() });
const BodySchema = z.object({
  status: z.enum(["QUEUED", "RUNNING", "SUCCEEDED", "FAILED"]).optional(),
  importedCount: z.number().int().min(0).optional(),
  error: z.string().optional().nullable(),
});

function requireSecret(req: Request) {
  const expected = process.env.FETCH_RUN_SECRET;
  if (!expected) throw new Error("FETCH_RUN_SECRET is not set");
  const got = req.headers.get("x-fetch-run-secret");
  return got === expected;
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!requireSecret(req)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

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

  const updated = await prisma.fetchRun.updateMany({
    where: { id: parsedParams.data.id },
    data: {
      ...(parsedBody.data.status ? { status: parsedBody.data.status } : {}),
      ...(parsedBody.data.importedCount !== undefined
        ? { importedCount: parsedBody.data.importedCount }
        : {}),
      ...(parsedBody.data.error !== undefined ? { error: parsedBody.data.error ?? null } : {}),
    },
  });

  if (updated.count === 0) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

