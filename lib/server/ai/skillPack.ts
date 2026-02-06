import type { PromptSkillRuleSet } from "@/lib/server/ai/promptSkills";

type SkillPackContext = {
  resumeSnapshot: unknown;
  resumeSnapshotUpdatedAt: string;
};

const OUTPUT_SCHEMA_RESUME = {
  cvSummary: "string",
  latestExperience: {
    bullets: ["string"],
  },
  skillsAdditions: [
    {
      category: "string",
      items: ["string"],
    },
  ],
};

const OUTPUT_SCHEMA_COVER = {
  cover: {
    subject: "string (optional)",
    date: "string (optional)",
    salutation: "string (optional)",
    paragraphOne: "string",
    paragraphTwo: "string",
    paragraphThree: "string",
    closing: "string (optional)",
    signatureName: "string (optional)",
  },
};

function list(items: string[]) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function buildPromptFiles(rules: PromptSkillRuleSet, context?: SkillPackContext) {
  const hardRules = list(rules.hardConstraints);
  const cvRules = list(rules.cvRules);
  const coverRules = list(rules.coverRules);

  const resumePromptTemplate = [
    "Task: Generate role-tailored CV payload only.",
    "",
    "Required JSON shape:",
    JSON.stringify(OUTPUT_SCHEMA_RESUME, null, 2),
    "",
    "Hard Constraints:",
    hardRules,
    "",
    "CV Rules:",
    cvRules,
    "",
    "Job Input:",
    "- Job title: {{JOB_TITLE}}",
    "- Company: {{COMPANY}}",
    "- Job description: {{JOB_DESCRIPTION}}",
  ].join("\n");

  const coverPromptTemplate = [
    "Task: Generate role-tailored cover payload only.",
    "",
    "Required JSON shape:",
    JSON.stringify(OUTPUT_SCHEMA_COVER, null, 2),
    "",
    "Hard Constraints:",
    hardRules,
    "",
    "Cover Rules:",
    coverRules,
    "",
    "Job Input:",
    "- Job title: {{JOB_TITLE}}",
    "- Company: {{COMPANY}}",
    "- Job description: {{JOB_DESCRIPTION}}",
  ].join("\n");

  const files = [
    { name: "jobflow-skill-pack/prompts/resume-user-prompt-template.txt", content: resumePromptTemplate },
    { name: "jobflow-skill-pack/prompts/cover-user-prompt-template.txt", content: coverPromptTemplate },
  ];

  if (!context) return files;

  files.push({
    name: "jobflow-skill-pack/context/resume-snapshot.json",
    content: JSON.stringify(context.resumeSnapshot ?? {}, null, 2),
  });
  files.push({
    name: "jobflow-skill-pack/context/resume-snapshot-updated-at.txt",
    content: context.resumeSnapshotUpdatedAt,
  });

  return files;
}

export function buildGlobalSkillPackFiles(rules: PromptSkillRuleSet, context?: SkillPackContext) {
  const readme = `# Jobflow Global Skill Pack

This pack defines reusable rules and prompt templates for CV/Cover generation.
The default rule profile is recruiter-grade and enforces Google XYZ-style bullets for new experience points.

## How to use
1. Open your external AI chat tool.
2. Upload or paste files from this pack.
3. Replace placeholders in prompts with your current job data:
   - {{JOB_TITLE}}
   - {{COMPANY}}
   - {{JOB_DESCRIPTION}}
4. Use \`schema/output-schema.resume.json\` for CV or \`schema/output-schema.cover.json\` for cover.
5. Paste target JSON back into Jobflow via Generate CV / Generate Cover Letter.

## Notes
- This is a global template pack, not bound to one specific job.
- This pack may include your latest resume snapshot and snapshot timestamp file.
- Prompt generation for each job is done separately in Jobflow UI.
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
Resume target must follow \`schema/output-schema.resume.json\`.
Cover target must follow \`schema/output-schema.cover.json\`.
`;

  const exampleJson = JSON.stringify(
    {
      cvSummary:
        "Focused software engineer with product delivery ownership across end-to-end features and cross-functional collaboration.",
      latestExperience: {
        bullets: ["...", "..."],
      },
      skillsAdditions: [{ category: "Cloud", items: ["GCP"] }],
    },
    null,
    2,
  );

  const coverExampleJson = JSON.stringify(
    {
      cover: {
        subject: "Application for {{JOB_TITLE}}",
        date: "5 February 2026",
        salutation: "Hiring Team at {{COMPANY}}",
        paragraphOne: "I am applying for the {{JOB_TITLE}} role at {{COMPANY}}.",
        paragraphTwo:
          "My recent work aligns strongly with the responsibilities in your job description.",
        paragraphThree:
          "I am interested in {{COMPANY}} because of its mission and practical impact.",
        closing: "Yours sincerely,",
        signatureName: "{{CANDIDATE_NAME}}",
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
    ...buildPromptFiles(rules, context),
    {
      name: "jobflow-skill-pack/schema/output-schema.resume.json",
      content: JSON.stringify(OUTPUT_SCHEMA_RESUME, null, 2),
    },
    {
      name: "jobflow-skill-pack/schema/output-schema.cover.json",
      content: JSON.stringify(OUTPUT_SCHEMA_COVER, null, 2),
    },
    { name: "jobflow-skill-pack/examples/output.resume.example.json", content: exampleJson },
    { name: "jobflow-skill-pack/examples/output.cover.example.json", content: coverExampleJson },
  ];
}

