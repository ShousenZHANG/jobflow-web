/** Base grammar stopwords shared across all text analysis functions */
export const BASE_STOPWORDS = new Set([
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
]);

/** Extended stopwords for cover letter analysis */
export const COVER_STOPWORDS = new Set([
  ...BASE_STOPWORDS,
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

/** Extended stopwords for cover quality evaluation */
export const QUALITY_STOPWORDS = new Set([
  ...BASE_STOPWORDS,
  "role",
  "team",
  "company",
]);

/** Tokenize text for keyword matching, stripping bold markers and stopwords */
export function tokenize(
  value: string,
  stopwords: Set<string> = BASE_STOPWORDS,
): string[] {
  return value
    .toLowerCase()
    .replace(/\*\*/g, "")
    .replace(/[^a-z0-9\s+/#.-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4 && !stopwords.has(token));
}
