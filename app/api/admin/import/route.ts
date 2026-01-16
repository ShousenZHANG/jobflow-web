import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const BodySchema = z.object({
  userEmail: z.string().email(),
  items: z
    .array(
      z
        .object({
          // Accept both python style and web style field names
          job_url: z.string().url().optional(),
          jobUrl: z.string().url().optional(),
          title: z.string().min(1),
          company: z.string().optional().nullable(),
          location: z.string().optional().nullable(),
          job_type: z.string().optional().nullable(),
          jobType: z.string().optional().nullable(),
          job_level: z.string().optional().nullable(),
          jobLevel: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
        })
        .passthrough(),
    )
    .default([]),
});

function requireImportSecret(req: Request) {
  const expected = process.env.IMPORT_SECRET;
  if (!expected) {
    throw new Error("IMPORT_SECRET is not set");
  }
  const got = req.headers.get("x-import-secret");
  return got === expected;
}

export async function POST(req: Request) {
  if (!requireImportSecret(req)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const email = parsed.data.userEmail.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
  }

  const userId = user.id;

  const ops = parsed.data.items.map((it) => {
    const jobUrl = (it.jobUrl ?? it.job_url ?? "").trim();
    const jobType = it.jobType ?? it.job_type ?? null;
    const jobLevel = it.jobLevel ?? it.job_level ?? null;

    return prisma.job.upsert({
      where: { userId_jobUrl: { userId, jobUrl } },
      update: {
        title: it.title,
        company: it.company ?? null,
        location: it.location ?? null,
        jobType: jobType ?? null,
        jobLevel: jobLevel ?? null,
        description: it.description ?? null,
      },
      create: {
        userId,
        jobUrl,
        title: it.title,
        company: it.company ?? null,
        location: it.location ?? null,
        jobType: jobType ?? null,
        jobLevel: jobLevel ?? null,
        description: it.description ?? null,
        status: "NEW",
      },
      select: { id: true },
    });
  });

  // Batch to avoid huge transactions/timeouts
  const BATCH = 50;
  let written = 0;
  for (let i = 0; i < ops.length; i += BATCH) {
    const slice = ops.slice(i, i + BATCH);
    await prisma.$transaction(slice);
    written += slice.length;
  }

  return NextResponse.json({ ok: true, imported: written });
}

