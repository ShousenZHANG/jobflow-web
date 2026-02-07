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
        '  "skillsAdditions": [',
        '    { "category": "string", "items": ["string"] }',
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
        "Top-3 Responsibility Coverage (must follow):",
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
          ? `Required additions: add ${coverage.requiredNewBulletsMin} to ${coverage.requiredNewBulletsMax} new bullets and put them first in responsibility order.`
          : "Required additions: add 0 new bullets (reorder existing bullets only).",
        "",
        "Execution checklist (must pass before you answer):",
        "1) Preserve every base latest-experience bullet text verbatim (no paraphrase).",
        "2) If Required additions > 0: add that many new bullets (within range), and place them first.",
        "3) Ensure each missing responsibility is covered by at least one final bullet.",
        "4) Resume target output must NOT include cover payload.",
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
        skillsAdditions: [
          {
            category: "string",
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
