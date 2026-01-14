import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const CreateSchema = z.object({
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
  includeFromQueries: z.coerce.boolean().optional().default(false),
  filterDescription: z.coerce.boolean().optional().default(true),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
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

  const run = await prisma.fetchRun.create({
    data: {
      userId,
      userEmail: userEmail.toLowerCase(),
      status: "QUEUED",
      importedCount: 0,
      queries: parsed.data.queries,
      location: parsed.data.location ?? null,
      hoursOld: parsed.data.hoursOld ?? null,
      resultsWanted: parsed.data.resultsWanted ?? null,
      includeFromQueries: parsed.data.includeFromQueries,
      filterDescription: parsed.data.filterDescription,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: run.id }, { status: 201 });
}

