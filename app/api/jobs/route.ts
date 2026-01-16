import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().uuid().optional(),
  status: z.enum(["NEW", "APPLIED", "REJECTED"]).optional(),
  q: z.string().trim().min(1).max(80).optional(),
  location: z.string().trim().min(1).max(80).optional(),
  sort: z.enum(["newest", "oldest"]).optional().default("newest"),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
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

  const { limit, cursor, status, q, location, sort } = parsed.data;

  const orderBy =
    sort === "oldest"
      ? [{ createdAt: "asc" as const }, { id: "asc" as const }]
      : [{ createdAt: "desc" as const }, { id: "desc" as const }];

  const STATE_LOCATION_MAP = {
    NSW: ["NSW", "New South Wales", "Sydney", "Newcastle", "Wollongong"],
    VIC: ["VIC", "Victoria", "Melbourne", "Geelong"],
    QLD: ["QLD", "Queensland", "Brisbane", "Gold Coast", "Sunshine Coast"],
    WA: ["WA", "Western Australia", "Perth"],
    SA: ["SA", "South Australia", "Adelaide"],
    ACT: ["ACT", "Australian Capital Territory", "Canberra"],
    TAS: ["TAS", "Tasmania", "Hobart"],
    NT: ["NT", "Northern Territory", "Darwin"],
  } as const;
  type StateKey = keyof typeof STATE_LOCATION_MAP;
  const stateKey = location?.startsWith("state:")
    ? (location.replace("state:", "") as StateKey)
    : null;
  const locationFilters = stateKey ? STATE_LOCATION_MAP[stateKey] : null;

  const andClauses: any[] = [];
  if (q) {
    andClauses.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (location) {
    if (locationFilters && locationFilters.length) {
      andClauses.push({
        OR: locationFilters.map((loc) => ({
          location: { contains: loc, mode: "insensitive" },
        })),
      });
    } else {
      andClauses.push({ location: { contains: location, mode: "insensitive" } });
    }
  }

  const jobs = await prisma.job.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
      ...(andClauses.length ? { AND: andClauses } : {}),
    },
    orderBy,
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      jobUrl: true,
      title: true,
      company: true,
      location: true,
      jobType: true,
      jobLevel: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    items: jobs,
    nextCursor: jobs.length ? jobs[jobs.length - 1].id : null,
  });
}

const CreateSchema = z.object({
  jobUrl: z.string().url(),
  title: z.string().min(1),
  company: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  jobLevel: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) {
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

  const created = await prisma.job.upsert({
    where: { userId_jobUrl: { userId, jobUrl: parsed.data.jobUrl } },
    update: {
      title: parsed.data.title,
      company: parsed.data.company ?? null,
      location: parsed.data.location ?? null,
      jobType: parsed.data.jobType ?? null,
      jobLevel: parsed.data.jobLevel ?? null,
      description: parsed.data.description ?? null,
    },
    create: {
      userId,
      jobUrl: parsed.data.jobUrl,
      title: parsed.data.title,
      company: parsed.data.company ?? null,
      location: parsed.data.location ?? null,
      jobType: parsed.data.jobType ?? null,
      jobLevel: parsed.data.jobLevel ?? null,
      description: parsed.data.description ?? null,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}

