import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";
import { buildTailorPrompts } from "@/lib/server/ai/buildPrompt";
import { getActivePromptSkillRulesForUser } from "@/lib/server/promptRuleTemplates";

export const runtime = "nodejs";

const PromptSchema = z.object({
  jobId: z.string().uuid(),
});

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

  const renderInput = mapResumeProfile(profile);
  const rules = await getActivePromptSkillRulesForUser(userId);
  const prompts = buildTailorPrompts(rules, {
    baseSummary: renderInput.summary,
    jobTitle: job.title,
    company: job.company || "the company",
    description: job.description || "",
  });

  return NextResponse.json({
    requestId,
    prompt: prompts,
    expectedJsonShape: {
      cvSummary: "string",
      cover: {
        paragraphOne: "string",
        paragraphTwo: "string",
        paragraphThree: "string",
      },
    },
  });
}
