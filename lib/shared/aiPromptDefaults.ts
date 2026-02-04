export const DEFAULT_CV_RULES = [
  "Rewrite summary to align with JD responsibilities while preserving the base summary length (+/-10% chars) and sentence count. Do not add claims beyond the base resume experience.",
  "Reorder the latest experience bullets to mirror the JD Responsibilities order.",
  "Do not rewrite existing bullets; only re-order them.",
  "If none of the top three JD responsibilities are matched by existing bullets, add up to three new bullets (max) only for the latest experience.",
  "New bullets must be grounded in the base resume context and keep similar length to existing bullets (+/-20%).",
  "Skills must cover all JD-required skills by only adding missing ones to the existing skills list (no removals, no fabrication).",
  "Prefer concrete, ATS-safe phrasing; avoid hype or vague adjectives.",
];

export const DEFAULT_COVER_RULES = [
  "Generate exactly three short paragraphs (no extra lines).",
  "Paragraph 1: state the role being applied for.",
  "Paragraph 2: explain how the candidate's experience matches the role responsibilities.",
  "Paragraph 3: explain why the candidate is interested in the company (use the company name, e.g., LEAP Dev).",
  "Avoid exaggerated tone and avoid repetitive phrasing.",
  "Keep content application-ready and recruiter-friendly.",
];
