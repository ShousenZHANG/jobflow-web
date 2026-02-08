const RESPONSIBILITY_STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "your",
  "our",
  "their",
  "you",
  "will",
  "have",
  "has",
  "are",
  "is",
  "to",
  "of",
  "in",
  "on",
  "as",
  "by",
  "an",
  "a",
  "be",
  "or",
  "at",
  "across",
  "using",
  "through",
  "experience",
  "experienced",
  "strong",
  "ability",
  "abilities",
  "knowledge",
  "understanding",
  "familiarity",
  "support",
  "supporting",
  "deliver",
  "delivering",
  "work",
  "working",
  "team",
  "teams",
  "stakeholders",
  "candidate",
  "role",
  "responsibility",
  "responsibilities",
  "required",
  "preferred",
  "must",
  "should",
  "would",
]);

const RESPONSIBILITY_HEADER_RE =
  /(responsibilit(?:y|ies)|what you'll do|what you will do|in this role|key duties|you will)/i;
const NON_RESPONSIBILITY_HEADER_RE =
  /(qualifications|requirements|benefits|about us|about the company|nice to have)/i;
const BULLET_PREFIX_RE = /^(\d+[.)]|[-*?])\s+/;
const ACTION_VERB_RE =
  /\b(build|design|develop|deliver|own|lead|collaborat|improv|optimi[sz]e|maintain|mentor|automate|ship|drive|manage|architect|implement|support)\b/i;

function normalizeTextForMatch(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s+/#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function dedupeKeepOrder(items: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const key = normalizeTextForMatch(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function looksLikeResponsibility(line: string) {
  const cleaned = line.replace(BULLET_PREFIX_RE, "").trim();
  if (cleaned.length < 12) return false;
  if (NON_RESPONSIBILITY_HEADER_RE.test(cleaned)) return false;
  if (ACTION_VERB_RE.test(cleaned)) return true;
  if (/responsibilit/.test(cleaned.toLowerCase())) return true;
  return cleaned.length > 45;
}

export function extractResponsibilities(
  description: string | null | undefined,
  limit = 8,
) {
  const text = (description ?? "").trim();
  if (!text) return [] as string[];

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const candidates: string[] = [];
  let inResponsibilityBlock = false;

  for (const line of lines) {
    if (RESPONSIBILITY_HEADER_RE.test(line)) {
      inResponsibilityBlock = true;
      continue;
    }
    if (NON_RESPONSIBILITY_HEADER_RE.test(line) && line.endsWith(":")) {
      inResponsibilityBlock = false;
      continue;
    }

    if (BULLET_PREFIX_RE.test(line)) {
      const cleaned = line.replace(BULLET_PREFIX_RE, "").trim();
      if (looksLikeResponsibility(cleaned)) candidates.push(cleaned);
      continue;
    }

    if (inResponsibilityBlock && looksLikeResponsibility(line)) {
      candidates.push(line);
      continue;
    }

    if (looksLikeResponsibility(line) && line.length > 35) {
      candidates.push(line);
    }
  }

  if (candidates.length === 0) {
    const sentenceCandidates = text
      .split(/[.!?]\s+/)
      .map((line) => line.trim())
      .filter((line) => looksLikeResponsibility(line));
    return dedupeKeepOrder(sentenceCandidates).slice(0, limit);
  }

  return dedupeKeepOrder(candidates).slice(0, limit);
}

export function extractTopResponsibilities(description: string | null | undefined) {
  return extractResponsibilities(description, 3);
}

function extractResponsibilityKeywords(line: string) {
  return Array.from(
    new Set(
      normalizeTextForMatch(line)
        .split(" ")
        .map((token) => token.trim())
        .filter((token) => token.length >= 4 && !RESPONSIBILITY_STOPWORDS.has(token)),
    ),
  );
}

export function bulletMatchesResponsibility(bullet: string, responsibility: string) {
  const bulletNorm = normalizeTextForMatch(bullet);
  const keywords = extractResponsibilityKeywords(responsibility);
  if (keywords.length === 0) return false;

  let hits = 0;
  for (const kw of keywords) {
    const re = new RegExp(`\\b${escapeRegExp(kw)}\\b`, "i");
    if (re.test(bulletNorm)) hits += 1;
  }
  const hitRatio = hits / keywords.length;
  const minHits = keywords.length >= 6 ? 3 : 2;
  return hits >= minHits && hitRatio >= 0.34;
}

export function computeTop3Coverage(description: string | null | undefined, baseBullets: string[]) {
  const allResponsibilities = extractResponsibilities(description, 10);
  const topResponsibilities = allResponsibilities.slice(0, 3);
  const missingFromBase = topResponsibilities.filter(
    (resp) => !baseBullets.some((bullet) => bulletMatchesResponsibility(bullet, resp)),
  );
  const fallbackResponsibilities =
    missingFromBase.length > 0
      ? allResponsibilities
          .slice(3)
          .filter((resp) => !baseBullets.some((bullet) => bulletMatchesResponsibility(bullet, resp)))
      : [];

  if (missingFromBase.length === 0) {
    return {
      topResponsibilities,
      missingFromBase,
      fallbackResponsibilities: [],
      requiredNewBulletsMin: 0,
      requiredNewBulletsMax: 0,
    };
  }

  return {
    topResponsibilities,
    missingFromBase,
    fallbackResponsibilities,
    requiredNewBulletsMin: Math.min(Math.max(2, missingFromBase.length), 3),
    requiredNewBulletsMax: 3,
  };
}
