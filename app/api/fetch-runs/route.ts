import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const TitleExcludeEnum = z.enum([
  "senior",
  "lead",
  "principal",
  "staff",
  "manager",
  "director",
  "head",
  "architect",
]);

const DescExcludeEnum = z.enum([
  "work_rights",
  "security_clearance",
  "no_sponsorship",
  "exp_3",
  "exp_4",
  "exp_5",
  "exp_7",
]);

const CreateSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    queries: z
      .union([z.array(z.string().min(1)), z.string().min(1)])
      .optional()
      .transform((v) => {
        if (!v) return [];
        if (typeof v === "string") {
          // allow "a, b | c" style input
          return v
            .split("|")
            .flatMap((chunk) => chunk.split(","))
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return v.map((s) => s.trim()).filter(Boolean);
      }),
    location: z.string().trim().min(1).optional(),
    hoursOld: z.coerce.number().int().min(1).max(24 * 30).optional(),
    resultsWanted: z.coerce.number().int().min(1).max(500).optional(),
    applyExcludes: z.coerce.boolean().optional().default(true),
    excludeTitleTerms: z.array(TitleExcludeEnum).optional().default([]),
    excludeDescriptionRules: z.array(DescExcludeEnum).optional().default([]),
  })
  .refine((data) => (data.title ?? data.queries?.[0])?.trim(), {
    message: "title is required",
    path: ["title"],
  });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const userEmail = session?.user?.email ?? null;
  if (!userId || !userEmail) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const title = parsed.data.title ?? parsed.data.queries?.[0] ?? "";
  const queries = parsed.data.queries?.length ? parsed.data.queries : title ? [title] : [];

  const run = await prisma.fetchRun.create({
    data: {
      userId,
      userEmail: userEmail.toLowerCase(),
      status: "QUEUED",
      importedCount: 0,
      queries: {
        title,
        queries,
        applyExcludes: parsed.data.applyExcludes,
        excludeTitleTerms: parsed.data.excludeTitleTerms,
        excludeDescriptionRules: parsed.data.excludeDescriptionRules,
      },
      location: parsed.data.location ?? null,
      hoursOld: parsed.data.hoursOld ?? null,
      resultsWanted: parsed.data.resultsWanted ?? null,
      includeFromQueries: false,
      filterDescription: parsed.data.applyExcludes,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: run.id }, { status: 201 });
}

