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
  skillsFinal: [
    {
      label: "string",
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
    "Skills output policy:",
    "- Return skillsFinal as complete final skills list (not delta).",
    "- skillsFinal max 5 major categories, each as { label, items }.",
    "- Prefer existing categories from resume snapshot and merge related skills.",
    "- Order skillsFinal by JD priority and keep content factual (no fabrication).",
    "- Do NOT return skillsAdditions. Return skillsFinal only.",
    "- Markdown bold markers must be clean: **keyword** (no spaces inside markers).",
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

  const skillMd = `---
name: jobflow-tailoring
description: Generate recruiter-grade CV/Cover JSON from JD using strict contracts for Jobflow PDF rendering.
version: ${rules.id}
locale: ${rules.locale}
---

# Jobflow Tailoring Skill

## Trigger Conditions
Use this skill when:
- A job description is provided and a tailored CV or Cover Letter is needed.
- Output will be pasted back into Jobflow to render PDF.
- Accuracy, ATS safety, and deterministic JSON format are required.

## Required Inputs
- Job title
- Company
- Job description
- Resume snapshot context from \`context/resume-snapshot.json\`
- Target: \`resume\` or \`cover\`

## Hard Constraints
${list(rules.hardConstraints)}

## CV Rules
${list(rules.cvRules)}

## Cover Rules
${list(rules.coverRules)}

## Execution Procedure
1. Determine target first: \`resume\` or \`cover\`.
2. Read JD responsibilities and required skills in order of importance.
3. For \`resume\` target:
   - Produce \`cvSummary\`.
   - Produce complete \`latestExperience.bullets\` list (ordered final list).
   - Produce \`skillsFinal\` as complete final skills list (not delta).
   - Keep \`skillsFinal\` within 5 major categories and prioritize existing categories.
   - If responsibility gaps are found and evidence exists in base context, you may add up to 3 grounded bullets and put them first.
   - For added bullets, avoid duplicating the same primary tech stack already used by base latest-experience bullets; prioritize complementary JD-required technologies.
   - Preserve every base latest-experience bullet verbatim (order change is allowed, text rewrite is not).
4. For \`cover\` target:
   - Produce \`cover.paragraphOne/paragraphTwo/paragraphThree\`.
   - Optionally include \`subject/date/salutation/closing/signatureName\`.
5. Validate JSON shape against schema before final output.

## Output Contracts
- Resume output must match: \`schema/output-schema.resume.json\`
- Cover output must match: \`schema/output-schema.cover.json\`

## Verification Checklist
- Output is strict JSON only (no markdown/code fence).
- No fabricated facts, skills, employers, or metrics.
- Markdown bold markers are clean: **keyword** (no inner leading/trailing spaces).
- Resume output keeps every existing latest-experience bullet verbatim (reorder allowed; additions optional, max 3).
- Add grounded bullets only when evidence exists in base resume context; avoid fabrication.
- Added bullets should emphasize complementary JD-required tech rather than repeating already-covered primary stack.
- Skills output is \`skillsFinal\` (complete final list), JD-priority, and mapped to existing categories whenever possible.
- Never output \`skillsAdditions\`.
- Cover output is exactly three core paragraphs.
- JSON parses without repair.

## Failure and Recovery
- If JD/resume context is insufficient, keep summary conservative and avoid new claims.
- If schema cannot be satisfied, return minimal valid JSON with conservative content.
- Never switch target contract (resume must not include cover payload, cover must not include resume payload).
`;

  const exampleJson = JSON.stringify(
    {
      cvSummary:
        "Focused software engineer with product delivery ownership across end-to-end features and cross-functional collaboration.",
      latestExperience: {
        bullets: ["...", "..."],
      },
      skillsFinal: [{ label: "Cloud", items: ["GCP"] }],
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

