import { NextResponse } from "next/server";
import { requireSession, UnauthorizedError } from "@/lib/server/auth/requireSession";
import type { SessionContext } from "@/lib/server/auth/requireSession";
import { unauthorizedError } from "@/lib/server/api/errorResponse";
import { prisma } from "@/lib/server/prisma";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";
import { escapeLatexWithBold } from "@/lib/server/latex/escapeLatex";
import { renderResumeTex } from "@/lib/server/latex/renderResume";
import { renderCoverLetterTex } from "@/lib/server/latex/renderCoverLetter";
import { LatexRenderError, compileLatexToPdf } from "@/lib/server/latex/compilePdf";
import { getActivePromptSkillRulesForUser } from "@/lib/server/promptRuleTemplates";
import { del, put } from "@vercel/blob";
import { buildPdfFilename } from "@/lib/server/files/pdfFilename";
import {
  APPLICATION_ARTIFACT_OVERWRITE_OPTIONS,
  buildApplicationArtifactBlobPath,
} from "@/lib/server/files/applicationArtifactBlob";
import { buildCoverEvidenceContext } from "@/lib/server/ai/coverContext";
import { evaluateCoverQuality } from "@/lib/server/ai/coverQuality";
import { buildPromptMeta } from "@/lib/server/ai/promptContract";
import {
  ManualGenerateSchema,
  parseResumeManualOutput,
  parseCoverManualOutput,
  mergeSkillAdditions,
  sanitizeSkillGroups,
  normalizeBulletForCompare,
  normalizeMarkdownBold,
  canonicalizeLatestBullets,
  isGroundedAddedBullet,
  isNonRedundantAddedBullet,
  getLatestRawBullets,
} from "@/lib/server/applications/manualImportParser";

export const runtime = "nodejs";

function parseFilename(candidate: string, role: string, target: "resume" | "cover") {
  return target === "cover"
    ? buildPdfFilename(candidate, role, "Cover Letter")
    : buildPdfFilename(candidate, role);
}

