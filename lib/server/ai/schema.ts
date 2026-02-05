import { z } from "zod";

export const TailorModelOutputSchema = z.object({
  cvSummary: z.string().trim().max(1400).optional().default(""),
  cover: z
    .object({
      paragraphOne: z.string().trim().max(1400).optional().default(""),
      paragraphTwo: z.string().trim().max(1400).optional().default(""),
      paragraphThree: z.string().trim().max(1400).optional().default(""),
    })
    .optional()
    .default({
      paragraphOne: "",
      paragraphTwo: "",
      paragraphThree: "",
    }),
});

export type TailorModelOutput = z.infer<typeof TailorModelOutputSchema>;

function toStringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function pickFirstText(obj: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = toStringValue(obj[key]).trim();
    if (value) return value;
  }
  return "";
}

function normalizeCover(value: unknown) {
  if (!value) {
    return { paragraphOne: "", paragraphTwo: "", paragraphThree: "" };
  }
  if (typeof value === "string") {
    const parts = value
      .split(/\n{2,}|\r\n\r\n|•|\n-/)
      .map((part) => part.trim())
      .filter(Boolean);
    return {
      paragraphOne: parts[0] ?? "",
      paragraphTwo: parts[1] ?? "",
      paragraphThree: parts[2] ?? "",
    };
  }
  if (Array.isArray(value)) {
    const parts = value.map((item) => toStringValue(item).trim()).filter(Boolean);
    return {
      paragraphOne: parts[0] ?? "",
      paragraphTwo: parts[1] ?? "",
      paragraphThree: parts[2] ?? "",
    };
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return {
      paragraphOne: pickFirstText(record, [
        "paragraphOne",
        "paragraph1",
        "p1",
        "intro",
        "opening",
      ]),
      paragraphTwo: pickFirstText(record, [
        "paragraphTwo",
        "paragraph2",
        "p2",
        "body",
        "experience",
      ]),
      paragraphThree: pickFirstText(record, [
        "paragraphThree",
        "paragraph3",
        "p3",
        "closing",
        "interest",
      ]),
    };
  }
  return { paragraphOne: "", paragraphTwo: "", paragraphThree: "" };
}

function normalizeTailorPayload(raw: unknown) {
  if (!raw || typeof raw !== "object") {
    return { cvSummary: "", cover: normalizeCover(undefined) };
  }
  const record = raw as Record<string, unknown>;
  const cvSummary = pickFirstText(record, [
    "cvSummary",
    "summary",
    "cv_summary",
    "resumeSummary",
    "resume_summary",
  ]);
  const cover = normalizeCover(
    record.cover ?? record.coverLetter ?? record.cover_letter ?? record.letter ?? record.coverletter,
  );
  return { cvSummary, cover };
}

function repairJsonText(input: string) {
  let text = input
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/\uFEFF/g, "")
    .trim();

  // Remove trailing commas before closing braces/brackets.
  text = text.replace(/,\s*([}\]])/g, "$1");

  // Replace unescaped newlines within JSON strings with \n
  let result = "";
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inString) {
      if (char === "\n") {
        result += "\\n";
        continue;
      }
      if (char === "\r") {
        continue;
      }
      if (char === "\"" && !escaped) {
        inString = false;
      }
      escaped = char === "\\" && !escaped;
      result += char;
    } else {
      if (char === "\"") {
        inString = true;
        escaped = false;
      }
      result += char;
    }
  }

  return result;
}

export function parseTailorModelOutput(raw: string): TailorModelOutput | null {
  const text = raw.trim();

  const tryParse = (value: string) => {
    const parsed = JSON.parse(value);
    const result = TailorModelOutputSchema.safeParse(parsed);
    if (result.success) return result.data;
    const normalized = normalizeTailorPayload(parsed);
    const normalizedResult = TailorModelOutputSchema.safeParse(normalized);
    return normalizedResult.success ? normalizedResult.data : null;
  };

  try {
    return tryParse(text);
  } catch {
    // continue
  }

  const withoutFences = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    return tryParse(withoutFences);
  } catch {
    // continue
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const slice = text.slice(start, end + 1);
    try {
      return tryParse(slice);
    } catch {
      // continue
    }
  }

  const repaired = repairJsonText(text);
  try {
    return tryParse(repaired);
  } catch {
    // continue
  }

  const repairedFences = repairJsonText(withoutFences);
  try {
    return tryParse(repairedFences);
  } catch {
    // continue
  }

  if (start >= 0 && end > start) {
    const repairedSlice = repairJsonText(text.slice(start, end + 1));
    try {
      return tryParse(repairedSlice);
    } catch {
      return null;
    }
  }

  return null;
}
