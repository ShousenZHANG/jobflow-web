import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";
import { escapeLatex, escapeLatexWithBold } from "@/lib/server/latex/escapeLatex";
import { renderResumeTex } from "@/lib/server/latex/renderResume";
import { renderCoverLetterTex } from "@/lib/server/latex/renderCoverLetter";
import { LatexRenderError, compileLatexToPdf } from "@/lib/server/latex/compilePdf";
import { getActivePromptSkillRulesForUser } from "@/lib/server/promptRuleTemplates";
import { put } from "@vercel/blob";

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

const ResumeSkillAdditionSchema = z.object({
  category: z.string().trim().min(1).max(100),
  items: z.array(z.string().trim().min(1).max(120)).min(1).max(30),
});

const ResumeSkillGroupSchema = z
  .object({
    label: z.string().trim().min(1).max(100).optional(),
    category: z.string().trim().min(1).max(100).optional(),
    items: z.array(z.string().trim().min(1).max(120)).min(1).max(40),
  })
  .transform((value) => ({
    label: (value.label ?? value.category ?? "").trim(),
    items: value.items,
  }))
  .refine((value) => value.label.length > 0, {
    message: "skillsFinal item must include label or category",
  });

const ResumeManualOutputSchema = z.object({
  cvSummary: z.string().trim().min(1).max(2000),
  latestExperience: z.object({
    bullets: z.array(z.string().trim().min(1).max(320)).min(1).max(15),
  }),
  skillsAdditions: z.array(ResumeSkillAdditionSchema).max(20).optional(),
  // Accept a wider incoming range, then normalize down to <= 5 groups in sanitizeSkillGroups.
  skillsFinal: z.array(ResumeSkillGroupSchema).min(1).max(20).optional(),
});

const CoverContentSchema = z.object({
  candidateTitle: z.string().trim().max(160).optional(),
  subject: z.string().trim().max(220).optional(),
  date: z.string().trim().max(80).optional(),
  salutation: z.string().trim().max(220).optional(),
  paragraphOne: z.string().trim().min(1).max(2000),
  paragraphTwo: z.string().trim().min(1).max(2000),
  paragraphThree: z.string().trim().min(1).max(2000),
  closing: z.string().trim().max(300).optional(),
  signatureName: z.string().trim().max(120).optional(),
});

const CoverManualOutputSchema = z.object({
  cover: CoverContentSchema,
});

function parseJsonCandidate(raw: string): unknown | null {
  const text = raw.trim();
  if (!text) return null;

  const parse = (value: string): unknown | null => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const direct = parse(text);
  if (direct) return direct;

  // Common LLM copy/paste issues: smart quotes, NBSP and trailing commas.
  const repaired = text
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\u00A0/g, " ")
    .replace(/,\s*([}\]])/g, "$1");

  const repairedDirect = parse(repaired);
  if (repairedDirect) return repairedDirect;

  const noFence = repaired.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const fromFence = parse(noFence);
  if (fromFence) return fromFence;

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return parse(text.slice(start, end + 1));
  }

  return null;
}