export async function POST(req: Request) {
  let ctx: SessionContext;
  try {
    ctx = await requireSession();
  } catch (err) {
    if (err instanceof UnauthorizedError) return unauthorizedError();
    throw err;
  }
  const { userId, requestId } = ctx;

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
    where: { id: parsed.data.jobId, userId },
    select: { id: true, title: true, company: true, description: true, market: true },
  });

  if (!job) {
    return NextResponse.json(
      { error: { code: "JOB_NOT_FOUND", message: "Job not found" }, requestId },
      { status: 404 },
    );
  }

  const profileLocale = job.market === "CN" ? "zh-CN" : "en-AU";
  const profile = await getResumeProfile(userId, { locale: profileLocale });
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

  const existingApplication = await prisma.application.findUnique({
    where: { userId_jobId: { userId, jobId: job.id } },
    select: { resumePdfUrl: true, coverPdfUrl: true },
  });

  if (parsed.data.promptMeta) {
    const activeRules = await getActivePromptSkillRulesForUser(userId);
    const expectedPromptMeta = buildPromptMeta({
      target: parsed.data.target,
      ruleSetId: activeRules.id,
      resumeSnapshotUpdatedAt: profile.updatedAt.toISOString(),
    });
    const ruleSetMatches = parsed.data.promptMeta.ruleSetId === expectedPromptMeta.ruleSetId;
    const snapshotMatches =
      parsed.data.promptMeta.resumeSnapshotUpdatedAt === expectedPromptMeta.resumeSnapshotUpdatedAt;
    const templateVersionMatches =
      !parsed.data.promptMeta.promptTemplateVersion ||
      parsed.data.promptMeta.promptTemplateVersion === expectedPromptMeta.promptTemplateVersion;
    const schemaVersionMatches =
      !parsed.data.promptMeta.schemaVersion ||
      parsed.data.promptMeta.schemaVersion === expectedPromptMeta.schemaVersion;
    const promptHashMatches =
      !parsed.data.promptMeta.promptHash ||
      parsed.data.promptMeta.promptHash === expectedPromptMeta.promptHash;

    if (
      !ruleSetMatches ||
      !snapshotMatches ||
      !templateVersionMatches ||
      !schemaVersionMatches ||
      !promptHashMatches
    ) {
      return NextResponse.json(
        {
          error: {
            code: "PROMPT_META_MISMATCH",
            message:
              "Prompt/skill pack is out of date. Re-download skill pack and copy a fresh prompt for this job.",
            details: { expected: expectedPromptMeta, received: parsed.data.promptMeta },
          },
          requestId,
        },
        { status: 409 },
      );
    }
  }

  const renderInput = mapResumeProfile(profile);

  let pdf: Buffer;
  let filename: string;
  let coverQualityGate = "pass";
  let coverQualityIssueCount = 0;
  try {
    if (parsed.data.target === "resume") {
      const result = buildResumePdf(parsed.data.modelOutput, renderInput, profile, job.title, requestId);
      if ("error" in result) return result.error;
      pdf = await compileLatexToPdf(result.tex);
      filename = result.filename;
    } else {
      const result = buildCoverPdf(parsed.data.modelOutput, renderInput, profile, job, requestId);
      if ("error" in result) return result.error;
      pdf = await compileLatexToPdf(result.tex);
      filename = result.filename;
      coverQualityGate = result.qualityGate;
      coverQualityIssueCount = result.qualityIssueCount;
    }
  } catch (err) {
    if (err instanceof LatexRenderError) {
      return NextResponse.json(
        { error: { code: err.code, message: err.message, details: err.details }, requestId },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { error: { code: "UNKNOWN_ERROR", message: "Unknown render error" }, requestId },
      { status: 500 },
    );
  }

  // Persist PDF to Blob storage if configured
  let persistedResumePdfUrl: string | null = null;
  let persistedCoverPdfUrl: string | null = null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(
        buildApplicationArtifactBlobPath({ userId, jobId: job.id, target: parsed.data.target }),
        pdf,
        {
          access: "public",
          contentType: "application/pdf",
          token: process.env.BLOB_READ_WRITE_TOKEN,
          ...APPLICATION_ARTIFACT_OVERWRITE_OPTIONS,
        },
      );
      if (parsed.data.target === "resume") {
        persistedResumePdfUrl = blob.url;
      } else {
        persistedCoverPdfUrl = blob.url;
      }
    } catch {
      // Keep generation successful even if persistence fails.
    }
  }

  const application = await prisma.application.upsert({
    where: { userId_jobId: { userId, jobId: job.id } },
    create: {
      userId,
      jobId: job.id,
      resumeProfileId: profile.id,
      company: job.company,
      role: job.title,
      ...(parsed.data.target === "resume" && persistedResumePdfUrl
        ? { resumePdfUrl: persistedResumePdfUrl, resumePdfName: filename }
        : {}),
      ...(parsed.data.target === "cover" && persistedCoverPdfUrl
        ? { coverPdfUrl: persistedCoverPdfUrl }
        : {}),
    },
    update: {
      resumeProfileId: profile.id,
      company: job.company,
      role: job.title,
      ...(parsed.data.target === "resume" && persistedResumePdfUrl
        ? { resumePdfUrl: persistedResumePdfUrl, resumePdfName: filename }
        : {}),
      ...(parsed.data.target === "cover" && persistedCoverPdfUrl
        ? { coverPdfUrl: persistedCoverPdfUrl }
        : {}),
    },
    select: { id: true },
  });

  // Clean up old blob if URL changed
  const previousArtifactUrl =
    parsed.data.target === "resume"
      ? existingApplication?.resumePdfUrl ?? null
      : existingApplication?.coverPdfUrl ?? null;
  const currentArtifactUrl =
    parsed.data.target === "resume" ? persistedResumePdfUrl : persistedCoverPdfUrl;
  if (
    process.env.BLOB_READ_WRITE_TOKEN &&
    previousArtifactUrl &&
    currentArtifactUrl &&
    previousArtifactUrl !== currentArtifactUrl
  ) {
    await del(previousArtifactUrl, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(() => undefined);
  }

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
      "x-cover-quality-gate": coverQualityGate,
      "x-cover-quality-issue-count": String(coverQualityIssueCount),
    },
  });
}

// ── Helper: Build resume TeX from model output ──

