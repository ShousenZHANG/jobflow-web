export function escapeLatex(value: string) {
  const normalized = Buffer.from(value ?? "", "utf8")
    .toString("utf8")
    .normalize("NFKC")
    .replace(/\r\n/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/[\uD800-\uDFFF]/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/[\u{1F000}-\u{10FFFF}]/gu, "");

  const asciiSafe = normalized
    .replace(/\u00A0/g, " ")
    .replace(/\u2014/g, "--")
    .replace(/\u2013/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/\u2026/g, "...")
    .replace(/\u2022/g, "-");

  return asciiSafe
    .replace(/\\/g, "\\\\")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

export function escapeLatexWithBold(value: string) {
  const input = Buffer.from(value ?? "", "utf8")
    .toString("utf8")
    .normalize("NFKC")
    // Handle model outputs like "\\*\\*keyword\\*\\*" (escaped markdown markers).
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_");
  const pattern = /(\*\*|__)([\s\S]+?)\1/g;
  let result = "";
  let lastIndex = 0;
  let hasMatch = false;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    hasMatch = true;
    result += escapeLatex(input.slice(lastIndex, match.index));
    const rawInner = match[2] ?? "";
    const leading = rawInner.match(/^\s*/)?.[0] ?? "";
    const trailing = rawInner.match(/\s*$/)?.[0] ?? "";
    const core = rawInner.trim();

    if (core.length === 0) {
      // Graceful fallback for malformed markers such as "****" or whitespace-only content.
      result += escapeLatex(rawInner);
    } else {
      // Keep surrounding whitespace outside the macro so TeX does not swallow it.
      result += `${escapeLatex(leading)}\\textbf{${escapeLatex(core)}}${escapeLatex(trailing)}`;
    }
    lastIndex = match.index + match[0].length;
  }

  if (!hasMatch) {
    return escapeLatex(input);
  }

  result += escapeLatex(input.slice(lastIndex));
  return result;
}
