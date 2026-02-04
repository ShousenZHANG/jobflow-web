import { buildTailorPrompts } from "./buildPrompt";
import { getPromptSkillRules } from "./promptSkills";
import { parseTailorModelOutput } from "./schema";
import { getAiPromptProfile } from "@/lib/server/aiPromptProfile";

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
};

type ParsedModelPayload = {
  cvSummary: string;
  cover: {
    paragraphOne: string;
    paragraphTwo: string;
    paragraphThree: string;
  };
};

const FALLBACK_MODEL = "gpt-4o-mini";

function truncate(text: string, max = 1600) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

function buildFallback(input: TailorInput): TailorResult {
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
  };
}

function normalizeText(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  const text = value.trim();
  return text || fallback;
}

function normalizeRuleArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const trimmed = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function tailorApplicationContent(
  input: TailorInput,
): Promise<TailorResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || FALLBACK_MODEL;
  const profile = input.userId ? await getAiPromptProfile(input.userId) : null;
  const skillRules = getPromptSkillRules(
    profile
      ? {
          cvRules: normalizeRuleArray(profile.cvRules),
          coverRules: normalizeRuleArray(profile.coverRules),
        }
      : undefined,
  );

  if (!apiKey) {
    return buildFallback(input);
  }

  const { systemPrompt, userPrompt } = buildTailorPrompts(skillRules, input);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let response: Response;
    try {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return buildFallback(input);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";
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
      return buildFallback(input);
    }

    const fallback = buildFallback(input);
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
    };
  } catch {
    return buildFallback(input);
  }
}
