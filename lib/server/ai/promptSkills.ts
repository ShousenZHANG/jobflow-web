export type PromptSkillRuleSet = {
  id: string;
  locale: "en-AU";
  cvRules: string[];
  coverRules: string[];
  hardConstraints: string[];
};

const DEFAULT_RULES: PromptSkillRuleSet = {
  id: "jobflow-default-v1",
  locale: "en-AU",
  cvRules: [
    "Keep CV summary concise and directly relevant to the target role.",
    "Prefer concrete impact wording over generic claims.",
    "Do not invent skills, tools, metrics, or experience not present in provided context.",
    "Keep language plain, ATS-friendly, and professional.",
  ],
  coverRules: [
    "Generate exactly three short paragraphs with clear purpose.",
    "Paragraph 1: role/company fit. Paragraph 2: strongest JD alignment. Paragraph 3: motivation and collaboration style.",
    "Avoid exaggerated tone and avoid repetitive phrasing.",
    "Keep content application-ready and recruiter-friendly.",
  ],
  hardConstraints: [
    "Return JSON only, no markdown or code fences.",
    "Do not output LaTeX in model response.",
    "If confidence is low, stay conservative and reuse provided base summary style.",
  ],
};

export function getPromptSkillRules(): PromptSkillRuleSet {
  return DEFAULT_RULES;
}