function parseResumeManualOutput(raw: string): {
  data: z.infer<typeof ResumeManualOutputSchema> | null;
  issues: string[];
} {
  const candidate = parseJsonCandidate(raw);
  if (!candidate || typeof candidate !== "object") {
    return { data: null, issues: ["Payload is not valid JSON object."] };
  }

  const record = candidate as Record<string, unknown>;
  const latestExperienceCandidate =
    (record.latestExperience as unknown) ??
    (record.latest_experience as unknown) ??
    (record.latestExperienceBlock as unknown);

  const payload: Record<string, unknown> = {
    cvSummary:
      typeof record.cvSummary === "string"
        ? record.cvSummary
        : typeof record.cv_summary === "string"
          ? record.cv_summary
        : typeof record.summary === "string"
          ? record.summary
          : "",
    latestExperience:
      latestExperienceCandidate && typeof latestExperienceCandidate === "object"
        ? latestExperienceCandidate
        : Array.isArray(record.latestExperienceBullets)
          ? { bullets: record.latestExperienceBullets }
          : Array.isArray(record.latest_experience_bullets)
            ? { bullets: record.latest_experience_bullets }
          : undefined,
    skillsAdditions: Array.isArray(record.skillsAdditions) ? record.skillsAdditions : undefined,
    skillsFinal: Array.isArray(record.skillsFinal)
      ? record.skillsFinal
      : Array.isArray(record.skills_final)
        ? record.skills_final
      : Array.isArray(record.skills)
        ? record.skills
        : undefined,
  };

  const parsed = ResumeManualOutputSchema.safeParse(payload);
  if (parsed.success) return { data: parsed.data, issues: [] };
  return {
    data: null,
    issues: parsed.error.issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      return `${path}: ${issue.message}`;
    }),
  };
}

function parseCoverManualOutput(raw: string): {
  data: z.infer<typeof CoverManualOutputSchema> | null;
  issues: string[];
} {
  const candidate = parseJsonCandidate(raw);
  if (!candidate || typeof candidate !== "object") {
    return { data: null, issues: ["Payload is not valid JSON object."] };
  }

  const record = candidate as Record<string, unknown>;
  const coverRecord =
    record.cover && typeof record.cover === "object" ? (record.cover as Record<string, unknown>) : record;

  const payload = {
    cover: {
      subject: typeof coverRecord.subject === "string" ? coverRecord.subject : undefined,
      candidateTitle:
        typeof coverRecord.candidateTitle === "string" ? coverRecord.candidateTitle : undefined,
      date: typeof coverRecord.date === "string" ? coverRecord.date : undefined,
      salutation: typeof coverRecord.salutation === "string" ? coverRecord.salutation : undefined,
      paragraphOne:
        typeof coverRecord.paragraphOne === "string"
          ? coverRecord.paragraphOne
          : typeof coverRecord.paragraph_1 === "string"
            ? coverRecord.paragraph_1
          : typeof coverRecord.p1 === "string"
            ? coverRecord.p1
            : "",
      paragraphTwo:
        typeof coverRecord.paragraphTwo === "string"
          ? coverRecord.paragraphTwo
          : typeof coverRecord.paragraph_2 === "string"
            ? coverRecord.paragraph_2
          : typeof coverRecord.p2 === "string"
            ? coverRecord.p2
            : "",
      paragraphThree:
        typeof coverRecord.paragraphThree === "string"
          ? coverRecord.paragraphThree
          : typeof coverRecord.paragraph_3 === "string"
            ? coverRecord.paragraph_3
          : typeof coverRecord.p3 === "string"
            ? coverRecord.p3
            : "",
      closing: typeof coverRecord.closing === "string" ? coverRecord.closing : undefined,
      signatureName:
        typeof coverRecord.signatureName === "string" ? coverRecord.signatureName : undefined,
    },
  };

  const parsed = CoverManualOutputSchema.safeParse(payload);
  if (parsed.success) return { data: parsed.data, issues: [] };
  return {
    data: null,
    issues: parsed.error.issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      return `${path}: ${issue.message}`;
    }),
  };
}

function mergeSkillAdditions(
  base: Array<{ label: string; items: string[] }>,
  additions?: Array<{ category: string; items: string[] }>,
) {
  if (!additions || additions.length === 0) return base;
  const result = [...base.map((group) => ({ ...group, items: [...group.items] }))];

  for (const addition of additions) {
    const category = addition.category.trim();
    const incoming = addition.items.map((item) => item.trim()).filter(Boolean);
    if (!category || incoming.length === 0) continue;

    const targetIndex = result.findIndex(
      (group) => group.label.trim().toLowerCase() === category.toLowerCase(),
    );
    if (targetIndex >= 0) {
      const existingSet = new Set(result[targetIndex].items.map((item) => item.toLowerCase()));
      for (const item of incoming) {
        if (!existingSet.has(item.toLowerCase())) {
          result[targetIndex].items.push(item);
          existingSet.add(item.toLowerCase());
        }
      }
      continue;
    }

    result.push({ label: category, items: Array.from(new Set(incoming)) });
  }

  return result;
}

