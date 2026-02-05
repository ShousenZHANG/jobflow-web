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

export function parseTailorModelOutput(raw: string): TailorModelOutput | null {
  const text = raw.trim();

  const tryParse = (value: string) => {
    const parsed = JSON.parse(value);
    const result = TailorModelOutputSchema.safeParse(parsed);
    if (!result.success) return null;
    return result.data;
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
      return null;
    }
  }

  return null;
}
