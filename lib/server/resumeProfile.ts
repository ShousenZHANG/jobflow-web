import { prisma } from "@/lib/server/prisma";
import { Prisma } from "@/lib/generated/prisma";

export type ResumeProfileInput = {
  summary?: string | null;
  skills?: string[] | null;
  experiences?: {
    location: string;
    dates: string;
    title: string;
    company: string;
    bullets: string[];
  }[] | null;
};

export async function getResumeProfile(userId: string) {
  return prisma.resumeProfile.findFirst({
    where: { userId },
  });
}

export async function upsertResumeProfile(
  userId: string,
  data: ResumeProfileInput,
) {
  const toJsonValue = (
    value: ResumeProfileInput["skills"] | ResumeProfileInput["experiences"],
  ) => {
    if (value === undefined) return undefined;
    if (value === null) return Prisma.DbNull;
    return value;
  };

  const normalized = {
    summary: data.summary === undefined ? undefined : data.summary,
    skills: toJsonValue(data.skills),
    experiences: toJsonValue(data.experiences),
  };

  const existing = await prisma.resumeProfile.findFirst({
    where: { userId },
  });

  if (existing) {
    return prisma.resumeProfile.update({
      where: { id: existing.id },
      data: normalized,
    });
  }

  return prisma.resumeProfile.create({
    data: {
      userId,
      ...normalized,
    },
  });
}
