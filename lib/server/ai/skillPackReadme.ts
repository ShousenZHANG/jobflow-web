import {
  PROMPT_SCHEMA_VERSION,
  PROMPT_TEMPLATE_VERSION,
} from "@/lib/server/ai/promptContract";

// ---------------------------------------------------------------------------
// README
// ---------------------------------------------------------------------------

/**
 * Generate the README.md for the skill pack.
 */
export function buildReadme(version: string, locale: "en-AU" | "zh-CN"): string {
  const localeLabel = locale === "zh-CN" ? "zh-CN (Simplified Chinese)" : "en-AU (Australian English)";
  const p = "joblit-skills-v2";

  return `# Joblit Tailoring Skill Pack v${version}

> Production-grade AI skill pack for generating role-tailored CVs and cover letters.

- Prompt template version: ${PROMPT_TEMPLATE_VERSION}
- Output schema version: ${PROMPT_SCHEMA_VERSION}
- Locale: ${localeLabel}

## Quick Start

### 1. Import into your AI platform

**Claude (Skill Upload):**
1. Go to claude.ai > Settings > Skills > Upload Skill
2. Upload this entire ZIP file — Claude reads the root \`SKILL.md\` automatically
3. Start a new conversation and the skill is available

**Claude Projects (Knowledge Upload):**
1. Create a new Project > Project Knowledge > Add content
2. Upload priority files: \`SKILL.md\`, \`${p}/instructions/system.md\`, \`${p}/instructions/quality-gates.md\`
3. Upload \`${p}/context/resume-snapshot.json\` and relevant schema file
4. Note: Claude Projects has ~20 file / ~1MB limit. Upload the most important files first.

**Custom GPTs (OpenAI):**
1. GPT Builder > Configure > Knowledge
2. Upload: \`SKILL.md\`, instruction files, schema files, examples, and resume snapshot
3. Recommended: Use Structured Output with the schema JSON for reliable formatting

**Gemini (AI Studio):**
1. Open AI Studio > Create Prompt > click "System Instructions"
2. Paste content of \`${p}/instructions/system.md\` into System Instructions field
3. Upload \`SKILL.md\`, resume snapshot, and schema files as attachments
4. Note: Gemini web (gemini.google.com) does not persist attachments across sessions

### 2. Generate for each job

For each job application:
1. In Joblit Jobs page, select a job and click "Generate CV" or "Generate Cover Letter"
2. Copy the prompt from Step 2 of the dialog
3. Paste into your AI chat (Claude/GPT/Gemini with skill pack loaded)
4. Copy the JSON result

### 3. Import back to Joblit

1. In the Joblit dialog Step 3, paste the JSON output
2. Click "Generate CV PDF" or "Generate Cover PDF"
3. Joblit validates, renders LaTeX, and compiles to PDF automatically

## Pack Contents

| Path | Purpose |
|------|---------|
| \`SKILL.md\` | Root skill definition (for Claude Skill Upload) |
| \`${p}/instructions/system.md\` | System prompt with role, constraints, locale |
| \`${p}/instructions/resume-skill.md\` | Resume tailoring rules and execution flow |
| \`${p}/instructions/cover-skill.md\` | Cover letter rules and execution flow |
| \`${p}/instructions/quality-gates.md\` | 9+9 self-validation checks |
| \`${p}/rules/*.json\` | Categorized rules with priorities |
| \`${p}/schema/*.json\` | JSON Schema for output validation |
| \`${p}/examples/*.json\` | Realistic full output examples |
| \`${p}/examples/*.md\` | Annotated walkthroughs |
| \`${p}/context/resume-snapshot.json\` | Your resume data (source of truth) |
| \`${p}/prompts/*.template.md\` | Job-specific prompt templates |
| \`${p}/meta/manifest.json\` | Pack metadata and versioning |

## Tips

- Always use the latest resume snapshot. Stale snapshots produce lower-quality tailoring.
- Review the annotated walkthroughs in \`examples/\` to understand what good output looks like.
- If the AI output does not parse as valid JSON, use the "Auto-fix JSON" button in Joblit.
- For OpenAI: use Structured Output with the schema JSON for the most reliable formatting.
`;
}

// ---------------------------------------------------------------------------
// Platform Notes
// ---------------------------------------------------------------------------

/**
 * Generate platform-specific import notes.
 */
