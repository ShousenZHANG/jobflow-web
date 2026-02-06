export const DEFAULT_CV_RULES = [
  "Act as a senior recruiter. Prioritize role-fit evidence, impact clarity, and ATS keyword alignment for the target role.",
  "Rewrite summary to align with JD responsibilities while preserving the base summary length (+/-10% chars) and sentence count.",
  "Do not add claims beyond the base resume experience. Keep every statement grounded in provided resume context.",
  "Reorder the latest experience bullets to mirror the JD Responsibilities order.",
  "Do not rewrite existing bullets. Reorder only unless new bullets are required by the next rule.",
  "If none of the top three JD responsibilities are matched by existing bullets, add up to three new bullets only for the latest experience.",
  "Any new bullet must follow Google XYZ style: achieved X by doing Y, resulting in Z (or equivalent qualitative outcome).",
  "Do not invent numeric metrics. If metrics are unavailable, use truthful qualitative outcomes (scope, speed, reliability, quality, or stakeholder impact).",
  "Keep any new bullet similar in length to nearby bullets (+/-20%) and consistent with the resume tone.",
  "Skills must cover JD-required skills by adding only missing items to existing skills (no removals, no fabrication).",
  "Prefer concrete, ATS-safe phrasing. Avoid hype, fluff, or repeated adjectives.",
];

export const DEFAULT_COVER_RULES = [
  "Generate exactly three short paragraphs (no extra lines).",
  "Paragraph 1: state the role being applied for.",
  "Paragraph 2: map the candidate's experience to the top JD responsibilities with concrete evidence from the resume only.",
  "Paragraph 3: explain why the candidate is interested in the company and role using the company name.",
  "If company-specific context is missing, use role-and-mission motivation without inventing facts.",
  "Avoid exaggerated tone, repetition, and generic filler.",
  "Keep wording recruiter-friendly, specific, and application-ready.",
];
