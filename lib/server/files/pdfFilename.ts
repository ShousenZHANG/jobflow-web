function toTitleToken(token: string) {
  if (!token) return "";
  if (/^\d+$/.test(token)) return token;
  return `${token.charAt(0).toUpperCase()}${token.slice(1).toLowerCase()}`;
}

function normalizePart(value: string, fallback: string) {
  const stripped = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim();

  if (!stripped) return fallback;

  const tokens = stripped
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => toTitleToken(token));

  return tokens.length > 0 ? tokens.join("_") : fallback;
}

export function buildPdfFilename(fullName: string, role: string, suffix?: string) {
  const safeName = normalizePart(fullName, "Candidate");
  const safeRole = normalizePart(role, "Role");
  const safeSuffix = suffix ? normalizePart(suffix, "").trim() : "";
  const base = safeSuffix ? `${safeName}_${safeRole}_${safeSuffix}` : `${safeName}_${safeRole}`;
  return `${base}.pdf`;
}
