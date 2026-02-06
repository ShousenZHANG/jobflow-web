import { buildTailorPrompts } from "@/lib/server/ai/buildPrompt";
import type { PromptSkillRuleSet } from "@/lib/server/ai/promptSkills";

const OUTPUT_SCHEMA = {
  cvSummary: "string",
  cover: {
    paragraphOne: "string",
    paragraphTwo: "string",
    paragraphThree: "string",
  },
};

export function buildGlobalSkillPackFiles(rules: PromptSkillRuleSet) {
  const prompts = buildTailorPrompts(rules, {
    baseSummary: "{{BASE_SUMMARY}}",
    jobTitle: "{{JOB_TITLE}}",
    company: "{{COMPANY}}",
    description: "{{JOB_DESCRIPTION}}",
  });

  const list = (items: string[]) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");

  const readme = `# Jobflow Global Skill Pack

This pack defines reusable rules and prompt templates for CV/Cover generation.
The default rule profile is recruiter-grade and enforces Google XYZ-style bullets for new experience points.

## How to use
1. Open your external AI chat tool.
2. Upload or paste files from this pack.
3. Replace placeholders in prompts with your current job data:
   - {{BASE_SUMMARY}}
   - {{JOB_TITLE}}
   - {{COMPANY}}
   - {{JOB_DESCRIPTION}}
4. Request output in strict JSON shape from \`schema/output-schema.json\`.
5. Paste JSON back into Jobflow via Import CV JSON / Import Cover JSON.

## Notes
- This is a global template pack, not bound to one specific job.
- Rules version id: ${rules.id}
- Locale: ${rules.locale}
`;

  const skillMd = `# jobflow-tailor-skill

## Objective
Generate role-tailored CV summary and cover letter JSON that is safe for downstream PDF generation.

## When to Use
- You have a base resume summary and a target JD.
- You need recruiter-grade tailoring with strict JSON output.

## Inputs
- Base summary
- Job title
- Company
- Job description

## Hard Constraints
${list(rules.hardConstraints)}

## CV Rules
${list(rules.cvRules)}

## Cover Rules
${list(rules.coverRules)}

## Procedure
1. Read JD responsibilities and required skills.
2. Apply CV rules in order, preserving truthfulness and scope.
3. Apply cover rules in order, keeping exactly three paragraphs.
4. Validate output fields and JSON escaping.
5. Return JSON only.

## Quality Gates
- No markdown/code fence.
- No fabricated skills, employers, or metrics.
- JSON schema compliance is mandatory.

## Failure Policy
- If required context is missing, keep base summary unchanged.
- Keep cover letter concise and factual; avoid invented company details.

## Output
Must strictly follow \`schema/output-schema.json\`.
`;

  const exampleJson = JSON.stringify(
    {
      cvSummary:
        "Focused software engineer with product delivery ownership across end-to-end features and cross-functional collaboration.",
      cover: {
        paragraphOne: "I am applying for the {{JOB_TITLE}} role at {{COMPANY}}.",
        paragraphTwo:
          "My recent work aligns strongly with the responsibilities in your job description.",
        paragraphThree:
          "I am interested in {{COMPANY}} because of its mission and practical impact.",
      },
    },
    null,
    2,
  );

  return [
    { name: "jobflow-skill-pack/README.md", content: readme },
    { name: "jobflow-skill-pack/SKILL.md", content: skillMd },
    { name: "jobflow-skill-pack/rules/cv-rules.md", content: list(rules.cvRules) },
    { name: "jobflow-skill-pack/rules/cover-rules.md", content: list(rules.coverRules) },
    { name: "jobflow-skill-pack/rules/hard-constraints.md", content: list(rules.hardConstraints) },
    { name: "jobflow-skill-pack/prompts/system-prompt.txt", content: prompts.systemPrompt },
    { name: "jobflow-skill-pack/prompts/user-prompt-template.txt", content: prompts.userPrompt },
    {
      name: "jobflow-skill-pack/schema/output-schema.json",
      content: JSON.stringify(OUTPUT_SCHEMA, null, 2),
    },
    { name: "jobflow-skill-pack/examples/output.example.json", content: exampleJson },
  ];
}

