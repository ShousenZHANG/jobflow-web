// Pure deterministic job-CV match scoring. Zero AI calls. Runs in ~5ms per
// job, safe to call server-side in a tight loop.
//
// Score composition:
//   50% Skills   — gazetteer overlap between JD text and profile text bag
//   20% Title    — token overlap between JD title and user's experience titles
//   15% Level    — distance between JD seniority and user's inferred max level
//   15% Years    — JD-required years vs user's computed total years
//
// Philosophy borrowed from career-ops: "filter, don't spray" — we surface a
// tier label and a >= 65 cutoff (analog of career-ops's 4.0/5) so that the UI
// can hide low-fit jobs by default.

import { extractSkills } from "./skillsGazetteer";

// ── Public types ────────────────────────────────────────

export interface ScoreInput {
  title: string;
  description?: string | null;
  jobLevel?: string | null;
  profile: {
    skills: { category: string; items: string[] }[];
    experiences: {
      title: string;
      dates?: string;
      bullets: string[];
    }[];
    projects: {
      name: string;
      stack?: string;
      bullets: string[];
    }[];
  };
}

export type MatchTier = "strong" | "good" | "fair" | "weak";

export interface ScoreBreakdown {
  skillsScore: number;
  titleScore: number;
  levelScore: number;
  experienceScore: number;
}

export interface ScoreResult {
  score: number; // 0-100 integer
  tier: MatchTier;
  matchedSkills: string[];
  missingSkills: string[];
  breakdown: ScoreBreakdown;
}

// ── Tier mapping ────────────────────────────────────────

export function scoreToTier(score: number): MatchTier {
  if (score >= 80) return "strong";
  if (score >= 65) return "good";
  if (score >= 45) return "fair";
  return "weak";
}

// ── Internal helpers ────────────────────────────────────

const WEIGHTS = {
  skills: 0.5,
  title: 0.2,
  level: 0.15,
  experience: 0.15,
} as const;

const LEVEL_KEYWORDS: Array<{ rank: number; patterns: RegExp[] }> = [
  {
    rank: 0,
    patterns: [/\bintern\b/i, /\bgraduate\b/i, /\bentry[-\s]?level\b/i],
  },
  {
    rank: 1,
    patterns: [/\bjunior\b/i, /\bassociate\b/i, /\bjr\.?\b/i],
  },
  {
    rank: 2,
    patterns: [/\bmid[-\s]?level\b/i, /\bmid\b/i],
  },
  {
    rank: 3,
    patterns: [/\bsenior\b/i, /\bsr\.?\b/i, /\blead\b/i],
  },
  {
    rank: 4,
    patterns: [/\bstaff\b/i, /\bprincipal\b/i, /\bdistinguished\b/i, /\barchitect\b/i],
  },
];

function inferLevel(text: string): number | null {
  if (!text) return null;
  // Iterate from highest rank down so "senior staff" detects as staff.
  for (let i = LEVEL_KEYWORDS.length - 1; i >= 0; i--) {
    const { rank, patterns } = LEVEL_KEYWORDS[i];
    if (patterns.some((p) => p.test(text))) return rank;
  }
  return null;
}

const STOP_WORDS = new Set([
  "a", "an", "and", "at", "by", "for", "in", "of", "on", "or", "the",
  "to", "with", "engineer", "developer", "software",
]);

function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));
}

/**
 * Parse "3+ years" / "5-7 years" / "at least 10 years" etc. from JD text.
 * Returns the MINIMUM years required, or null if no requirement stated.
 */
function parseRequiredYears(text: string): number | null {
  if (!text) return null;
  const patterns = [
    /(\d+)\s*\+\s*years?/i,
    /at\s+least\s+(\d+)\s*years?/i,
    /minimum\s+of\s+(\d+)\s*years?/i,
    /(\d+)\s*-\s*\d+\s*years?/i, // "5-7 years" → 5
    /(\d+)\s*years?/i, // plain fallback
    /(\d+)\s*\+?\s*年/i, // Chinese: "5年" / "5+年"
  ];
  for (const pat of patterns) {
    const match = pat.exec(text);
    if (match) {
      const n = Number(match[1]);
      if (Number.isFinite(n) && n > 0 && n < 50) return n;
    }
  }
  return null;
}

/**
 * Compute total years of experience from `experiences[].dates` strings.
 * Supports "2020.01 - 2024.12", "2020 - Present", "Jan 2020 - Dec 2024".
 * Returns a float (0 if unparseable).
 */
function computeTotalYears(
  experiences: ScoreInput["profile"]["experiences"],
): number {
  let total = 0;
  const now = new Date();
  for (const exp of experiences) {
    if (!exp.dates) continue;
    const parts = exp.dates.split(/\s*[-–—]\s*/);
    if (parts.length !== 2) continue;
    const start = parseLooseDate(parts[0]);
    const end = /present|current|now|至今|现在/i.test(parts[1])
      ? now
      : parseLooseDate(parts[1]);
    if (!start || !end) continue;
    const years = (end.getTime() - start.getTime()) / (365.25 * 24 * 3600 * 1000);
    if (years > 0 && years < 60) total += years;
  }
  return total;
}

