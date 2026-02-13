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

function canonicalizeJobUrl(raw: string) {
  const input = raw.trim();
  if (!input) return "";
  try {
    const parsed = new URL(input);
    const protocol = parsed.protocol.toLowerCase();
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const isDefaultPort =
      (protocol === "https:" && parsed.port === "443") ||
      (protocol === "http:" && parsed.port === "80");
    const host = parsed.port && !isDefaultPort ? `${hostname}:${parsed.port}` : hostname;
    let pathname = parsed.pathname || "/";
    if (pathname !== "/") pathname = pathname.replace(/\/+$/, "") || "/";
    return `${protocol}//${host}${pathname}`;
  } catch {
    return input;
  }
}

export async function POST(req: Request) {
  try {
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

    const invalid: Array<{ reason: string }> = [];
    const normalizedRaw = parsed.data.items
      .map((it) => {
        const jobUrl = canonicalizeJobUrl(it.jobUrl ?? it.job_url ?? "");
        const title = it.title?.trim();
        if (!jobUrl) {
          invalid.push({ reason: "missing_job_url" });
          return null;
        }
        if (!title) {
          invalid.push({ reason: "missing_title" });
          return null;
        }
        return {
          jobUrl,
          title,
          company: it.company ?? null,
          location: it.location ?? null,
          jobType: it.jobType ?? it.job_type ?? null,
          jobLevel: it.jobLevel ?? it.job_level ?? null,
          description: it.description ?? null,
        };
      })
      .filter(Boolean) as Array<{
      jobUrl: string;
      title: string;
      company: string | null;
      location: string | null;
      jobType: string | null;
      jobLevel: string | null;
      description: string | null;
    }>;

    const deletedUrls = await prisma.deletedJobUrl.findMany({
      where: { userId },
      select: { jobUrl: true },
    });
    const deletedSet = new Set(deletedUrls.map((it) => canonicalizeJobUrl(it.jobUrl)));

    const seen = new Set<string>();
    const normalized = normalizedRaw.filter((it) => {
      if (seen.has(it.jobUrl)) return false;
      if (deletedSet.has(it.jobUrl)) return false;
      seen.add(it.jobUrl);
      return true;
    });

    if (normalized.length === 0) {
      return NextResponse.json({ ok: true, imported: 0, invalid: invalid.length });
    }

    // Concurrency-limited upsert to improve throughput without tx timeouts
    const CONCURRENCY = 5;
    let written = 0;
    let index = 0;

    async function worker() {
      while (index < normalized.length) {
        const current = normalized[index];
        index += 1;
        const existing = await prisma.job.findUnique({
          where: { userId_jobUrl: { userId, jobUrl: current.jobUrl } },
          select: { id: true },
        });
        if (existing) {
          continue;
        }
        await prisma.job.create({
          data: {
            userId,
            jobUrl: current.jobUrl,
            title: current.title,
            company: current.company,
            location: current.location,
            jobType: current.jobType,
            jobLevel: current.jobLevel,
            description: current.description,
            status: "NEW",
          },
          select: { id: true },
        });
        written += 1;
      }
    }

    const workers = Array.from({ length: CONCURRENCY }, () => worker());
    await Promise.all(workers);

    return NextResponse.json({ ok: true, imported: written, invalid: invalid.length });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "IMPORT_FAILED",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

