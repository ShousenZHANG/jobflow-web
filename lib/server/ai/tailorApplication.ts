import { buildTailorPrompts } from "./buildPrompt";
import { getPromptSkillRules } from "./promptSkills";
import { extractTopResponsibilities } from "./responsibilityCoverage";
import { getActivePromptSkillRulesForUser } from "@/lib/server/promptRuleTemplates";
import { parseTailorModelOutput } from "./schema";
import {
  callProvider,
  getDefaultModel,
  type AiProviderName,
  normalizeProviderModel,
} from "@/lib/server/ai/providers";

type TailorInput = {
  baseSummary: string;
  jobTitle: string;
  company: string;
  description: string;
  resumeSnapshot?: unknown;
  userId?: string;
};

type TailorResult = {
  cvSummary: string;
  cover: {
    paragraphOne: string;
    paragraphTwo: string;
    paragraphThree: string;
  };
  source: {
    cv: "ai" | "base";
    cover: "ai" | "fallback";
  };
  reason:
    | "ai_ok"
    | "missing_api_key"
    | "provider_error"
    | "parse_failed"
    | "exception";
};

type ParsedModelPayload = {
  cvSummary: string;
  cover: {
    paragraphOne: string;
    paragraphTwo: string;
    paragraphThree: string;
  };
};

const DEFAULT_PROVIDER: AiProviderName = "gemini";
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

function truncate(text: string, max = 1600) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

function buildFallback(input: TailorInput, reason: TailorResult["reason"]): TailorResult {
  const title = input.jobTitle || "the role";
  const company = input.company || "the company";
  const shortDesc = truncate(input.description.replace(/\s+/g, " ").trim(), 280);
  const baseSummary = input.baseSummary.trim();

  return {
    // Mainstream safe behavior: fallback never mutates user's stored summary.
    cvSummary: baseSummary,
    cover: {
      paragraphOne: `I am applying for the ${title} position at ${company}. The role aligns strongly with my recent engineering experience and the way I approach product delivery.`,
      paragraphTwo: shortDesc
        ? `Based on the job description, I can contribute quickly in the areas that matter most: ${shortDesc}`
        : `I can contribute quickly by combining strong implementation skills, clear communication, and reliable delivery practices.`,
      paragraphThree:
        "I am excited about the opportunity to bring a user-focused, execution-oriented mindset to your team and help ship meaningful outcomes.",
    },
    source: {
      cv: "base",
      cover: "fallback",
    },
    reason,
  };
}

function normalizeText(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  const text = value.trim();
  return text || fallback;
}

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

function buildCoverEvidence(input: TailorInput) {
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

export async function tailorApplicationContent(
  input: TailorInput,
): Promise<TailorResult> {
  try {
    const skillRules = input.userId
      ? await getActivePromptSkillRulesForUser(input.userId)
      : getPromptSkillRules();
    const defaultProviderConfig = {
      provider: DEFAULT_PROVIDER,
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || getDefaultModel(DEFAULT_PROVIDER),
    };
    const providerConfig = defaultProviderConfig;

    if (!providerConfig.apiKey) {
      return buildFallback(input, "missing_api_key");
    }

    const coverContext = input.resumeSnapshot ? buildCoverEvidence(input) : undefined;
    const { systemPrompt, userPrompt } = buildTailorPrompts(skillRules, {
      ...input,
      coverContext,
    });
    const normalizedModel = normalizeProviderModel(
      providerConfig.provider,
      providerConfig.model,
    );
    const defaultModel = getDefaultModel(providerConfig.provider);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let content = "";
    try {
      try {
        content = await callProvider(providerConfig.provider, {
          apiKey: providerConfig.apiKey,
          model: normalizedModel,
          systemPrompt,
          userPrompt,
          signal: controller.signal,
        });
      } catch (error) {
        // Retry once on provider/model errors with provider default model.
        if (normalizedModel !== defaultModel) {
          content = await callProvider(providerConfig.provider, {
            apiKey: providerConfig.apiKey,
            model: defaultModel,
            systemPrompt,
            userPrompt,
            signal: controller.signal,
          });
        } else {
          throw error;
        }
      }
    } finally {
      clearTimeout(timeout);
    }

    const parsedRaw = parseTailorModelOutput(content);
    const parsed: ParsedModelPayload | null = parsedRaw
      ? {
          cvSummary: normalizeText(parsedRaw.cvSummary),
          cover: {
            paragraphOne: normalizeText(parsedRaw.cover.paragraphOne),
            paragraphTwo: normalizeText(parsedRaw.cover.paragraphTwo),
            paragraphThree: normalizeText(parsedRaw.cover.paragraphThree),
          },
        }
      : null;
    if (!parsed) {
      return buildFallback(input, "parse_failed");
    }

    const fallback = buildFallback(input, "ai_ok");
    return {
      cvSummary: parsed.cvSummary || fallback.cvSummary,
      cover: {
        paragraphOne: parsed.cover.paragraphOne || fallback.cover.paragraphOne,
        paragraphTwo: parsed.cover.paragraphTwo || fallback.cover.paragraphTwo,
        paragraphThree: parsed.cover.paragraphThree || fallback.cover.paragraphThree,
      },
      source: {
        cv: parsed.cvSummary ? "ai" : "base",
        cover:
          parsed.cover.paragraphOne || parsed.cover.paragraphTwo || parsed.cover.paragraphThree
            ? "ai"
            : "fallback",
      },
      reason: "ai_ok",
    };
  } catch {
    return buildFallback(input, "provider_error");
  }
}
