import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { Prisma } from "@/lib/generated/prisma";
import {
  createResumeProfile,
  deleteResumeProfile,
  getResumeProfile,
  listResumeProfiles,
  renameResumeProfile,
  setActiveResumeProfile,
  upsertResumeProfile,
} from "@/lib/server/resumeProfile";

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

const ResumeProfileUpsertSchema = ResumeProfileSchema.extend({
  profileId: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(80).optional(),
  setActive: z.boolean().optional(),
});

const ResumeProfilePatchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create"),
    name: z.string().trim().min(1).max(80).optional(),
    mode: z.enum(["copy", "blank"]).optional(),
    sourceProfileId: z.string().uuid().optional(),
  }),
  z.object({
    action: z.literal("activate"),
    profileId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("rename"),
    profileId: z.string().uuid(),
    name: z.string().trim().min(1).max(80),
  }),
  z.object({
    action: z.literal("delete"),
    profileId: z.string().uuid(),
  }),
]);

async function getAuthorizedUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

async function buildResumeProfileResponse(userId: string) {
  const { profiles, activeProfileId } = await listResumeProfiles(userId);
  const activeProfile = activeProfileId
    ? await getResumeProfile(userId, { profileId: activeProfileId })
    : null;

  return {
    profiles,
    activeProfileId,
    activeProfile,
    profile: activeProfile,
  };
}

function parsePrismaError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  if (error.code === "P2002" && String(error.meta?.target ?? "").includes("userId")) {
    return NextResponse.json(
      {
        error: "MIGRATION_REQUIRED",
        message:
          "Database schema is outdated. Run `npx prisma migrate deploy` to remove ResumeProfile.userId uniqueness.",
      },
      { status: 409 },
    );
  }

  return null;
}

export async function GET() {
  const userId = await getAuthorizedUserId();
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const state = await buildResumeProfileResponse(userId);
  return NextResponse.json(state, { status: 200 });
}

export async function POST(req: Request) {
  const userId = await getAuthorizedUserId();
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = ResumeProfileUpsertSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let profile;
  try {
    profile = await upsertResumeProfile(
      userId,
      {
        summary: parsed.data.summary,
        basics: parsed.data.basics,
        links: parsed.data.links,
        skills: parsed.data.skills,
        experiences: parsed.data.experiences,
        projects: parsed.data.projects,
        education: parsed.data.education,
      },
      {
        profileId: parsed.data.profileId,
        name: parsed.data.name,
        setActive: parsed.data.setActive,
      },
    );
  } catch (error) {
    const prismaErrorResponse = parsePrismaError(error);
    if (prismaErrorResponse) return prismaErrorResponse;
    throw error;
  }

  if (!profile) {
    return NextResponse.json({ error: "PROFILE_NOT_FOUND" }, { status: 404 });
  }

  const state = await buildResumeProfileResponse(userId);
  return NextResponse.json(state, { status: 200 });
}

export async function PATCH(req: Request) {
  const userId = await getAuthorizedUserId();
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = ResumeProfilePatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (parsed.data.action === "create") {
    try {
      await createResumeProfile(userId, {
        name: parsed.data.name,
        setActive: true,
        mode: parsed.data.mode,
        sourceProfileId: parsed.data.sourceProfileId,
      });
    } catch (error) {
      const prismaErrorResponse = parsePrismaError(error);
      if (prismaErrorResponse) return prismaErrorResponse;
      throw error;
    }
  }

  if (parsed.data.action === "activate") {
    const target = await setActiveResumeProfile(userId, parsed.data.profileId);
    if (!target) {
      return NextResponse.json({ error: "PROFILE_NOT_FOUND" }, { status: 404 });
    }
  }

  if (parsed.data.action === "rename") {
    const target = await renameResumeProfile(userId, parsed.data.profileId, parsed.data.name);
    if (!target) {
      return NextResponse.json({ error: "PROFILE_NOT_FOUND" }, { status: 404 });
    }
  }

  if (parsed.data.action === "delete") {
    const result = await deleteResumeProfile(userId, parsed.data.profileId);
    if (result.status === "not_found") {
      return NextResponse.json({ error: "PROFILE_NOT_FOUND" }, { status: 404 });
    }
    if (result.status === "last_profile") {
      return NextResponse.json(
        { error: "LAST_PROFILE", message: "At least one resume version is required." },
        { status: 409 },
      );
    }
  }

  const state = await buildResumeProfileResponse(userId);
  return NextResponse.json(state, { status: 200 });
}
