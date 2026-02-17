import { bulletMatchesResponsibility, computeTop3Coverage } from "@/lib/server/ai/responsibilityCoverage";
import { callProvider, getDefaultModel, normalizeProviderModel } from "@/lib/server/ai/providers";
import {
  type JobFitAnalysisPayload,
  type JobFitGate,
  type JobFitGateStatus,
  type JobFitRecommendation,
  type JobFitSource,
} from "@/lib/shared/jobFitAnalysis";

type ResumeLike = {
  summary?: string | null;
  skills?: unknown;
  experiences?: unknown;
  projects?: unknown;
};

type BuildInput = {
  title: string;
  company: string | null;
  description: string;
  resume: ResumeLike;
};

export type BuildJobFitResult = {
  analysis: JobFitAnalysisPayload;
  source: JobFitSource;
  aiEnhanced: boolean;
  provider: "gemini" | null;
  model: string | null;
  aiReason: string | null;
};

const TECH_KEYWORDS = [
  "Java",
  "Spring",
  "Spring Boot",
  "Kotlin",
  "Scala",
  "Python",
  "Django",
  "Flask",
  "FastAPI",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "NestJS",
  "Go",
  "Rust",
  "C#",
  ".NET",
  "GraphQL",
  "REST",
  "gRPC",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Kafka",
  "RabbitMQ",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Terraform",
  "CI/CD",
  "GitHub Actions",
];

const SOFT_REQUIREMENT_RE = /\b(preferred|nice to have|nice-to-have|bonus|desired|a plus)\b/i;
const HARD_REQUIREMENT_RE =
  /\b(require|required|requirements|qualification|qualifications|minimum|at least|must have|must-have|must be)\b/i;
const EXPERIENCE_CONTEXT_RE =
  /\b(experience|exp|engineering|developer|development|devops|data|software|frontend|backend|full stack)\b/i;
