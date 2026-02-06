import { buildTailorPrompts } from "./buildPrompt";
import { getPromptSkillRules } from "./promptSkills";
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

export async function tailorApplicationContent(
  input: TailorInput,
): Promise<TailorResult> {
  try {
    const skillRules = getPromptSkillRules();
    const defaultProviderConfig = {
      provider: DEFAULT_PROVIDER,
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || getDefaultModel(DEFAULT_PROVIDER),
    };
    const providerConfig = defaultProviderConfig;

    if (!providerConfig.apiKey) {
      return buildFallback(input, "missing_api_key");
    }

    const { systemPrompt, userPrompt } = buildTailorPrompts(skillRules, input);
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
