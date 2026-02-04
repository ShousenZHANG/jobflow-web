import { prisma } from "@/lib/server/prisma";
import { Prisma } from "@/lib/generated/prisma";

export type ResumeProfileInput = {
  summary?: string | null;
  basics?: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location?: string | null;
  } | null;
  links?: {
    label: string;
    url: string;
  }[] | null;
  skills?: {
    category: string;
    items: string[];
  }[] | null;
  experiences?: {
    location: string;
    dates: string;
    title: string;
    company: string;
    bullets: string[];
  }[] | null;
  projects?: {
    name: string;
    location?: string | null;
    dates: string;
    stack?: string | null;
    links?: {
      label: string;
      url: string;
    }[] | null;
    bullets: string[];
  }[] | null;
  education?: {
    school: string;
    degree: string;
    location?: string | null;
    dates: string;
    details?: string | null;
  }[] | null;
};

export async function getResumeProfile(userId: string) {
  return prisma.resumeProfile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function upsertResumeProfile(
  userId: string,
  data: ResumeProfileInput,
) {
  const toJsonValue = <T>(value: T | null | undefined) => {
    if (value === undefined) return undefined;
    if (value === null) return Prisma.DbNull;
    return value;
  };

  const normalized = {
    summary: data.summary === undefined ? undefined : data.summary,
    basics: toJsonValue(data.basics),
    links: toJsonValue(data.links),
    skills: toJsonValue(data.skills),
    experiences: toJsonValue(data.experiences),
    projects: toJsonValue(data.projects),
    education: toJsonValue(data.education),
  };

  const existing = await prisma.resumeProfile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
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