export function buildPlatformNotes(): string {
  const p = "joblit-skills-v2";
  return `# Platform Import Guide

## Claude (Recommended)

### Option A: Skill Upload (Simplest)
1. Go to claude.ai > Settings > Skills > Upload Skill
2. Upload this entire ZIP file
3. Claude reads the root SKILL.md automatically
4. Start any conversation — the skill activates when you paste a job prompt

### Option B: Claude Projects (Knowledge Upload)
1. Go to claude.ai > Projects > New Project
2. Project Knowledge > Add content > Upload files
3. Priority upload order (Claude Projects has ~20 file / ~1MB limit):
   - \`SKILL.md\` (root — skill definition)
   - \`${p}/instructions/system.md\` (system prompt)
   - \`${p}/instructions/quality-gates.md\` (self-validation)
   - \`${p}/context/resume-snapshot.json\` (your resume)
   - \`${p}/schema/resume-output.schema.json\` or \`cover-output.schema.json\`
   - \`${p}/examples/resume-output.full.json\` or \`cover-output.full.json\`
4. Start a new conversation, paste the job prompt from Joblit

---

## Custom GPTs (OpenAI)

### Setup
1. chat.openai.com > Explore GPTs > Create a GPT
2. Configure tab:
   - System instructions: paste content of \`${p}/instructions/system.md\`
   - Knowledge: upload SKILL.md, instruction files, schema files, examples, resume snapshot
3. **Recommended**: Enable Structured Output with the schema JSON for reliable formatting
   - Define a function using \`${p}/schema/resume-output.schema.json\` or \`cover-output.schema.json\`
   - This forces the model to output valid JSON matching the exact schema

### Per-Job Usage
1. Open your custom GPT
2. Paste the job prompt from Joblit (or fill the template from \`${p}/prompts/\`)
3. Copy the JSON output and import into Joblit

---

## Gemini (Google)

### Option A: AI Studio (Recommended)
1. Open AI Studio (aistudio.google.com) > Create Prompt
2. Click **"System Instructions"** button (top of prompt editor)
3. Paste the content of \`${p}/instructions/system.md\` into the System Instructions field
4. Upload SKILL.md, resume snapshot, and schema files as attachments
5. Send your job prompt as a user message

### Option B: Gemini Web (gemini.google.com)
1. Start a new conversation
2. Paste \`${p}/instructions/system.md\` as your first message
3. Upload resume snapshot and SKILL.md as attachments
4. **Note**: Gemini web does NOT persist attachments across sessions — you must re-upload each time

### Gemini API
- Set \`${p}/instructions/system.md\` content as the \`system_instruction\` parameter
- Include SKILL.md and resume-snapshot.json in the context
- Use \`responseMimeType: "application/json"\` for reliable JSON output

---

## Any LLM (Generic)

1. **System prompt**: Content of \`${p}/instructions/system.md\`
2. **Context**: Upload or paste SKILL.md + resume-snapshot.json
3. **User message**: Job prompt from Joblit (or fill template from \`${p}/prompts/\`)
4. **Validation**: Validate output JSON against the schema before importing
`;
}

// ---------------------------------------------------------------------------
// Changelog
// ---------------------------------------------------------------------------

/**
 * Generate changelog content.
 */
export function buildChangelog(): string {
  return `# Changelog

All notable changes to the Joblit Tailoring Skill Pack are documented here.

## v2.0.0 — 2026-03-31

### Added
- Full realistic examples for both resume and cover letter output (en-AU and zh-CN)
- Annotated walkthroughs explaining the reasoning behind each output field
- Platform-specific import guides for Claude Projects, Custom GPTs, Gemini, and generic LLMs
- JSON Schema validation files for both resume and cover letter output contracts
- Skill pack manifest with version tracking and content hashing
- Structured \`skillsFinal\` output replacing the previous \`skillsAdditions\` delta format
- Google XYZ-style bullet guidance for newly added experience items
- Responsibility coverage mapping for cover letter paragraph 2
- Quality gate checklist embedded in SKILL.md verification section

### Changed
- Output contract now uses \`skillsFinal\` (complete final list) instead of \`skillsAdditions\` (delta)
- Cover letter structure formalised into three semantic paragraphs with distinct purposes
- Bold keyword marking uses clean markdown (**keyword**) with no inner whitespace
- Prompt templates generated from the same builder used by the Joblit API

### Removed
- Deprecated \`skillsAdditions\` output field
- Legacy single-file prompt format

## v1.0.0 — 2026-01-15

### Added
- Initial skill pack with basic prompt templates
- Resume and cover letter generation support
- en-AU locale support
`;
}
