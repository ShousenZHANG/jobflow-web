import { prisma } from "@/lib/server/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { computeMatchScore, type ScoreInput, type ScoreResult } from "@/lib/shared/matchScore";
import { getResumeProfile } from "@/lib/server/resumeProfile";

// Server-side orchestrator for the keyword match-scoring pipeline.
//
// Responsibilities:
//   - Fetch the user's active ResumeProfile for each market encountered
//     (market → locale: "AU" → "en-AU", "CN" → "zh-CN").
//   - For each eligible Job, run the pure `computeMatchScore` and persist
//     the score + breakdown back to the Job row.
//   - Support "only stale" mode to keep rescoring cheap after a single
//     profile edit (we don't re-score jobs already scored against the
//     current profile revision).
//
// Safety:
//   - Fully user-scoped — every query filters by userId.
//   - Never fetches or mutates jobs belonging to other users.

const MARKET_TO_LOCALE: Record<string, string> = {
  AU: "en-AU",
  CN: "zh-CN",
};

function inferLocale(market: string | null | undefined): string {
  if (!market) return "en-AU";
  return MARKET_TO_LOCALE[market] ?? "en-AU";
}

export interface RescoreOptions {
  /**
   * When true, only jobs with matchScore == null OR
   * scoredProfileVersion != current profile revision are rescored.
   * Default: true (cheap path).
   */
  onlyStale?: boolean;
  /**
   * Cap on the number of jobs processed per invocation. Protects against
   * runaway work if a user has tens of thousands of jobs.
   */
  limit?: number;
}

export interface RescoreResult {
  scored: number;
  skipped: number;
  skippedReason?: "NO_PROFILE" | "NO_JOBS";
}

type ProfileShape = ScoreInput["profile"];

function toProfileShape(profile: {
  skills?: unknown;
  experiences?: unknown;
  projects?: unknown;
}): ProfileShape {
  return {
    skills: Array.isArray(profile.skills)
      ? (profile.skills as ProfileShape["skills"]).filter(
          (s) => s && Array.isArray(s.items),
        )
      : [],
    experiences: Array.isArray(profile.experiences)
      ? (profile.experiences as ProfileShape["experiences"]).filter(
          (e) => e && Array.isArray(e.bullets),
        )
      : [],
    projects: Array.isArray(profile.projects)
      ? (profile.projects as ProfileShape["projects"]).filter(
          (p) => p && Array.isArray(p.bullets),
        )
      : [],
  };
}

interface ProfileForScoring {
  profile: ProfileShape;
  revision: number;
}

async function loadProfileByMarket(
  userId: string,
  market: string,
): Promise<ProfileForScoring | null> {
  const locale = inferLocale(market);
  const record = await getResumeProfile(userId, { locale });
  if (!record) return null;
  return {
    profile: toProfileShape({
      skills: record.skills,
      experiences: record.experiences,
      projects: record.projects,
    }),
    revision: typeof record.revision === "number" ? record.revision : 1,
  };
}

function buildMatchBreakdown(result: ScoreResult): Prisma.InputJsonValue {
  return {
    tier: result.tier,
    matchedSkills: [...result.matchedSkills],
    missingSkills: [...result.missingSkills],
    breakdown: { ...result.breakdown },
  };
}

/**
 * Rescore a batch of the user's jobs. Returns counts of processed rows.
 * Callers: /api/jobs/rescore (manual), ResumeContext.handleSave,
 * /api/admin/import (per-job).
 */
export async function rescoreUserJobs(
  userId: string,
  options: RescoreOptions = {},
): Promise<RescoreResult> {
  const onlyStale = options.onlyStale ?? true;
  const limit = options.limit ?? 500;

  // Cache one profile per market so we only hit the DB twice in the
  // mixed-market case (AU + CN).
  const profileCache = new Map<string, ProfileForScoring | null>();

  // We fetch all jobs first, then filter in-memory by onlyStale using the
  // profile revision — a single SQL query is cheaper than running a join
  // per market.
  const jobs = await prisma.job.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      description: true,
      jobLevel: true,
      market: true,
      matchScore: true,
      scoredProfileVersion: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  if (jobs.length === 0) {
    return { scored: 0, skipped: 0, skippedReason: "NO_JOBS" };
  }

  let scored = 0;
  let skipped = 0;
  let anyProfileFound = false;

  for (const job of jobs) {
    const market = job.market ?? "AU";
    if (!profileCache.has(market)) {
      profileCache.set(market, await loadProfileByMarket(userId, market));
    }
    const profileEntry = profileCache.get(market) ?? null;
    if (!profileEntry) {
      skipped++;
      continue;
    }
    anyProfileFound = true;

    if (
      onlyStale &&
      job.matchScore !== null &&
      job.scoredProfileVersion === profileEntry.revision
    ) {
      skipped++;
      continue;
    }

    const result = computeMatchScore({
      title: job.title,
      description: job.description ?? "",
      jobLevel: job.jobLevel,
      profile: profileEntry.profile,
    });

    await prisma.job.update({
      where: { id: job.id },
      data: {
        matchScore: result.score,
        matchBreakdown: buildMatchBreakdown(result),
        scoredAt: new Date(),
        scoredProfileVersion: profileEntry.revision,
      },
    });
    scored++;
  }

  if (!anyProfileFound) {
    return { scored: 0, skipped, skippedReason: "NO_PROFILE" };
  }

  return { scored, skipped };
}

/**
 * Score a single newly-imported job. Called from /api/admin/import after
 * each insert. Silent no-op when the user has no profile yet.
 */
export async function scoreSingleJob(
  userId: string,
  jobId: string,
): Promise<void> {
  const job = await prisma.job.findFirst({
    where: { id: jobId, userId },
    select: {
      id: true,
      title: true,
      description: true,
      jobLevel: true,
      market: true,
    },
  });
  if (!job) return;
  const profileEntry = await loadProfileByMarket(userId, job.market ?? "AU");
  if (!profileEntry) return;

  const result = computeMatchScore({
    title: job.title,
    description: job.description ?? "",
    jobLevel: job.jobLevel,
    profile: profileEntry.profile,
  });
  await prisma.job.update({
    where: { id: job.id },
    data: {
      matchScore: result.score,
      matchBreakdown: buildMatchBreakdown(result),
      scoredAt: new Date(),
      scoredProfileVersion: profileEntry.revision,
    },
  });
}
