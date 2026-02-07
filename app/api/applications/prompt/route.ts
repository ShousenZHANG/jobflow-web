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
    ? "Strict resume bullet rule: preserve every existing latest-experience bullet text verbatim; only reorder existing bullets and add new bullets when required by rules."
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
          ? `Suggested additions: add ${coverage.requiredNewBulletsMin} to ${coverage.requiredNewBulletsMax} grounded bullets for uncovered responsibilities, then place them first in responsibility order.`
          : "Suggested additions: add 0 bullets (reorder existing bullets only).",
        "",
        "Execution checklist:",
        "1) Preserve every base latest-experience bullet text verbatim (no paraphrase).",
        "2) If responsibilities are uncovered and evidence exists in base resume context, add 2-3 new bullets and place them first.",
        "3) For every new bullet, bold 1-3 JD-critical keywords using **keyword**.",
        "3a) Keep markdown bold markers clean: **keyword** (no spaces inside markers).",
        "4) If evidence is insufficient, keep bullets conservative and avoid fabrication.",
        "5) Resume target output must NOT include cover payload.",
      ].join("\n")
    : "";
  const resumeSkillsPolicyBlock = isResumeTarget
    ? [
        "Skills output policy (must follow):",
        "1) Return skillsFinal as the complete final skills list (not delta).",
        "2) skillsFinal must contain max 5 major categories, each as { label, items }.",
        "3) Prioritize JD-critical skills first while staying grounded in base resume context.",
        "4) Prefer existing categories from resume snapshot and merge related items into the closest category.",
        "5) Order skillsFinal by JD relevance priority (most important first).",
        "6) Keep markdown bold markers clean: **keyword** (no inner spaces).",
      ].join("\n")
    : "";

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
