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
  try {
    const parsed = JSON.parse(raw);
    const result = TailorModelOutputSchema.safeParse(parsed);
    if (!result.success) return null;
    return result.data;
  } catch {
    return null;
  }
}

