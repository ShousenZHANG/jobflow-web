export function shouldUseRelevanceSort(q: string): boolean {
  const trimmed = q.trim();
  if (trimmed.length < 3) return false;
  const cjkChars = trimmed.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
  if (cjkChars && cjkChars.length < 2) return false;
  return true;
}

export function escapeLikePattern(input: string): string {
  return input.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