const VISA_CONTEXT_RE =
  /\b(pr|permanent resident|citizen|citizenship|work rights?|work authorization|visa|sponsorship)\b/i;

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsTerm(text: string, term: string): boolean {
  const normalized = text.toLowerCase();
  const t = term.toLowerCase();
  if (/[#+/.]/.test(t)) {
    return normalized.includes(t);
  }
  const re = new RegExp(`\\b${escapeRegExp(t)}\\b`, "i");
  return re.test(text);
}

function dedupe(items: string[]): string[] {
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

function buildGapSignals(input: {
  missingResponsibilities: string[];
  unmatchedTech: string[];
  yearsGateStatus: JobFitGateStatus;
  yearRequirement: number | null;
  visaRequired: boolean;
}): string[] {
  const signals: string[] = [];
  if (input.missingResponsibilities.length > 0) {
    signals.push(`Responsibility coverage gap (${input.missingResponsibilities.length})`);
  }
  for (const tech of input.unmatchedTech.slice(0, 2)) {
    signals.push(`Missing stack: ${tech}`);
  }
  if (input.yearsGateStatus !== "PASS" && input.yearRequirement !== null) {
    signals.push(`Seniority gap: ${input.yearRequirement}+ years target`);
  }
  if (input.visaRequired) {
    signals.push("Work rights requirement present");
  }
  return dedupe(signals).slice(0, 3);
}

function collectResumeText(resume: ResumeLike): string {
  const parts: string[] = [];
  if (resume.summary) parts.push(resume.summary);

  for (const skill of asArray(resume.skills)) {
    const record = asRecord(skill);
    parts.push(toText(record.category));
    for (const item of asArray(record.items)) {
      parts.push(toText(item));
    }
  }

  for (const exp of asArray(resume.experiences)) {
    const record = asRecord(exp);
    parts.push(toText(record.title));
    parts.push(toText(record.company));
    parts.push(toText(record.dates));
    for (const bullet of asArray(record.bullets)) {
      parts.push(toText(bullet));
    }
  }

  for (const proj of asArray(resume.projects)) {
    const record = asRecord(proj);
    parts.push(toText(record.name));
    parts.push(toText(record.stack));
    for (const bullet of asArray(record.bullets)) {
      parts.push(toText(bullet));
    }
  }

  return parts.filter(Boolean).join("\n");
}

function collectResumeBullets(resume: ResumeLike): string[] {
  const bullets: string[] = [];
  for (const exp of asArray(resume.experiences)) {
    const record = asRecord(exp);
    for (const bullet of asArray(record.bullets)) {
      const text = toText(bullet);
      if (text) bullets.push(text);
    }
  }
  return bullets;
}

function estimateResumeYears(resume: ResumeLike): number {
  const years: number[] = [];
  for (const exp of asArray(resume.experiences)) {
    const record = asRecord(exp);
    const dates = toText(record.dates);
    const matches = dates.match(/\b(19|20)\d{2}\b/g) ?? [];
    for (const match of matches) {
      const year = Number(match);
      if (Number.isFinite(year)) years.push(year);
    }
  }
  if (years.length >= 2) {
    const min = Math.min(...years);
    const max = Math.max(...years);
    if (max >= min) return Math.max(0, max - min + 1);
  }

  const summary = (resume.summary ?? "").toLowerCase();
  const yearsFromSummary = summary.match(/\b(\d{1,2})\s*\+?\s*years?\b/i);
  if (yearsFromSummary) {
    const value = Number(yearsFromSummary[1]);
    if (Number.isFinite(value)) return value;
  }
  return 0;
}

function extractYearRequirement(description: string): {
  years: number | null;
  isHard: boolean;
  evidence?: string;
} {
  const lines = description
    .split(/[\n.;]+/)
    .map((line) => line.trim())
    .filter(Boolean);

  let bestYears: number | null = null;
  let bestHard = false;
  let bestEvidence: string | undefined;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (!EXPERIENCE_CONTEXT_RE.test(lower) && !HARD_REQUIREMENT_RE.test(lower) && !SOFT_REQUIREMENT_RE.test(lower)) {
      continue;
    }
    const hard = HARD_REQUIREMENT_RE.test(lower) && !SOFT_REQUIREMENT_RE.test(lower);
    const plus = line.match(/\b(\d{1,2})\s*\+\s*(?:years?|yrs?)\b/i);
    const range = line.match(/\b(\d{1,2})\s*(?:-|to)\s*(\d{1,2})\s*(?:years?|yrs?)\b/i);
    const plain = line.match(/\b(\d{1,2})\s*(?:years?|yrs?)\b/i);

    const candidate = range
      ? Math.min(Number(range[1]), Number(range[2]))
      : plus
        ? Number(plus[1])
        : plain
          ? Number(plain[1])
          : null;
    if (candidate === null || !Number.isFinite(candidate)) continue;
    if (bestYears === null || candidate > bestYears || (hard && !bestHard)) {
      bestYears = candidate;
      bestHard = hard;
      bestEvidence = line;
    }
  }

  return { years: bestYears, isHard: bestHard, evidence: bestEvidence };
}

function extractVisaRequirement(description: string): {
  required: boolean;
  evidence?: string;
} {
  const lines = description
    .split(/[\n.;]+/)
    .map((line) => line.trim())
    .filter(Boolean);
  for (const line of lines) {
    if (!VISA_CONTEXT_RE.test(line)) continue;
    return { required: true, evidence: line };
  }
  return { required: false };
}

function pickRecommendation(score: number, gateStatus: JobFitGateStatus): JobFitRecommendation {
  if (gateStatus === "BLOCK") return "Low Priority";
  if (score >= 75 && gateStatus === "PASS") return "Worth Applying";
  if (score >= 55) return "Apply with Tailored CV";
  return "Low Priority";
}

function parseFirstJsonObject(raw: string): Record<string, unknown> | null {
  const text = raw.trim();
  if (!text) return null;
  let inString = false;
  let escaped = false;
  let depth = 0;
  let start = -1;

  for (let idx = 0; idx < text.length; idx += 1) {
    const ch = text[idx];
    if (start < 0) {
      if (ch === "{") {
        start = idx;
        depth = 1;
      }
      continue;
    }
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        const candidate = text.slice(start, idx + 1);
        try {
          const parsed = JSON.parse(candidate) as unknown;
          if (!parsed || typeof parsed !== "object") return null;
          return parsed as Record<string, unknown>;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

async function maybeRefineWithGemini(
  input: BuildInput,
  analysis: JobFitAnalysisPayload,
): Promise<BuildJobFitResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      analysis,
      source: "heuristic",
      aiEnhanced: false,
      provider: null,
      model: null,
      aiReason: "GEMINI_API_KEY_MISSING",
    };
  }

  const model = normalizeProviderModel("gemini", process.env.GEMINI_MODEL || getDefaultModel("gemini"));
  const systemPrompt = [
    "You are a recruiting decision assistant.",
    "Return strict JSON only.",
    "Keep recommendations conservative and evidence-based.",
  ].join("\n");
  const userPrompt = [
    "Improve this precomputed fit analysis without fabricating claims.",
    "If uncertain, keep the original values.",
    "JSON schema:",
    "{",
    '  "recommendation": "Worth Applying|Apply with Tailored CV|Low Priority (optional)",',
    '  "topGaps": ["string"],',
    '  "gates": [{"key":"string","label":"string","status":"PASS|RISK|BLOCK","evidence":"string(optional)"}]',
    "}",
    "",
    `Role: ${input.title} @ ${input.company ?? "Unknown company"}`,
    `JD: ${input.description}`,
    `Current analysis: ${JSON.stringify(analysis)}`,
  ].join("\n");

  const parsePatch = (parsed: Record<string, unknown>) => {
    const topGaps = Array.isArray(parsed.topGaps)
      ? parsed.topGaps
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean)
          .slice(0, 3)
      : analysis.topGaps;
    const recommendation =
      parsed.recommendation === "Worth Applying" ||
      parsed.recommendation === "Apply with Tailored CV" ||
      parsed.recommendation === "Low Priority"
        ? parsed.recommendation
        : analysis.recommendation;
    const gates = Array.isArray(parsed.gates)
      ? parsed.gates
          .map((item) => {
            const rec = asRecord(item);
            const status = rec.status;
            if (status !== "PASS" && status !== "RISK" && status !== "BLOCK") return null;
            const key = toText(rec.key);
            const label = toText(rec.label);
            if (!key || !label) return null;
            const evidence = toText(rec.evidence) || undefined;
            return { key, label, status, evidence } as JobFitGate;
          })
          .filter((item): item is JobFitGate => Boolean(item))
          .slice(0, 5)
      : analysis.gates;

    const gateStatus: JobFitGateStatus = gates.some((item) => item.status === "BLOCK")
      ? "BLOCK"
      : gates.some((item) => item.status === "RISK")
        ? "RISK"
        : "PASS";

    return {
      analysis: {
        ...analysis,
        topGaps,
        gates,
        gateStatus,
        recommendation,
      },
      source: "heuristic+gemini" as const,
      aiEnhanced: true,
      provider: "gemini" as const,
      model,
      aiReason: null,
    };
  };

  const mapGeminiFailureReason = (error: unknown): string => {
    const message = error instanceof Error ? error.message : "";
    if (message.startsWith("GEMINI_403")) return "GEMINI_AUTH_403";
    if (message.startsWith("GEMINI_429")) return "GEMINI_RATE_LIMIT_429";
    if (message.startsWith("GEMINI_404")) return "GEMINI_MODEL_NOT_FOUND_404";
    if (message.startsWith("GEMINI_400")) return "GEMINI_BAD_REQUEST_400";
    if (message.startsWith("GEMINI_5")) return "GEMINI_SERVER_5XX";
    return "GEMINI_REQUEST_FAILED";
  };

  try {
    const raw = await callProvider("gemini", {
      apiKey,
      model,
      systemPrompt,
      userPrompt,
    });
    const parsed = parseFirstJsonObject(raw);
    if (parsed) return parsePatch(parsed);

    const retryRaw = await callProvider("gemini", {
      apiKey,
      model,
      systemPrompt: `${systemPrompt}\nReturn one valid JSON object only. No markdown, no prose, no code fences.`,
      userPrompt: [
        userPrompt,
        "",
        "Retry mode: Output EXACTLY one JSON object. Do not include explanations.",
      ].join("\n"),
    });
    const retryParsed = parseFirstJsonObject(retryRaw);
    if (retryParsed) return parsePatch(retryParsed);

    return {
      analysis,
      source: "heuristic",
      aiEnhanced: false,
      provider: null,
      model,
      aiReason: "GEMINI_INVALID_JSON_RETRY_FAILED",
    };
  } catch (error) {
    return {
      analysis,
      source: "heuristic",
      aiEnhanced: false,
      provider: "gemini",
      model,
      aiReason: mapGeminiFailureReason(error),
    };
  }
}

