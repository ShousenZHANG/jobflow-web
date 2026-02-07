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
    "Read base summary from jobflow-skill-pack/context/resume-snapshot.json.summary.",
    "Output strict JSON only (no markdown, no code fences).",
    "Ensure valid JSON strings: use \\n for line breaks and escape quotes.",
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
        coverage.missingFromBase.length
          ? `Suggested additions: add 2 to ${coverage.requiredNewBulletsMax} grounded bullets for uncovered responsibilities using base resume evidence.`
          : "Suggested additions: no additions needed; reorder existing bullets only if helpful.",
        "",
        "Execution checklist:",
        "1) Preserve every base latest-experience bullet text verbatim (no paraphrase).",
        "2) If top-3 responsibilities are uncovered, add 2-3 grounded bullets (max 3) and place them before base bullets.",
        "2a) If direct exposure is missing, use truthful transferable experience and explicit willingness-to-learn phrasing (no fabrication).",
        "3) For every new bullet, bold 1-3 JD-critical keywords using **keyword**.",
        "3a) Keep markdown bold markers clean: **keyword** (no spaces inside markers).",
        "4) For added bullets, avoid repeating the same primary tech stack already present in base bullets; use complementary JD-required skills where possible.",
        "5) If evidence is insufficient, keep bullets conservative and avoid fabrication.",
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
        "6a) If direct exposure is missing, use truthful transferable evidence + explicit willingness to learn.",
        "7) cover.paragraphThree: why this role/company specifically, written in natural first-person candidate voice (specific, not generic).",
        "8) Bold JD-critical keywords naturally in paragraphs using **keyword** (clean markers only).",
        "9) cover.closing + cover.signatureName: include when possible.",
        "10) No fabrication, no recruiter voice, no generic filler; keep a strong candidate narrative.",
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
