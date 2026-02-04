type TailorInput = {
  baseSummary: string;
  jobTitle: string;
  company: string;
  description: string;
};

type TailorResult = {
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
    cvSummary: baseSummary
      ? `${baseSummary}\n\nFocused on ${title} opportunities at ${company}, with emphasis on direct impact, delivery quality, and cross-functional collaboration.`
      : `Focused on ${title} opportunities at ${company}, with emphasis on direct impact, delivery quality, and cross-functional collaboration.`,
    cover: {
      paragraphOne: `I am applying for the ${title} position at ${company}. The role aligns strongly with my recent engineering experience and the way I approach product delivery.`,
      paragraphTwo: shortDesc
        ? `Based on the job description, I can contribute quickly in the areas that matter most: ${shortDesc}`
        : `I can contribute quickly by combining strong implementation skills, clear communication, and reliable delivery practices.`,
      paragraphThree:
        "I am excited about the opportunity to bring a user-focused, execution-oriented mindset to your team and help ship meaningful outcomes.",
    },
  };
}

function normalizeText(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  const text = value.trim();
  return text || fallback;
}

function parseModelPayload(raw: string): TailorResult | null {
  try {
    const parsed = JSON.parse(raw) as {
      cvSummary?: unknown;
      cover?: {
        paragraphOne?: unknown;
        paragraphTwo?: unknown;
        paragraphThree?: unknown;
      };
    };

    const cvSummary = normalizeText(parsed.cvSummary);
    const paragraphOne = normalizeText(parsed.cover?.paragraphOne);
    const paragraphTwo = normalizeText(parsed.cover?.paragraphTwo);
    const paragraphThree = normalizeText(parsed.cover?.paragraphThree);

    if (!cvSummary && !paragraphOne && !paragraphTwo && !paragraphThree) {
      return null;
    }

    return {
      cvSummary,
      cover: {
        paragraphOne,
        paragraphTwo,
        paragraphThree,
      },
    };
  } catch {
    return null;
  }
}

export async function tailorApplicationContent(input: TailorInput): Promise<TailorResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || FALLBACK_MODEL;

  if (!apiKey) {
    return buildFallback(input);
  }

  const systemPrompt =
    "You are a resume and cover-letter assistant. Return strict JSON only.";
  const userPrompt = `
Generate tailored CV summary and cover letter paragraphs.

Return JSON exactly in this shape:
{
  "cvSummary": "string",
  "cover": {
    "paragraphOne": "string",
    "paragraphTwo": "string",
    "paragraphThree": "string"
  }
}

Constraints:
- Keep each paragraph concise and professional.
- No markdown.
- No LaTeX.
- Reuse candidate base summary style but tailor to role.

Input:
- Base summary: ${truncate(input.baseSummary, 1200)}
- Job title: ${input.jobTitle}
- Company: ${input.company}
- Job description: ${truncate(input.description, 2400)}
`.trim();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
    });

    if (!response.ok) {
      return buildFallback(input);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    const parsed = parseModelPayload(content);
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
    };
  } catch {
    return buildFallback(input);
  }
}