function parseLooseDate(s: string): Date | null {
  const trimmed = s.trim();
  // "2020.01" / "2020-01" / "2020/01"
  const ym = /(\d{4})[\s./-]+(\d{1,2})/.exec(trimmed);
  if (ym) {
    return new Date(Number(ym[1]), Number(ym[2]) - 1, 1);
  }
  // "2020"
  const y = /^(\d{4})$/.exec(trimmed);
  if (y) return new Date(Number(y[1]), 0, 1);
  // "Jan 2020" / "January 2020"
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) return d;
  return null;
}

// ── Component scorers ──────────────────────────────────

function scoreSkills(input: ScoreInput): {
  score: number;
  matched: string[];
  missing: string[];
} {
  const jdText = `${input.title} ${input.description ?? ""}`;
  const jdSkills = extractSkills(jdText);

  const profileText = [
    ...input.profile.skills.flatMap((g) => g.items),
    ...input.profile.experiences.flatMap((e) => [e.title, ...e.bullets]),
    ...input.profile.projects.flatMap((p) => [
      p.name,
      p.stack ?? "",
      ...p.bullets,
    ]),
  ].join("\n");
  const profileSkills = extractSkills(profileText);

  const matched: string[] = [];
  const missing: string[] = [];
  for (const skill of jdSkills) {
    if (profileSkills.has(skill)) matched.push(skill);
    else missing.push(skill);
  }
  // Stable alphabetical order so scores are deterministic and UI doesn't jitter.
  matched.sort();
  missing.sort();

  // Divide by max(jdCount, 3) so that JDs which mention only 1-2 skills don't
  // explode the variance (a single hit would else = 100%).
  const denom = Math.max(jdSkills.size, 3);
  const score = Math.round((matched.length / denom) * 100);
  return { score: Math.min(score, 100), matched, missing };
}

function scoreTitle(input: ScoreInput): number {
  const jdTokens = tokenize(input.title);
  if (jdTokens.length === 0) return 50; // neutral when JD title missing

  const profileTitleText = input.profile.experiences
    .map((e) => e.title ?? "")
    .join(" ");
  const profileTokens = new Set(tokenize(profileTitleText));
  if (profileTokens.size === 0) return 0;

  let hits = 0;
  for (const tok of jdTokens) {
    if (profileTokens.has(tok)) hits++;
  }
  return Math.round((hits / jdTokens.length) * 100);
}

function scoreLevel(input: ScoreInput): number {
  const jdLevelText = `${input.title} ${input.jobLevel ?? ""}`;
  const jdRank = inferLevel(jdLevelText);
  if (jdRank === null) return 75; // neutral when JD doesn't state level

  const maxProfileRank = Math.max(
    ...input.profile.experiences.map((e) => inferLevel(e.title) ?? -1),
    -1,
  );
  if (maxProfileRank < 0) {
    // No level signal in profile — penalize if JD demands senior+
    return jdRank >= 3 ? 30 : 70;
  }

  const delta = jdRank - maxProfileRank;
  if (delta === 0) return 100;
  if (delta === 1) return 70;
  if (delta === 2) return 35;
  if (delta >= 3) return 10;
  // Over-qualified (delta < 0) — mild penalty
  return 60;
}

function scoreExperience(input: ScoreInput): number {
  const required = parseRequiredYears(input.description ?? "");
  const total = computeTotalYears(input.profile.experiences);

  if (required === null) {
    // No stated requirement — reward >= 2 years, neutral otherwise.
    if (total >= 5) return 100;
    if (total >= 2) return 85;
    return 70;
  }
  if (total >= required) return 100;
  const deficit = required - total;
  if (deficit <= 1) return 70;
  if (deficit <= 3) return 40;
  return 15;
}

// ── Public API ──────────────────────────────────────────

export function computeMatchScore(input: ScoreInput): ScoreResult {
  // Fully-empty profile (no skills, no experiences, no projects) is treated
  // as "not set up yet" — short-circuit to 0 so the UI can surface a
  // "finish setting up your resume" CTA instead of a misleading baseline.
  const hasAnyProfile =
    input.profile.skills.length > 0 ||
    input.profile.experiences.length > 0 ||
    input.profile.projects.length > 0;
  if (!hasAnyProfile) {
    return {
      score: 0,
      tier: "weak",
      matchedSkills: [],
      missingSkills: [],
      breakdown: {
        skillsScore: 0,
        titleScore: 0,
        levelScore: 0,
        experienceScore: 0,
      },
    };
  }

  const { score: skillsScore, matched, missing } = scoreSkills(input);
  const titleScore = scoreTitle(input);
  const levelScore = scoreLevel(input);
  const experienceScore = scoreExperience(input);

  const weighted =
    skillsScore * WEIGHTS.skills +
    titleScore * WEIGHTS.title +
    levelScore * WEIGHTS.level +
    experienceScore * WEIGHTS.experience;

  const score = Math.round(Math.max(0, Math.min(100, weighted)));

  return {
    score,
    tier: scoreToTier(score),
    matchedSkills: matched,
    missingSkills: missing,
    breakdown: {
      skillsScore,
      titleScore,
      levelScore,
      experienceScore,
    },
  };
}
