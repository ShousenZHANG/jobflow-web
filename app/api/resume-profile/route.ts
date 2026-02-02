import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getResumeProfile, upsertResumeProfile } from "@/lib/server/resumeProfile";

export const runtime = "nodejs";

const ResumeExperienceSchema = z.object({
  location: z.string().trim().min(1).max(120),
  dates: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(120),
  bullets: z.array(z.string().trim().min(1).max(220)).max(12),
});

const ResumeProfileSchema = z.object({
  summary: z.string().trim().min(1).max(2000).optional().nullable(),
  skills: z.array(z.string().trim().min(1).max(60)).max(50).optional().nullable(),
  experiences: z.array(ResumeExperienceSchema).max(20).optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const profile = await getResumeProfile(userId);
  return NextResponse.json({ profile }, { status: 200 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = ResumeProfileSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const profile = await upsertResumeProfile(userId, parsed.data);
  return NextResponse.json({ profile }, { status: 200 });
}
