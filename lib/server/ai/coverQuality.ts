import type { CoverEvidenceContext } from "./coverContext";

export type CoverDraft = {
  candidateTitle?: string;
  subject?: string;
  date?: string;
  salutation?: string;
  paragraphOne: string;
  paragraphTwo: string;
  paragraphThree: string;
  closing?: string;
  signatureName?: string;
};

export type CoverQualityIssue = {
  code:
    | "MISSING_STRUCTURE"
    | "WORD_COUNT_RANGE"
    | "TOP_RESPONSIBILITY_COVERAGE"
    | "EVIDENCE_GROUNDING"
    | "KEYWORD_BOLDING"
    | "GENERIC_MOTIVATION";
  message: string;
};

export type CoverQualityReport = {
  passed: boolean;
  wordCount: number;
  issues: CoverQualityIssue[];
};

type EvaluateCoverQualityInput = {
  draft: CoverDraft;
  context: CoverEvidenceContext;
  company: string;
  targetWordRange: { min: number; max: number };
};

const STOPWORDS = new Set([
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
  "you",
  "will",
  "role",
  "team",
  "company",
]);

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/\*\*/g, "")
    .replace(/[^a-z0-9\s+/#.-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token));
}

function countWords(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function getBoldTerms(value: string) {
  const terms: string[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let match = regex.exec(value);
  while (match) {
    const term = (match[1] ?? "").trim();
    if (term) terms.push(term);
    match = regex.exec(value);
  }
  return terms;
}

function hasResponsibilityCoverage(paragraph: string, responsibility: string) {
  const paragraphTokens = new Set(tokenize(paragraph));
  const responsibilityTokens = tokenize(responsibility);
  if (!responsibilityTokens.length) return false;
  let hits = 0;
  for (const token of responsibilityTokens) {
    if (paragraphTokens.has(token)) hits += 1;
  }
  return hits >= Math.min(2, responsibilityTokens.length);
}

function hasEvidenceGrounding(draftText: string, evidenceLines: string[]) {
  const draftTokens = new Set(tokenize(draftText));
  const evidenceTokens = evidenceLines.flatMap((line) => tokenize(line)).slice(0, 80);
  let hits = 0;
  for (const token of evidenceTokens) {
    if (draftTokens.has(token)) hits += 1;
    if (hits >= 3) return true;
  }
  return false;
}

export function evaluateCoverQuality(input: EvaluateCoverQualityInput): CoverQualityReport {
  const issues: CoverQualityIssue[] = [];
  const p1 = input.draft.paragraphOne.trim();
  const p2 = input.draft.paragraphTwo.trim();
  const p3 = input.draft.paragraphThree.trim();
  const wordCount = countWords(`${p1} ${p2} ${p3}`);

  if (!p1 || !p2 || !p3 || p1.length < 60 || p2.length < 90 || p3.length < 60) {
    issues.push({
      code: "MISSING_STRUCTURE",
      message: "Cover must include three substantial paragraphs with clear intent, evidence, and motivation.",
    });
  }

  if (wordCount < input.targetWordRange.min || wordCount > input.targetWordRange.max) {
    issues.push({
      code: "WORD_COUNT_RANGE",
      message: `Cover must be ${input.targetWordRange.min}-${input.targetWordRange.max} words.`,
    });
  }

  const topThree = input.context.topResponsibilities.slice(0, 3);
  const coveredTopCount = topThree.filter((item) => hasResponsibilityCoverage(p2, item)).length;
  if (topThree.length && coveredTopCount < Math.min(2, topThree.length)) {
    issues.push({
      code: "TOP_RESPONSIBILITY_COVERAGE",
      message: "Paragraph two must cover top JD responsibilities first with explicit mapping.",
    });
  }

  if (!hasEvidenceGrounding(`${p1} ${p2}`, input.context.matchedEvidence)) {
    issues.push({
      code: "EVIDENCE_GROUNDING",
      message: "Claims are not grounded enough in resume evidence.",
    });
  }

  const boldTerms = getBoldTerms(`${p1}\n${p2}\n${p3}`);
  if (boldTerms.length < 3) {
    issues.push({
      code: "KEYWORD_BOLDING",
      message: "Bold at least three JD-critical keywords using clean **keyword** markers.",
    });
  }

  const p3Lower = p3.toLowerCase();
  const mentionsCompany = input.company && p3Lower.includes(input.company.toLowerCase());
  const mentionsSpecificToken = input.context.topResponsibilities
    .slice(0, 3)
    .some((item) => tokenize(item).some((token) => p3Lower.includes(token)));
  if (!mentionsCompany && !mentionsSpecificToken) {
    issues.push({
      code: "GENERIC_MOTIVATION",
      message: "Paragraph three is generic; include role/company-specific motivation.",
    });
  }

  return {
    passed: issues.length === 0,
    wordCount,
    issues,
  };
}

export function buildCoverQualityRewriteBrief(report: CoverQualityReport) {
  if (report.passed) return "";
  return [
    "Quality gate failed. Rewrite once and fix every item below before returning final JSON:",
    ...report.issues.map((issue, index) => `${index + 1}. [${issue.code}] ${issue.message}`),
  ].join("\n");
}

