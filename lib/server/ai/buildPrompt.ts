import type { PromptSkillRuleSet } from "./promptSkills";

export type TailorPromptInput = {
  baseSummary: string;
  jobTitle: string;
  company: string;
  description: string;
};

function truncate(text: string, max = 1600) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

function formatRules(title: string, rules: string[]) {
  const body = rules.map((rule, idx) => `${idx + 1}. ${rule}`).join("\n");
  return `${title}\n${body}`;
}

export function buildTailorPrompts(
  rules: PromptSkillRuleSet,
  input: TailorPromptInput,
) {
  const systemPrompt = [
    `You are Jobflow's resume tailoring assistant (${rules.locale}) and a senior recruiter-level writing reviewer.`,
    "Output strict JSON only (no markdown, no code fences).",
    "Ensure valid JSON strings: use \\n for line breaks and escape quotes.",
    formatRules("Hard Constraints:", rules.hardConstraints),
  ].join("\n\n");

  const userPrompt = `
Task:
Generate role-tailored CV summary and Cover Letter content.

Required JSON shape:
{
  "cvSummary": "string",
  "cover": {
    "subject": "string (optional)",
    "date": "string (optional)",
    "salutation": "string (optional)",
    "paragraphOne": "string",
    "paragraphTwo": "string",
    "paragraphThree": "string",
    "closing": "string (optional)",
    "signatureName": "string (optional)"
  }
}

${formatRules("CV Skills Rules:", rules.cvRules)}

${formatRules("Cover Letter Skills Rules:", rules.coverRules)}

Cover structure checklist:
1) paragraphOne = role application intent + concise fit summary from real resume facts.
2) paragraphTwo = JD mapping with concrete evidence; if missing direct exposure, use transferable skills and willingness to learn.
3) paragraphThree = role/company motivation in natural first-person candidate voice.
4) Avoid fabrication and generic filler.

Input:
- Base summary: ${truncate(input.baseSummary, 1200)}
- Job title: ${input.jobTitle}
- Company: ${input.company}
- Job description: ${truncate(input.description, 2400)}
`.trim();

  return { systemPrompt, userPrompt };
}
