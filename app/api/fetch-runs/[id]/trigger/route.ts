import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const ParamsSchema = z.object({ id: z.string().uuid() });

function envOrThrow(key: string) {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is not set`);
  return v;
}

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = await ctx.params;
  const parsed = ParamsSchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });

  const run = await prisma.fetchRun.findFirst({
    where: { id: parsed.data.id, userId },
    select: { id: true, status: true },
  });
  if (!run) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  if (run.status !== "QUEUED") {
    return NextResponse.json({ error: "INVALID_STATE", status: run.status }, { status: 409 });
  }

  const owner = envOrThrow("GITHUB_OWNER");
  const repo = envOrThrow("GITHUB_REPO");
  const token = envOrThrow("GITHUB_TOKEN");
  const workflow = process.env.GITHUB_WORKFLOW_FILE || "jobspy-fetch.yml";
  const ref = process.env.GITHUB_REF || "master";

  const ghRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref,
        inputs: {
          runId: run.id,
        },
      }),
    },
  );

  if (!ghRes.ok) {
    const text = await ghRes.text().catch(() => "");
    return NextResponse.json(
      { error: "GITHUB_DISPATCH_FAILED", status: ghRes.status, details: text },
      { status: 502 },
    );
  }

  await prisma.fetchRun.update({
    where: { id: run.id },
    data: { status: "RUNNING" },
  });

  return NextResponse.json({ ok: true });
}

