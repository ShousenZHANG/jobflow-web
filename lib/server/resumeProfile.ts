import { prisma } from "@/lib/server/prisma";
import { Prisma } from "@/lib/generated/prisma";

const DEFAULT_PROFILE_BASE_NAME = "Custom Blank";
const MAX_PROFILE_NAME_LENGTH = 80;

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

export type ResumeProfileSummary = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  revision: number;
  isActive: boolean;
};

function toJsonValue<T>(value: T | null | undefined) {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.DbNull;
  return value;
}

function toNormalizedWriteData(data: ResumeProfileInput) {
  return {
    summary: data.summary === undefined ? undefined : data.summary,
    basics: toJsonValue(data.basics),
    links: toJsonValue(data.links),
    skills: toJsonValue(data.skills),
    experiences: toJsonValue(data.experiences),
    projects: toJsonValue(data.projects),
    education: toJsonValue(data.education),
  } satisfies Prisma.ResumeProfileUpdateInput;
}

function normalizeProfileName(name?: string | null) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return DEFAULT_PROFILE_BASE_NAME;
  if (trimmed.length <= MAX_PROFILE_NAME_LENGTH) return trimmed;
  return trimmed.slice(0, MAX_PROFILE_NAME_LENGTH);
}

async function ensureActivePointer(userId: string, resumeProfileId: string) {
  await prisma.activeResumeProfile.upsert({
    where: { userId },
    update: { resumeProfileId },
    create: { userId, resumeProfileId },
  });
}

async function getFallbackLatestProfile(userId: string) {
  const latest = await prisma.resumeProfile.findFirst({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
  if (latest) {
    await ensureActivePointer(userId, latest.id);
  }
  return latest;
}

async function getTargetProfile(userId: string, profileId?: string) {
  if (!profileId) return null;
  return prisma.resumeProfile.findFirst({
    where: { id: profileId, userId },
  });
}

export async function listResumeProfiles(userId: string) {
  const [profiles, activePointer] = await prisma.$transaction([
    prisma.resumeProfile.findMany({
      where: { userId },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        revision: true,
      },
    }),
    prisma.activeResumeProfile.findUnique({
      where: { userId },
      select: { resumeProfileId: true },
    }),
  ]);

  let activeProfileId = activePointer?.resumeProfileId ?? null;
  if (!activeProfileId && profiles[0]) {
    activeProfileId = profiles[0].id;
    await ensureActivePointer(userId, profiles[0].id);
  }

  return {
    activeProfileId,
    profiles: profiles.map((profile) => ({
      ...profile,
      isActive: profile.id === activeProfileId,
    })) satisfies ResumeProfileSummary[],
  };
}

export async function getResumeProfile(userId: string, options?: { profileId?: string }) {
  const explicitProfileId = options?.profileId;
  if (explicitProfileId) {
    return getTargetProfile(userId, explicitProfileId);
  }

  const activePointer = await prisma.activeResumeProfile.findUnique({
    where: { userId },
    select: { resumeProfileId: true },
  });

  if (activePointer?.resumeProfileId) {
    const active = await prisma.resumeProfile.findFirst({
      where: {
        id: activePointer.resumeProfileId,
        userId,
      },
    });
    if (active) return active;
  }

  return getFallbackLatestProfile(userId);
}

export async function setActiveResumeProfile(userId: string, profileId: string) {
  const target = await getTargetProfile(userId, profileId);
  if (!target) return null;
  await ensureActivePointer(userId, target.id);
  return target;
}

async function buildDefaultProfileName(userId: string) {
  const existing = await prisma.resumeProfile.findMany({
    where: { userId },
    select: { name: true },
  });

  const usedNames = new Set(existing.map((item) => item.name.trim().toLowerCase()));
  if (!usedNames.has(DEFAULT_PROFILE_BASE_NAME.toLowerCase())) {
    return DEFAULT_PROFILE_BASE_NAME;
  }

  let suffix = 2;
  while (usedNames.has(`${DEFAULT_PROFILE_BASE_NAME} ${suffix}`.toLowerCase())) {
    suffix += 1;
  }
  return `${DEFAULT_PROFILE_BASE_NAME} ${suffix}`;
}

export async function createResumeProfile(userId: string, options?: { name?: string; setActive?: boolean }) {
  const resolvedName = options?.name ? normalizeProfileName(options.name) : await buildDefaultProfileName(userId);

  const profile = await prisma.resumeProfile.create({
    data: {
      userId,
      name: resolvedName,
    },
  });

  if (options?.setActive !== false) {
    await ensureActivePointer(userId, profile.id);
  }

  return profile;
}

export async function renameResumeProfile(userId: string, profileId: string, name: string) {
  const target = await getTargetProfile(userId, profileId);
  if (!target) return null;

  return prisma.resumeProfile.update({
    where: { id: target.id },
    data: {
      name: normalizeProfileName(name),
    },
  });
}

export async function upsertResumeProfile(
  userId: string,
  data: ResumeProfileInput,
  options?: {
    profileId?: string;
    name?: string;
    setActive?: boolean;
  },
) {
  const normalized = toNormalizedWriteData(data);
  const explicitProfileId = options?.profileId;

  const target = explicitProfileId
    ? await getTargetProfile(userId, explicitProfileId)
    : await getResumeProfile(userId);

  if (explicitProfileId && !target) {
    return null;
  }

  if (!target) {
    const created = await prisma.resumeProfile.create({
      data: {
        userId,
        name: normalizeProfileName(options?.name),
        ...normalized,
      },
    });

    if (options?.setActive !== false) {
      await ensureActivePointer(userId, created.id);
    }

    return created;
  }

  const updated = await prisma.resumeProfile.update({
    where: { id: target.id },
    data: {
      ...normalized,
      ...(options?.name === undefined ? {} : { name: normalizeProfileName(options.name) }),
      revision: {
        increment: 1,
      },
    },
  });

  if (options?.setActive !== false) {
    await ensureActivePointer(userId, updated.id);
  }

  return updated;
}
