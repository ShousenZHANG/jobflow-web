import type { PromptSkillRuleSet } from "./promptSkills";

export type TailorPromptInput = {
  baseSummary: string;
  jobTitle: string;
  company: string;
  description: string;
  coverContext?: {
    topResponsibilities: string[];
    matchedEvidence: string[];
    resumeHighlights: string[];
  };
};

function truncate(text: string, max = 1600) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

function formatRules(title: string, rules: string[]) {
  const body = rules.map((rule, idx) => `${idx + 1}. ${rule}`).join("\n");
  return `${title}\n${body}`;
}

function formatList(title: string, items: string[]) {
  if (!items.length) return `${title}\n1. (none)`;
  return `${title}\n${items.map((item, idx) => `${idx + 1}. ${item}`).join("\n")}`;
}

export function buildTailorPrompts(
  rules: PromptSkillRuleSet,
  input: TailorPromptInput,
) {
  const systemPrompt = [
    `You are Jobflow's resume tailoring assistant (${rules.locale}) and a senior recruiter-level writing reviewer.`,
    "Output strict JSON only (no code fences, no markdown prose outside JSON).",
    "Markdown bold markers inside JSON string values are allowed when requested.",
    "Ensure valid JSON strings: use \\n for line breaks and escape quotes.",
    formatRules("Hard Constraints:", rules.hardConstraints),
  ].join("\n\n");

  const coverEvidenceBlock = input.coverContext
    ? `
${formatList(
  "Top JD responsibilities (priority order):",
  input.coverContext.topResponsibilities,
)}

${formatList(
  "Matched resume evidence (highest relevance):",
  input.coverContext.matchedEvidence,
)}

${formatList(
  "Additional resume highlights:",
  input.coverContext.resumeHighlights,
)}
`
    : "";

  const userPrompt = `
Task:
Generate role-tailored CV summary and Cover Letter content.

Required JSON shape:
{
  "cvSummary": "string",
  "cover": {
    "candidateTitle": "string (optional)",
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

CV summary checklist:
1) In cvSummary, bold JD-critical keywords using clean markdown **keyword** markers.
2) Keep bolding readable: highlight critical terms, avoid bolding full sentences.

${formatRules("Cover Letter Skills Rules:", rules.coverRules)}

Cover structure checklist:
1) subject = role-focused only (prefer 'Application for <Role>'); do not append candidate name.
2) salutation = addressee text only (no leading 'Dear', no trailing comma).
2a) candidateTitle should align with the JD role title (not a fixed generic title).
3) paragraphOne = role application intent + role-fit summary from real resume facts (can be multi-sentence).
4) paragraphTwo = JD mapping in priority order with concrete evidence and delivery outcomes.
4a) if direct exposure is missing, use truthful transferable skills + explicit willingness to learn.
5) paragraphThree = role/company motivation in natural first-person candidate voice (specific, non-generic).
6) Bold JD-critical terms naturally using clean markdown **keyword** markers.
7) Keep markdown bold markers clean: **keyword** (no spaces inside markers).
8) Use strong candidate narrative quality; avoid recruiter boilerplate.
9) Avoid fabrication and generic filler.
10) Ground cover claims in provided resume evidence pack; do not claim tools/experience outside evidence.
11) Before final output, run an internal 2-stage process: (a) create a responsibility-evidence plan, (b) draft cover text from that plan.
12) After drafting, perform exactly one internal rewrite pass to fix any weak responsibility mapping, weak evidence grounding, or generic motivation.
13) en-AU tone target: concise, grounded, professional; avoid US-style exaggeration and avoid generic recruiter phrasing.
14) Target total words for paragraphOne+paragraphTwo+paragraphThree: 280-360 words.

${coverEvidenceBlock}

Input:
- Base summary: ${truncate(input.baseSummary, 1200)}
- Job title: ${input.jobTitle}
- Company: ${input.company}
- Job description: ${truncate(input.description, 2400)}
`.trim();

  return { systemPrompt, userPrompt };
}
