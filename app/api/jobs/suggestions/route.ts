import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const QuerySchema = z.object({
  q: z.string().trim().min(1).max(80).optional(),
});

const FALLBACK_SUGGESTIONS = [
  "Software Engineer",
  "Software Developer",
  "Java Developer",
  "Full Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "Web Developer",
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "QA Engineer",
  "Automation Engineer",
  "Mobile Developer",
];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_QUERY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const q = parsed.data.q?.toLowerCase() ?? "";

  const recent = await prisma.job.findMany({
    where: {
      userId,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: { title: true },
    take: 80,
    orderBy: [{ createdAt: "desc" }],
  });

  const fromDb = recent
    .map((row) => row.title)
    .filter(Boolean)
    .map((title) => title.trim())
    .filter(Boolean);

  const combined = Array.from(
    new Set(
      [...fromDb, ...FALLBACK_SUGGESTIONS].filter((title) =>
        q ? title.toLowerCase().includes(q) : true,
      ),
    ),
  ).slice(0, 20);

  return NextResponse.json({ suggestions: combined });
}
