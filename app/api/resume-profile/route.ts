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

const ResumeBasicsSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(3).max(40),
  location: z.string().trim().min(1).max(120).optional().nullable(),
});

const ResumeLinkSchema = z.object({
  label: z.string().trim().min(1).max(40),
  url: z.string().trim().url().max(300),
});

const ResumeProjectSchema = z.object({
  name: z.string().trim().min(1).max(140),
  location: z.string().trim().min(1).max(120).optional().nullable(),
  dates: z.string().trim().min(1).max(80),
  stack: z.string().trim().max(300).optional().nullable(),
  links: z.array(ResumeLinkSchema).max(4).optional().nullable(),
  bullets: z.array(z.string().trim().min(1).max(220)).max(12),
});

const ResumeEducationSchema = z.object({
  school: z.string().trim().min(1).max(140),
  degree: z.string().trim().min(1).max(140),
  location: z.string().trim().min(1).max(120).optional().nullable(),
  dates: z.string().trim().min(1).max(80),
  details: z.string().trim().max(200).optional().nullable(),
});

const ResumeSkillSchema = z.object({
  category: z.string().trim().min(1).max(60),
  items: z.array(z.string().trim().min(1).max(60)).max(30),
});

const ResumeProfileSchema = z.object({
  summary: z.string().trim().min(1).max(2000).optional().nullable(),
  basics: ResumeBasicsSchema.optional().nullable(),
  links: z.array(ResumeLinkSchema).max(8).optional().nullable(),
  skills: z.array(ResumeSkillSchema).max(12).optional().nullable(),
  experiences: z.array(ResumeExperienceSchema).max(20).optional().nullable(),
  projects: z.array(ResumeProjectSchema).max(20).optional().nullable(),
  education: z.array(ResumeEducationSchema).max(10).optional().nullable(),
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
