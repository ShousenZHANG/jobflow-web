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

export function extractTopResponsibilities(description: string | null | undefined) {
  const text = (description ?? "").trim();
  if (!text) return [] as string[];

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const bullets = lines
    .filter((line) => /^(\d+[.)]|[-*•])\s+/.test(line) || line.length > 35)
    .map((line) => line.replace(/^(\d+[.)]|[-*•])\s+/, "").trim())
    .filter((line) => line.length >= 12);

  return bullets.slice(0, 3);
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
  const topResponsibilities = extractTopResponsibilities(description);
  const missingFromBase = topResponsibilities.filter(
    (resp) => !baseBullets.some((bullet) => bulletMatchesResponsibility(bullet, resp)),
  );

  if (missingFromBase.length === 0) {
    return {
      topResponsibilities,
      missingFromBase,
      requiredNewBulletsMin: 0,
      requiredNewBulletsMax: 0,
    };
  }

  return {
    topResponsibilities,
    missingFromBase,
    requiredNewBulletsMin: Math.min(Math.max(2, missingFromBase.length), 3),
    requiredNewBulletsMax: 3,
  };
}

