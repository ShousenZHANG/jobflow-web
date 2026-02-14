// Canonicalize job URLs so we can dedupe reliably across tracking variants.
// Big-tech default: prefer a stable external identifier when available.

const LINKEDIN_VIEW_RE = /\/jobs\/view\/(\d+)/i;

function normalizePathname(pathname: string) {
  let out = pathname || "/";
  if (out !== "/") out = out.replace(/\/+$/, "") || "/";
  return out;
}

function getLinkedInJobId(url: URL): string {
  const fromPath = LINKEDIN_VIEW_RE.exec(url.pathname)?.[1];
  if (fromPath) return fromPath;

  // Many LinkedIn URLs carry the job id in query params (e.g. /jobs/search/?currentJobId=123)
  const fromQuery =
    url.searchParams.get("currentJobId") ??
    url.searchParams.get("currentjobid") ??
    url.searchParams.get("jobId") ??
    url.searchParams.get("jobid");
  if (fromQuery && /^\d+$/.test(fromQuery)) return fromQuery;

  return "";
}

export function canonicalizeJobUrl(raw: string) {
  const input = raw.trim();
  if (!input) return "";

  try {
    const parsed = new URL(input);

    const protocol = parsed.protocol.toLowerCase();
    const hostnameLower = parsed.hostname.toLowerCase();

    // Normalize www + LinkedIn subdomains (e.g. au.linkedin.com -> linkedin.com)
    let hostname = hostnameLower.replace(/^www\./, "");
    if (hostname === "linkedin.com" || hostname.endsWith(".linkedin.com")) {
      hostname = "linkedin.com";
    }

    const isDefaultPort =
      (protocol === "https:" && parsed.port === "443") ||
      (protocol === "http:" && parsed.port === "80");
    const host = parsed.port && !isDefaultPort ? `${hostname}:${parsed.port}` : hostname;

    if (hostname === "linkedin.com") {
      const jobId = getLinkedInJobId(parsed);
      if (jobId) {
        // Force to a stable job posting URL.
        return `https://linkedin.com/jobs/view/${jobId}`;
      }
    }

    const pathname = normalizePathname(parsed.pathname);
    return `${protocol}//${host}${pathname}`;
  } catch {
    // If URL parsing fails, return a trimmed string. Deduping is best-effort.
    return input;
  }
}