function sanitizeSkillGroups(
  groups: Array<{ label: string; items: string[] }>,
): Array<{ label: string; items: string[] }> {
  const out: Array<{ label: string; items: string[] }> = [];
  const seenLabels = new Set<string>();

  for (const group of groups) {
    const rawLabel = group.label.trim();
    if (!rawLabel) continue;
    const labelKey = rawLabel.toLowerCase();
    if (seenLabels.has(labelKey)) continue;
    seenLabels.add(labelKey);

    const seenItems = new Set<string>();
    const items = group.items
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item) => {
        const key = item.toLowerCase();
        if (seenItems.has(key)) return false;
        seenItems.add(key);
        return true;
      })
      .slice(0, 20)
      .map((item) => escapeLatex(item));

    if (items.length === 0) continue;
    out.push({ label: escapeLatex(rawLabel), items });
    if (out.length >= 5) break;
  }

  return out;
}

function normalizeBulletForCompare(value: string) {
  return value
    .normalize("NFKC")
    .replace(/\*\*|__|`/g, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeBulletForSimilarity(value: string) {
  return new Set(
    normalizeBulletForCompare(value)
      .split(" ")
      .map((token) => token.trim())
      .filter((token) => token.length >= 3),
  );
}

function bulletSimilarityScore(a: string, b: string) {
  const ta = tokenizeBulletForSimilarity(a);
  const tb = tokenizeBulletForSimilarity(b);
  if (ta.size === 0 || tb.size === 0) return 0;

  let intersection = 0;
  for (const token of ta) {
    if (tb.has(token)) intersection += 1;
  }
  const union = new Set([...ta, ...tb]).size;
  return union === 0 ? 0 : intersection / union;
}

function canonicalizeLatestBullets(baseBullets: string[], incomingBullets: string[]) {
  const normalizedBase = baseBullets.map(normalizeBulletForCompare);
  const usedBaseIndexes = new Set<number>();
  const canonicalBullets: string[] = [];
  const addedBullets: string[] = [];

  for (const incoming of incomingBullets) {
    const normalizedIncoming = normalizeBulletForCompare(incoming);
    let matchedIndex = -1;

    for (let i = 0; i < normalizedBase.length; i += 1) {
      if (usedBaseIndexes.has(i)) continue;
      if (normalizedBase[i] === normalizedIncoming) {
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex < 0) {
      let bestIndex = -1;
      let bestScore = 0;
      for (let i = 0; i < baseBullets.length; i += 1) {
        if (usedBaseIndexes.has(i)) continue;
        const score = bulletSimilarityScore(incoming, baseBullets[i]);
        if (score > bestScore) {
          bestScore = score;
          bestIndex = i;
        }
      }
      // Accept high-confidence near-match as "same base bullet".
      if (bestIndex >= 0 && bestScore >= 0.82) {
        matchedIndex = bestIndex;
      }
    }

    if (matchedIndex >= 0) {
      usedBaseIndexes.add(matchedIndex);
      canonicalBullets.push(baseBullets[matchedIndex]);
    } else {
      canonicalBullets.push(incoming);
      addedBullets.push(incoming);
    }
  }

  // Ensure every base bullet is present at least once in final output.
  for (let i = 0; i < baseBullets.length; i += 1) {
    if (!usedBaseIndexes.has(i)) canonicalBullets.push(baseBullets[i]);
  }

  return {
    canonicalBullets,
    addedBullets,
  };
}

function normalizeMarkdownBold(value: string) {
  return value.replace(/\*\*([^*]+)\*\*/g, (_match, inner: string) => {
    const raw = inner ?? "";
    const leading = raw.match(/^\s*/)?.[0] ?? "";
    const trailing = raw.match(/\s*$/)?.[0] ?? "";
    const core = raw.trim();
    if (!core) return "";
    // Preserve separator spaces around malformed markers:
    // "**Java **and" -> "**Java** and"
    // "with** Java**" -> "with **Java**"
    return `${leading}**${core}**${trailing}`;
  });
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getLatestRawBullets(profile: unknown): string[] {
  if (!profile || typeof profile !== "object") return [];
  const record = profile as Record<string, unknown>;
  const experiences = Array.isArray(record.experiences) ? record.experiences : [];
  const latest =
    experiences.length > 0 && experiences[0] && typeof experiences[0] === "object"
      ? (experiences[0] as Record<string, unknown>)
      : null;
  return asStringArray(latest?.bullets);
}

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

  const renderInput = mapResumeProfile(profile);

  let pdf: Buffer;
  let filename: string;
  try {
    if (parsed.data.target === "resume") {
      const resumeParsed = parseResumeManualOutput(parsed.data.modelOutput);
      if (!resumeParsed.data) {
        return NextResponse.json(
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
        );
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
          return NextResponse.json(
            {
              error: {
                code: "INVALID_LATEST_EXPERIENCE_BULLETS",
                message: `latestExperience.bullets exceeds allowed size (${maxAllowed}).`,
              },
              requestId,
            },
            { status: 400 },
          );
        }

        const { canonicalBullets, addedBullets } = canonicalizeLatestBullets(
          baseBulletsForMatch,
          incomingBullets,
        );
        finalLatestBullets = canonicalBullets.map((bullet) =>
          escapeLatexWithBold(normalizeMarkdownBold(bullet)),
        );

        void addedBullets;
      }

      const latexSummary = escapeLatexWithBold(normalizeMarkdownBold(cvSummary));
      const sanitizedSkillAdditions = resumeOutput.skillsAdditions?.map((group) => ({
        category: escapeLatex(group.category),
        items: group.items.map((item) => escapeLatex(item)),
      }));
      const sanitizedSkillsFinal = resumeOutput.skillsFinal
        ? sanitizeSkillGroups(resumeOutput.skillsFinal)
        : [];

      const nextExperiences =
        baseLatest && finalLatestBullets && finalLatestBullets.length > 0
          ? [
              {
                ...baseLatest,
                bullets: finalLatestBullets,
              },
              ...renderInput.experiences.slice(1),
            ]
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
      pdf = await compileLatexToPdf(tex);
      filename = parseFilename("resume", renderInput.candidate.name, job.title);
    } else {
      const coverParsed = parseCoverManualOutput(parsed.data.modelOutput);
      if (!coverParsed.data) {
        return NextResponse.json(
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
        );
      }
      const coverOutput = coverParsed.data;
      const p1 = coverOutput.cover.paragraphOne.trim();
      const p2 = coverOutput.cover.paragraphTwo.trim();
      const p3 = coverOutput.cover.paragraphThree.trim();
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

  let persistedResumePdfUrl: string | null = null;
  if (parsed.data.target === "resume" && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`applications/${userId}/${job.id}/${filename}`, pdf, {
        access: "public",
        contentType: "application/pdf",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      persistedResumePdfUrl = blob.url;
    } catch {
      // Keep generation successful even if persistence fails.
      persistedResumePdfUrl = null;
    }
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
      ...(parsed.data.target === "resume" && persistedResumePdfUrl
        ? {
            resumePdfUrl: persistedResumePdfUrl,
            resumePdfName: filename,
          }
        : {}),
    },
    update: {
      resumeProfileId: profile.id,
      company: job.company,
      role: job.title,
      ...(parsed.data.target === "resume" && persistedResumePdfUrl
        ? {
            resumePdfUrl: persistedResumePdfUrl,
            resumePdfName: filename,
          }
        : {}),
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
