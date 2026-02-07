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
import { getActivePromptSkillRulesForUser } from "@/lib/server/promptRuleTemplates";
import { bulletMatchesResponsibility, computeTop3Coverage } from "@/lib/server/ai/responsibilityCoverage";

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
  category: z.string().trim().min(1).max(60),
  items: z.array(z.string().trim().min(1).max(60)).min(1).max(30),
});

const ResumeManualOutputSchema = z.object({
  cvSummary: z.string().trim().min(1).max(2000),
  latestExperience: z.object({
    bullets: z.array(z.string().trim().min(1).max(220)).min(1).max(15),
  }),
  skillsAdditions: z.array(ResumeSkillAdditionSchema).max(20).optional(),
});

const CoverContentSchema = z.object({
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

const JD_TECH_KEYWORDS = [
  "java",
  "spring",
  "spring boot",
  "kotlin",
  "python",
  "node.js",
  "node",
  "typescript",
  "javascript",
  "react",
  "next.js",
  "angular",
  "vue",
  "go",
  "rust",
  "sql",
  "postgresql",
  "mysql",
  "mongodb",
  "redis",
  "docker",
  "kubernetes",
  "terraform",
  "aws",
  "azure",
  "gcp",
  "devops",
  "ci/cd",
  "linux",
  "bash",
  "graphql",
  "rest",
  "microservices",
  "junit",
] as const;

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

  const noFence = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const fromFence = parse(noFence);
  if (fromFence) return fromFence;

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return parse(text.slice(start, end + 1));
  }

  return null;
}

