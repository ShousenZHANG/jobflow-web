import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";
import { renderResumeTex } from "@/lib/server/latex/renderResume";
import { renderCoverLetterTex } from "@/lib/server/latex/renderCoverLetter";
import { LatexRenderError, compileLatexToPdf } from "@/lib/server/latex/compilePdf";
import { parseTailorModelOutput } from "@/lib/server/ai/schema";
import { getActivePromptSkillRulesForUser } from "@/lib/server/promptRuleTemplates";

export const runtime = "nodejs";

const ManualGenerateSchema = z.object({
  jobId: z.string().uuid(),
  target: z.enum(["resume", "cover"]),
  modelOutput: z.string().min(20),
  promptMeta: z
    .object({
      ruleSetId: z.string().min(1),
      resumeSnapshotUpdatedAt: z.string().min(1),
    })
    .optional(),
});

function toSafeFileSegment(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "document";
}

function parseFilename(res: "resume" | "cover" | "cover-letter", candidate: string, role: string) {
  const today = new Date().toISOString().slice(0, 10);
  return `${res}-${toSafeFileSegment(candidate)}-${toSafeFileSegment(role)}-${today}.pdf`;
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
  const parsed = ManualGenerateSchema.safeParse(json);
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
      id: true,
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
          message: "Create and save your master resume before importing AI content.",
        },
        requestId,
      },
      { status: 404 },
    );
  }

  if (parsed.data.promptMeta) {
    const activeRules = await getActivePromptSkillRulesForUser(userId);
    const ruleSetMatches = parsed.data.promptMeta.ruleSetId === activeRules.id;
    const snapshotMatches =
      parsed.data.promptMeta.resumeSnapshotUpdatedAt === profile.updatedAt.toISOString();
    if (!ruleSetMatches || !snapshotMatches) {
      return NextResponse.json(
        {
          error: {
            code: "PROMPT_META_MISMATCH",
            message:
              "Prompt/skill pack is out of date. Re-download skill pack and copy a fresh prompt for this job.",
            details: {
              expected: {
                ruleSetId: activeRules.id,
                resumeSnapshotUpdatedAt: profile.updatedAt.toISOString(),
              },
              received: parsed.data.promptMeta,
            },
          },
          requestId,
        },
        { status: 409 },
      );
    }
  }

  const tailored = parseTailorModelOutput(parsed.data.modelOutput);
  if (!tailored) {
    return NextResponse.json(
      {
        error: {
          code: "PARSE_FAILED",
          message: "Unable to parse model output. Ensure valid JSON with cvSummary and cover paragraphs.",
        },
        requestId,
      },
      { status: 400 },
    );
  }

  const renderInput = mapResumeProfile(profile);

  let pdf: Buffer;
  let filename: string;

  try {
    if (parsed.data.target === "resume") {
      const cvSummary = tailored.cvSummary.trim();
      if (!cvSummary) {
        return NextResponse.json(
          {
            error: {
              code: "MISSING_CV_SUMMARY",
              message: "cvSummary is required when target is resume.",
            },
            requestId,
          },
          { status: 400 },
        );
      }
      const tex = renderResumeTex({
        ...renderInput,
        summary: cvSummary,
      });
      pdf = await compileLatexToPdf(tex);
      filename = parseFilename("resume", renderInput.candidate.name, job.title);
    } else {
      const p1 = tailored.cover.paragraphOne.trim();
      const p2 = tailored.cover.paragraphTwo.trim();
      const p3 = tailored.cover.paragraphThree.trim();
      if (!p1 || !p2 || !p3) {
        return NextResponse.json(
          {
            error: {
              code: "MISSING_COVER_PARAGRAPHS",
              message: "paragraphOne, paragraphTwo and paragraphThree are all required for cover.",
            },
            requestId,
          },
          { status: 400 },
        );
      }
      const coverTex = renderCoverLetterTex({
        candidate: {
          name: renderInput.candidate.name,
          title: renderInput.candidate.title,
          phone: renderInput.candidate.phone,
          email: renderInput.candidate.email,
          linkedinUrl: renderInput.candidate.linkedinUrl,
          linkedinText: renderInput.candidate.linkedinText,
        },
        company: job.company || "the company",
        role: job.title,
        paragraphOne: p1,
        paragraphTwo: p2,
        paragraphThree: p3,
      });
      pdf = await compileLatexToPdf(coverTex);
      filename = parseFilename("cover-letter", renderInput.candidate.name, job.title);
    }
  } catch (err) {
    if (err instanceof LatexRenderError) {
      return NextResponse.json(
        {
          error: {
            code: err.code,
            message: err.message,
            details: err.details,
          },
          requestId,
        },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { error: { code: "UNKNOWN_ERROR", message: "Unknown render error" }, requestId },
      { status: 500 },
    );
  }

  const application = await prisma.application.upsert({
    where: {
      userId_jobId: {
        userId,
        jobId: job.id,
      },
    },
    create: {
      userId,
      jobId: job.id,
      resumeProfileId: profile.id,
      company: job.company,
      role: job.title,
    },
    update: {
      resumeProfileId: profile.id,
      company: job.company,
      role: job.title,
    },
    select: {
      id: true,
    },
  });

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
      "x-application-id": application.id,
      "x-request-id": requestId,
      "x-tailor-cv-source": parsed.data.target === "resume" ? "manual_import" : "base",
      "x-tailor-cover-source": parsed.data.target === "cover" ? "manual_import" : "fallback",
      "x-tailor-reason": "manual_import_ok",
    },
  });
}