export async function buildJobFitAnalysis(input: BuildInput): Promise<BuildJobFitResult> {
  const resumeText = collectResumeText(input.resume);
  const resumeBullets = collectResumeBullets(input.resume);
  const jdTech = dedupe(TECH_KEYWORDS.filter((keyword) => containsTerm(input.description, keyword)));
  const resumeTech = new Set(TECH_KEYWORDS.filter((keyword) => containsTerm(resumeText, keyword)).map((item) => item.toLowerCase()));
  const matchedTech = jdTech.filter((keyword) => resumeTech.has(keyword.toLowerCase()));

  const coverage = computeTop3Coverage(input.description, resumeBullets);
  const topResponsibilities = coverage.topResponsibilities;
  const missingResponsibilities = coverage.missingFromBase;
  const coverageRatio =
    topResponsibilities.length > 0
      ? (topResponsibilities.length - missingResponsibilities.length) / topResponsibilities.length
      : 0.6;

  const stackRatio = jdTech.length > 0 ? matchedTech.length / jdTech.length : 0.65;
  const resumeYears = estimateResumeYears(input.resume);
  const yearReq = extractYearRequirement(input.description);
  const visaReq = extractVisaRequirement(input.description);

  const yearsGateStatus: JobFitGateStatus =
    yearReq.years === null
      ? "PASS"
      : resumeYears >= yearReq.years
        ? "PASS"
        : yearReq.isHard && resumeYears + 1 < yearReq.years
          ? "BLOCK"
          : "RISK";
  const visaGateStatus: JobFitGateStatus = visaReq.required ? "RISK" : "PASS";

  const gates: JobFitGate[] = [
    {
      key: "experience_years",
      label:
        yearReq.years === null
          ? "Experience years not explicitly required"
          : `Experience years (${resumeYears}y vs ${yearReq.years}+ target)`,
      status: yearsGateStatus,
      evidence: yearReq.evidence,
    },
    {
      key: "work_rights",
      label: visaReq.required ? "Work rights / visa constraint present" : "No explicit visa constraint detected",
      status: visaGateStatus,
      evidence: visaReq.evidence,
    },
  ];

  const gateStatus: JobFitGateStatus = gates.some((gate) => gate.status === "BLOCK")
    ? "BLOCK"
    : gates.some((gate) => gate.status === "RISK")
      ? "RISK"
      : "PASS";

  const seniorityRatio =
    yearReq.years === null ? 0.75 : Math.max(0, Math.min(1, resumeYears / Math.max(1, yearReq.years)));
  const domainRatio = input.company && containsTerm(resumeText, input.company) ? 0.9 : 0.6;
  const signalRatio = input.description.length > 500 ? 1 : input.description.length > 220 ? 0.75 : 0.45;

  let score = Math.round(
    35 * coverageRatio +
      30 * stackRatio +
      20 * (yearsGateStatus === "BLOCK" ? Math.min(0.35, seniorityRatio) : seniorityRatio) +
      10 * domainRatio +
      5 * signalRatio,
  );
  score = Math.max(0, Math.min(100, score));

  const unmatchedTech = jdTech.filter((tech) => !matchedTech.includes(tech));
  const topGaps = buildGapSignals({
    missingResponsibilities,
    unmatchedTech,
    yearsGateStatus,
    yearRequirement: yearReq.years,
    visaRequired: visaReq.required,
  });

  const evidence = topResponsibilities
    .slice(0, 3)
    .map((responsibility, index) => {
      const matchedBullet = resumeBullets.find((bullet) => bulletMatchesResponsibility(bullet, responsibility));
      return {
        label: `Responsibility ${index + 1}`,
        jd: responsibility,
        resume: matchedBullet ?? null,
      };
    });

  const recommendation = pickRecommendation(score, gateStatus);
  const baseAnalysis: JobFitAnalysisPayload = {
    score,
    gateStatus,
    recommendation,
    stackMatch: {
      matched: matchedTech.length,
      total: Math.max(1, jdTech.length),
    },
    topGaps,
    gates,
    evidence,
    generatedAt: new Date().toISOString(),
  };

  return maybeRefineWithGemini(input, baseAnalysis);
}