function parseResumeManualOutput(raw: string) {
  const candidate = parseJsonCandidate(raw);
  if (!candidate || typeof candidate !== "object") return null;

  const record = candidate as Record<string, unknown>;
  const payload: Record<string, unknown> = {
    cvSummary:
      typeof record.cvSummary === "string"
        ? record.cvSummary
        : typeof record.summary === "string"
          ? record.summary
          : "",
    latestExperience:
      record.latestExperience && typeof record.latestExperience === "object"
        ? record.latestExperience
        : Array.isArray(record.latestExperienceBullets)
          ? { bullets: record.latestExperienceBullets }
          : undefined,
    skillsAdditions: Array.isArray(record.skillsAdditions) ? record.skillsAdditions : undefined,
  };

  const parsed = ResumeManualOutputSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

function parseCoverManualOutput(raw: string) {
  const candidate = parseJsonCandidate(raw);
  if (!candidate || typeof candidate !== "object") return null;

  const record = candidate as Record<string, unknown>;
  const coverRecord =
    record.cover && typeof record.cover === "object" ? (record.cover as Record<string, unknown>) : record;

  const payload = {
    cover: {
      subject: typeof coverRecord.subject === "string" ? coverRecord.subject : undefined,
      date: typeof coverRecord.date === "string" ? coverRecord.date : undefined,
      salutation: typeof coverRecord.salutation === "string" ? coverRecord.salutation : undefined,
      paragraphOne:
        typeof coverRecord.paragraphOne === "string"
          ? coverRecord.paragraphOne
          : typeof coverRecord.p1 === "string"
            ? coverRecord.p1
            : "",
      paragraphTwo:
        typeof coverRecord.paragraphTwo === "string"
          ? coverRecord.paragraphTwo
          : typeof coverRecord.p2 === "string"
            ? coverRecord.p2
            : "",
      paragraphThree:
        typeof coverRecord.paragraphThree === "string"
          ? coverRecord.paragraphThree
          : typeof coverRecord.p3 === "string"
            ? coverRecord.p3
            : "",
      closing: typeof coverRecord.closing === "string" ? coverRecord.closing : undefined,
      signatureName:
        typeof coverRecord.signatureName === "string" ? coverRecord.signatureName : undefined,
    },
  };

  const parsed = CoverManualOutputSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
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

function normalizeTextForMatch(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s+/#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractJdSkills(title: string, description: string | null | undefined) {
  const text = `${title}\n${description ?? ""}`;
  const normalized = normalizeTextForMatch(text);
  const found = new Set<string>();

  for (const keyword of JD_TECH_KEYWORDS) {
    const pattern = new RegExp(`\\b${escapeRegExp(keyword.toLowerCase())}\\b`, "i");
    if (pattern.test(normalized)) found.add(keyword);
  }

  return [...found];
}

function applyBoldKeywords(summary: string, keywords: string[]) {
  if (!summary.trim()) return summary;

  let out = summary.replace(/\*\*([^*]+)\*\*/g, "$1");
  const candidates = keywords
    .map((item) => item.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  for (const keyword of candidates) {
    const pattern = new RegExp(`\\b(${escapeRegExp(keyword)})\\b`, "gi");
    out = out.replace(pattern, "**$1**");
  }
  return out;
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
      const resumeOutput = parseResumeManualOutput(parsed.data.modelOutput);
      if (!resumeOutput) {
        return NextResponse.json(
          {
            error: {
              code: "PARSE_FAILED",
              message:
                "Unable to parse model output. Resume JSON must include cvSummary and latestExperience.bullets (skillsAdditions optional).",
            },
            requestId,
          },
          { status: 400 },
        );
      }
      const cvSummary = resumeOutput.cvSummary.trim();
      const baseLatest = renderInput.experiences[0];
      const incomingBullets = resumeOutput.latestExperience?.bullets;
      let finalLatestBullets = incomingBullets ?? [];
      if (baseLatest && incomingBullets) {
        const minAllowed = baseLatest.bullets.length;
        const maxAllowed = Math.max(baseLatest.bullets.length + 3, 3);
        if (incomingBullets.length < minAllowed) {
          return NextResponse.json(
            {
              error: {
                code: "INVALID_LATEST_EXPERIENCE_BULLETS",
                message: `latestExperience.bullets must include all existing bullets (${minAllowed} required).`,
              },
              requestId,
            },
            { status: 400 },
          );
        }
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
          baseLatest.bullets,
          incomingBullets,
        );
        finalLatestBullets = canonicalBullets;

        const coverage = computeTop3Coverage(job.description, baseLatest.bullets);
        if (coverage.topResponsibilities.length > 0) {
          const missingFromBase = coverage.missingFromBase;
          if (missingFromBase.length > 0) {
            if (
              addedBullets.length < coverage.requiredNewBulletsMin ||
              addedBullets.length > coverage.requiredNewBulletsMax
            ) {
              const repairInstruction = [
                "Return strict JSON only.",
                `Keep all existing base bullets verbatim, and add ${coverage.requiredNewBulletsMin} to ${coverage.requiredNewBulletsMax} NEW bullets.`,
                "Put new bullets first, ordered by missing responsibilities below.",
                ...missingFromBase.map((item, index) => `${index + 1}. ${item}`),
              ].join("\n");
              return NextResponse.json(
                {
                  error: {
                    code: "RESPONSIBILITY_TOP3_NEEDS_ADDITIONS",
                    message:
                      `Top 3 JD responsibilities are not fully covered by base bullets. Add ${coverage.requiredNewBulletsMin} to ${coverage.requiredNewBulletsMax} new bullets aligned to missing responsibilities.`,
                    details: {
                      missingResponsibilities: missingFromBase,
                      repairInstruction,
                    },
                  },
                  requestId,
                },
                { status: 400 },
              );
            }

            const uncoveredInResult = coverage.topResponsibilities.filter(
              (resp) => !finalLatestBullets.some((bullet) => bulletMatchesResponsibility(bullet, resp)),
            );
            if (uncoveredInResult.length > 0) {
              return NextResponse.json(
                {
                  error: {
                    code: "RESPONSIBILITY_TOP3_NOT_COVERED",
                    message:
                      "Final latestExperience.bullets must cover all top 3 JD responsibilities.",
                    details: {
                      uncoveredResponsibilities: uncoveredInResult,
                    },
                  },
                  requestId,
                },
                { status: 400 },
              );
            }
          }
        }
      }

      const jdSkills = extractJdSkills(job.title, job.description);
      const existingSkills = new Set(
        renderInput.skills.flatMap((group) => group.items).map((item) => normalizeTextForMatch(item)),
      );
      const addedSkills = new Set(
        (resumeOutput.skillsAdditions ?? [])
          .flatMap((group) => group.items)
          .map((item) => normalizeTextForMatch(item)),
      );
      const missingJdSkills = jdSkills.filter((skill) => {
        const normalized = normalizeTextForMatch(skill);
        return !existingSkills.has(normalized) && !addedSkills.has(normalized);
      });
      if (missingJdSkills.length > 0) {
        return NextResponse.json(
          {
            error: {
              code: "MISSING_SKILLS_ADDITIONS",
              message:
                "skillsAdditions is missing important JD skills. Add missing skills under appropriate categories.",
              details: {
                missingSkills: missingJdSkills,
              },
            },
            requestId,
          },
          { status: 400 },
        );
      }

      const boldedSummary = applyBoldKeywords(cvSummary, jdSkills);

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
      const nextSkills = mergeSkillAdditions(renderInput.skills, resumeOutput.skillsAdditions);

      const tex = renderResumeTex({
        ...renderInput,
        summary: boldedSummary,
        experiences: nextExperiences,
        skills: nextSkills,
      });
      pdf = await compileLatexToPdf(tex);
      filename = parseFilename("resume", renderInput.candidate.name, job.title);
    } else {
      const coverOutput = parseCoverManualOutput(parsed.data.modelOutput);
      if (!coverOutput) {
        return NextResponse.json(
          {
            error: {
              code: "PARSE_FAILED",
              message:
                "Unable to parse model output. Cover JSON must include cover.paragraphOne/paragraphTwo/paragraphThree.",
            },
            requestId,
          },
          { status: 400 },
        );
      }
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
