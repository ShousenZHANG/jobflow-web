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
