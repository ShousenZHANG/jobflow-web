import { extractTopResponsibilities } from "./responsibilityCoverage";

const COVER_EVIDENCE_STOPWORDS = new Set([
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
  "using",
  "through",
  "across",
  "experience",
  "experienced",
  "responsibility",
  "responsibilities",
  "required",
  "preferred",
  "role",
  "team",
  "teams",
]);

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s+/#.-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4 && !COVER_EVIDENCE_STOPWORDS.has(token));
}

function dedupe(items: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const key = item.toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item.trim());
  }
  return out;
}

export type CoverEvidenceContext = {
  topResponsibilities: string[];
  matchedEvidence: string[];
  resumeHighlights: string[];
};

export function buildCoverEvidenceContext(input: {
  baseSummary: string;
  description: string;
  resumeSnapshot?: unknown;
}): CoverEvidenceContext {
  const topResponsibilities = extractTopResponsibilities(input.description);
  const jdTokens = new Set(tokenize(`${topResponsibilities.join(" ")} ${input.description}`));
  const record = asRecord(input.resumeSnapshot);

  const evidencePool: string[] = [];
  const baseSummary = input.baseSummary.trim();
  if (baseSummary) {
    evidencePool.push(`Summary: ${baseSummary}`);
  }

  const experiences = asArray(record.experiences);
  for (const entry of experiences) {
    const exp = asRecord(entry);
    const title = toText(exp.title);
    const company = toText(exp.company);
    const prefix = [title, company].filter(Boolean).join(" @ ");
    const bullets = asArray(exp.bullets).map(toText).filter(Boolean);
    for (const bullet of bullets) {
      evidencePool.push(prefix ? `Experience (${prefix}): ${bullet}` : `Experience: ${bullet}`);
    }
  }

  const projects = asArray(record.projects);
  for (const entry of projects) {
    const proj = asRecord(entry);
    const name = toText(proj.name);
    const stack = toText(proj.stack);
    const prefix = [name, stack].filter(Boolean).join(" | ");
    const bullets = asArray(proj.bullets).map(toText).filter(Boolean);
    for (const bullet of bullets) {
      evidencePool.push(prefix ? `Project (${prefix}): ${bullet}` : `Project: ${bullet}`);
    }
  }

  const skills = asArray(record.skills);
  for (const entry of skills) {
    const skill = asRecord(entry);
    const label = toText(skill.category) || toText(skill.label) || "Skills";
    const items = asArray(skill.items).map(toText).filter(Boolean).slice(0, 12);
    for (const item of items) {
      evidencePool.push(`${label}: ${item}`);
    }
  }

  const dedupedEvidence = dedupe(evidencePool);
  const scored = dedupedEvidence
    .map((line) => {
      const tokens = tokenize(line);
      let hits = 0;
      for (const token of tokens) {
        if (jdTokens.has(token)) hits += 1;
      }
      return { line, hits };
    })
    .sort((a, b) => b.hits - a.hits || a.line.length - b.line.length);

  const matchedEvidence = scored
    .filter((item) => item.hits > 0)
    .slice(0, 10)
    .map((item) => item.line);

  const resumeHighlights = scored
    .filter((item) => !matchedEvidence.includes(item.line))
    .slice(0, 8)
    .map((item) => item.line);

  return {
    topResponsibilities,
    matchedEvidence: matchedEvidence.length > 0 ? matchedEvidence : dedupedEvidence.slice(0, 8),
    resumeHighlights,
  };
}

