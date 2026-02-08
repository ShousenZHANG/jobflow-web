import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { getActivePromptSkillRulesForUser } from "@/lib/server/promptRuleTemplates";
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";
import { computeTop3Coverage } from "@/lib/server/ai/responsibilityCoverage";

export const runtime = "nodejs";

const PromptSchema = z.object({
  jobId: z.string().uuid(),
  target: z.enum(["resume", "cover"]),
});

function formatRuleBlock(title: string, items: string[]) {
  return `${title}\n${items.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
}

export async function POST(req: Request) {
  const requestId = randomUUID();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Unauthorized" }, requestId },
      { status: 401 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = PromptSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_BODY",
          message: "Invalid request body",
          details: parsed.error.flatten(),
        },
        requestId,
      },
      { status: 400 },
    );
  }

  const job = await prisma.job.findFirst({
    where: {
      id: parsed.data.jobId,
      userId,
    },
    select: {
      title: true,
      company: true,
      description: true,
    },
  });

  if (!job) {
    return NextResponse.json(
      { error: { code: "JOB_NOT_FOUND", message: "Job not found" }, requestId },
      { status: 404 },
    );
  }

  const profile = await getResumeProfile(userId);
  if (!profile) {
    return NextResponse.json(
      {
        error: {
          code: "NO_PROFILE",
          message: "Create and save your master resume before generating prompt.",
        },
        requestId,
      },
      { status: 404 },
    );
  }

  const rules = await getActivePromptSkillRulesForUser(userId);
  const mappedProfile = mapResumeProfile(profile);
  const baseLatestBullets = mappedProfile.experiences[0]?.bullets ?? [];
  const coverage = computeTop3Coverage(job.description, baseLatestBullets);
  const systemPrompt = [
    `You are Jobflow's external AI tailoring assistant (${rules.locale}).`,
    "Use the imported skill package as the single source of truth.",
    "Read base resume context from jobflow-skill-pack/context/resume-snapshot.json (use fields like summary, experiences, skills).",
    "Output strict JSON only (no markdown, no code fences).",
    "Ensure valid JSON strings: use \\n for line breaks and escape quotes.",
    "Do not output file/path diagnostics or process notes.",
    formatRuleBlock("Hard Constraints:", rules.hardConstraints),
  ].join("\n\n");
  const isResumeTarget = parsed.data.target === "resume";
  const requiredJsonShape = isResumeTarget
    ? [
        "{",
        '  "cvSummary": "string",',
        '  "latestExperience": {',
        '    "bullets": ["string", "string"]',
        "  },",
        '  "skillsFinal": [',
        '    { "label": "string", "items": ["string"] }',
        "  ]",
        "}",
      ]
    : [
        "{",
        '  "cover": {',
        '    "candidateTitle": "string (optional)",',
        '    "subject": "string (optional)",',
        '    "date": "string (optional)",',
        '    "salutation": "string (optional)",',
        '    "paragraphOne": "string",',
        '    "paragraphTwo": "string",',
        '    "paragraphThree": "string",',
        '    "closing": "string (optional)",',
        '    "signatureName": "string (optional)"',
        "  }",
        "}",
      ];
  const targetTaskLine = isResumeTarget
    ? "Generate role-tailored CV summary using the imported skill pack."
    : "Generate role-tailored Cover Letter content using the imported skill pack.";
  const strictResumeBulletLine = isResumeTarget
    ? "Strict resume bullet rule: preserve every existing latest-experience bullet text verbatim; only reorder existing bullets and add new bullets per rules."
    : "";
  const targetRulesBlock = isResumeTarget
    ? formatRuleBlock("CV Skills Rules:", rules.cvRules)
    : formatRuleBlock("Cover Letter Skills Rules:", rules.coverRules);
  const resumeCoverageBlock = isResumeTarget
    ? [
        "Top-3 Responsibility Alignment (guidance):",
        ...(coverage.topResponsibilities.length
          ? coverage.topResponsibilities.map((item, index) => `${index + 1}. ${item}`)
          : ["1. (none parsed from JD)"]),
        "",
        "Base latest experience bullets (verbatim, reorder only):",
        ...(baseLatestBullets.length
          ? baseLatestBullets.map((item, index) => `${index + 1}. ${item}`)
          : ["1. (none found in base latest experience)"]),
        "",
        "Responsibilities missing from base latest bullets:",
        ...(coverage.missingFromBase.length
          ? coverage.missingFromBase.map((item, index) => `${index + 1}. ${item}`)
          : ["1. (none)"]),
        "",
        "Fallback responsibility pool (use when top-3 items require unsupported tech):",
        ...(coverage.fallbackResponsibilities.length
          ? coverage.fallbackResponsibilities.map((item, index) => `${index + 1}. ${item}`)
          : ["1. (none parsed or already covered)"]),
        "",
        coverage.missingFromBase.length
          ? `Suggested additions: target ${coverage.requiredNewBulletsMin}-${coverage.requiredNewBulletsMax} grounded new bullets for uncovered responsibilities when supported by base resume evidence.`
          : "Suggested additions: no additions required; reorder existing bullets only if helpful.",
        "",
        "Execution checklist:",
        "1) Preserve every base latest-experience bullet text verbatim (no paraphrase).",
        "2) Target additions count:",
        ...(coverage.missingFromBase.length
          ? [
              `2a) Add at least ${coverage.requiredNewBulletsMin} and at most ${coverage.requiredNewBulletsMax} new bullets when grounded evidence exists.`,
            ]
          : ["2a) No additions required when top-3 responsibilities are already covered."]),
        "2b) New bullets are allowed only when supported by explicit base resume evidence (latest experience / projects / skills).",
        "2c) First priority: align additions to uncovered top-3 responsibilities.",
        "2d) If top-3 needs tech you have not used, do not fabricate; use fallback responsibilities or adjacent proven technologies to complete the first 2 additions when possible.",
        "2e) Only when no grounded additions are possible at all, return reordered base bullets with zero additions.",
        "3) For every new bullet, bold 1-3 JD-critical keywords using **keyword**.",
        "3a) Keep markdown bold markers clean: **keyword** (no spaces inside markers).",
        "4) For added bullets, avoid repeating the same primary tech stack already present in base bullets; use complementary JD-required skills where possible.",
        "5) If evidence is insufficient, keep bullets conservative and avoid fabrication.",
        "5a) Keep new bullets consistent with latest-experience timeframe and realistic scope.",
        "6) Resume target output must NOT include cover payload.",
      ].join("\n")
    : "";
  const resumeSkillsPolicyBlock = isResumeTarget
    ? [
        "Skills output policy (must follow):",
        "1) Return skillsFinal as the complete final skills list (not delta).",
        "2) skillsFinal must contain max 5 major categories, each as { label, items }.",
        "3) Prioritize JD must-have skills first for ATS matching while staying grounded in base resume context.",
        "4) Prefer existing categories from resume snapshot and merge related items into the closest category.",
        "5) If a JD must-have has no grounded evidence in base context, use the closest truthful transferable skill; do not fabricate direct ownership.",
        "6) Order skillsFinal by JD relevance priority (most important first).",
        "7) Keep markdown bold markers clean: **keyword** (no inner spaces).",
        "8) Do NOT return skillsAdditions. Return skillsFinal only.",
        "9) Resume target JSON keys allowed: cvSummary, latestExperience, skillsFinal.",
      ].join("\n")
    : "";
  const coverStructureBlock = isResumeTarget
    ? ""
    : [
        "Cover output structure (must follow):",
        "1) cover.subject: concise role-specific subject line (prefer 'Application for <Role>' only; do NOT append candidate name).",
        "2) cover.candidateTitle (optional): set to role-aligned candidate title for the letter header.",
        "3) cover.date: current or provided date string.",
        "4) cover.salutation: provide only addressee text (e.g., 'Hiring Team at <Company>'), no leading 'Dear' and no trailing comma.",
        "5) cover.paragraphOne: application intent + role-fit summary from real resume facts (can be multi-sentence).",
        "6) cover.paragraphTwo: map to JD responsibilities in priority order with concrete evidence and outcomes.",
        "6b) Top-3 JD responsibilities must be covered first with explicit, grounded evidence points.",
        "6a) If direct evidence is missing, do not claim it; use only adjacent proven evidence that is factually supportable.",
        "7) cover.paragraphThree: why this role/company specifically, written in natural first-person candidate voice (specific, not generic).",
        "8) Bold all JD-critical keywords that appear in the cover output using **keyword** (clean markers only).",
        "8a) Keep bolding readable: emphasize critical terms without turning full sentences into bold text.",
        "9) cover.closing + cover.signatureName: include when possible.",
        "10) No fabrication, no recruiter voice, no generic filler; keep a strong candidate narrative.",
        "10a) Keep voice professional but natural, with subtle personality (lightly engaging but still formal).",
        "11) Cover target JSON keys allowed: cover only (no cvSummary/latestExperience/skillsFinal).",
      ].join("\n");

  const userPrompt = [
    "Task:",
    targetTaskLine,
    ...(strictResumeBulletLine ? ["", strictResumeBulletLine] : []),
    "",
    "Required JSON shape:",
    ...requiredJsonShape,
    "",
    ...(resumeCoverageBlock ? [resumeCoverageBlock, ""] : []),
    ...(resumeSkillsPolicyBlock ? [resumeSkillsPolicyBlock, ""] : []),
    ...(coverStructureBlock ? [coverStructureBlock, ""] : []),
    targetRulesBlock,
    "",
    "Job Input:",
    `- Job title: ${job.title}`,
    `- Company: ${job.company || "the company"}`,
    `- Job description: ${job.description || ""}`,
  ].join("\n");

  const expectedJsonShape = isResumeTarget
    ? {
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
      }
    : {
        cover: {
          candidateTitle: "string (optional)",
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

  return NextResponse.json({
    requestId,
    prompt: {
      systemPrompt,
      userPrompt,
    },
    promptMeta: {
      ruleSetId: rules.id,
      resumeSnapshotUpdatedAt: profile.updatedAt.toISOString(),
    },
    expectedJsonShape,
  });
}