function buildResumePdf(
  modelOutput: string,
  renderInput: ReturnType<typeof mapResumeProfile>,
  profile: { id: string; updatedAt: Date } & Record<string, unknown>,
  jobTitle: string,
  requestId: string,
): { tex: string; filename: string } | { error: NextResponse } {
  const resumeParsed = parseResumeManualOutput(modelOutput);
  if (!resumeParsed.data) {
    return {
      error: NextResponse.json(
        {
          error: {
            code: "PARSE_FAILED",
            message:
              "Unable to parse model output. Resume JSON must include cvSummary and latestExperience.bullets (skillsFinal preferred).",
            details: resumeParsed.issues.slice(0, 8),
          },
          requestId,
        },
        { status: 400 },
      ),
    };
  }

  const resumeOutput = resumeParsed.data;
  const cvSummary = resumeOutput.cvSummary.trim();
  const baseLatest = renderInput.experiences[0];
  const baseLatestRawBullets = getLatestRawBullets(profile);
  const baseBulletsForMatch =
    baseLatestRawBullets.length > 0
      ? baseLatestRawBullets
      : baseLatest?.bullets.map((item) => item.trim()).filter(Boolean) ?? [];
  const incomingBullets = resumeOutput.latestExperience?.bullets;
  let finalLatestBullets = incomingBullets ?? [];

  if (baseLatest && incomingBullets) {
    const maxAllowed = Math.max(baseBulletsForMatch.length + 3, 3);
    if (incomingBullets.length > maxAllowed) {
      return {
        error: NextResponse.json(
          {
            error: {
              code: "INVALID_LATEST_EXPERIENCE_BULLETS",
              message: `latestExperience.bullets exceeds allowed size (${maxAllowed}).`,
            },
            requestId,
          },
          { status: 400 },
        ),
      };
    }

    const { canonicalBullets, addedBullets } = canonicalizeLatestBullets(
      baseBulletsForMatch,
      incomingBullets,
    );
    const addedKeys = new Set(addedBullets.map(normalizeBulletForCompare));
    const allowedAddedKeys = new Set<string>();
    const acceptedAddedBullets: string[] = [];
    for (const bullet of addedBullets) {
      if (!isGroundedAddedBullet(bullet, baseBulletsForMatch)) continue;
      if (!isNonRedundantAddedBullet(bullet, baseBulletsForMatch, acceptedAddedBullets)) continue;
      acceptedAddedBullets.push(bullet);
      allowedAddedKeys.add(normalizeBulletForCompare(bullet));
    }
    const filteredCanonical =
      addedKeys.size > 0
        ? canonicalBullets.filter((bullet) => {
            const key = normalizeBulletForCompare(bullet);
            if (!addedKeys.has(key)) return true;
            return allowedAddedKeys.has(key);
          })
        : canonicalBullets;

    finalLatestBullets = filteredCanonical.map((bullet) =>
      escapeLatexWithBold(normalizeMarkdownBold(bullet)),
    );
  }

  const latexSummary = escapeLatexWithBold(normalizeMarkdownBold(cvSummary));
  const sanitizedSkillAdditions = resumeOutput.skillsAdditions?.map((group) => ({
    category: group.category,
    items: group.items,
  }));
  const sanitizedSkillsFinal = resumeOutput.skillsFinal
    ? sanitizeSkillGroups(resumeOutput.skillsFinal)
    : [];

  const nextExperiences =
    baseLatest && finalLatestBullets && finalLatestBullets.length > 0
      ? [{ ...baseLatest, bullets: finalLatestBullets }, ...renderInput.experiences.slice(1)]
      : renderInput.experiences;
  const nextSkills =
    sanitizedSkillsFinal.length > 0
      ? sanitizedSkillsFinal
      : mergeSkillAdditions(renderInput.skills, sanitizedSkillAdditions);

  const tex = renderResumeTex({
    ...renderInput,
    summary: latexSummary,
    experiences: nextExperiences,
    skills: nextSkills,
  });
  const filename = parseFilename(renderInput.candidate.name, jobTitle, "resume");

  return { tex, filename };
}

// ── Helper: Build cover letter TeX from model output ──

function buildCoverPdf(
  modelOutput: string,
  renderInput: ReturnType<typeof mapResumeProfile>,
  profile: Record<string, unknown>,
  job: { title: string; company: string | null; description: string | null },
  requestId: string,
): { tex: string; filename: string; qualityGate: string; qualityIssueCount: number } | { error: NextResponse } {
  const coverParsed = parseCoverManualOutput(modelOutput);
  if (!coverParsed.data) {
    return {
      error: NextResponse.json(
        {
          error: {
            code: "PARSE_FAILED",
            message:
              "Unable to parse model output. Cover JSON must include cover.paragraphOne/paragraphTwo/paragraphThree.",
            details: coverParsed.issues.slice(0, 8),
          },
          requestId,
        },
        { status: 400 },
      ),
    };
  }

  const coverOutput = coverParsed.data;
  const p1 = coverOutput.cover.paragraphOne.trim();
  const p2 = coverOutput.cover.paragraphTwo.trim();
  const p3 = coverOutput.cover.paragraphThree.trim();
  const profileSummary =
    typeof profile.summary === "string" && profile.summary.trim().length > 0
      ? profile.summary
      : renderInput.summary;
  const coverContext = buildCoverEvidenceContext({
    baseSummary: profileSummary,
    description: job.description || "",
    resumeSnapshot: profile,
  });
  const qualityReport = evaluateCoverQuality({
    draft: {
      candidateTitle: coverOutput.cover.candidateTitle,
      subject: coverOutput.cover.subject,
      date: coverOutput.cover.date,
      salutation: coverOutput.cover.salutation,
      paragraphOne: p1,
      paragraphTwo: p2,
      paragraphThree: p3,
      closing: coverOutput.cover.closing,
      signatureName: coverOutput.cover.signatureName,
    },
    context: coverContext,
    company: job.company || "the company",
    targetWordRange: { min: 280, max: 360 },
  });

  const tex = renderCoverLetterTex({
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
    candidateTitle: coverOutput.cover.candidateTitle,
    subject: coverOutput.cover.subject,
    date: coverOutput.cover.date,
    salutation: coverOutput.cover.salutation,
    paragraphOne: p1,
    paragraphTwo: p2,
    paragraphThree: p3,
    closing: coverOutput.cover.closing,
    signatureName: coverOutput.cover.signatureName,
  });
  const filename = parseFilename(renderInput.candidate.name, job.title, "cover");

  return {
    tex,
    filename,
    qualityGate: qualityReport.passed ? "pass" : "soft-fail",
    qualityIssueCount: qualityReport.issues.length,
  };
}
