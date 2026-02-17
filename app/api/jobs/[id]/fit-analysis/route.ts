import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { buildJobFitAnalysis } from "@/lib/server/ai/jobFitAnalysis";
import { getDefaultModel, normalizeProviderModel } from "@/lib/server/ai/providers";
import {
  JOB_FIT_ANALYZER_VERSION,
  type JobFitApiResponse,
  type JobFitEvidence,
  type JobFitGate,
  type JobFitSource,
} from "@/lib/shared/jobFitAnalysis";

export const runtime = "nodejs";

const ParamsSchema = z.object({
  id: z.string().uuid(),
});

async function getPromptRuleVersion(userId: string) {
  const active = await prisma.promptRuleTemplate.findFirst({
    where: { userId, isActive: true },
    orderBy: { updatedAt: "desc" },
    select: { version: true },
  });
  if (active) return active.version;

  const latest = await prisma.promptRuleTemplate.findFirst({
    where: { userId },
    orderBy: { version: "desc" },
    select: { version: true },
  });
  return latest?.version ?? 1;
}

async function buildContext(userId: string, id: string) {
  const job = await prisma.job.findFirst({
    where: { id, userId },
    select: {
      id: true,
      title: true,
      company: true,
      description: true,
      updatedAt: true,
    },
  });
  if (!job) return { error: NextResponse.json({ error: "NOT_FOUND" }, { status: 404 }) } as const;

  const profile = await getResumeProfile(userId);
  if (!profile) {
    return {
      error: NextResponse.json(
        { error: { code: "NO_PROFILE", message: "Create your master resume first." } },
        { status: 404 },
      ),
    } as const;
  }

  const promptRuleVersion = await getPromptRuleVersion(userId);
  const provider = "gemini";
  const model = normalizeProviderModel("gemini", process.env.GEMINI_MODEL || getDefaultModel("gemini"));

  return { job, profile, promptRuleVersion, provider, model } as const;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function asGateArray(value: unknown): JobFitGate[] {
  if (!Array.isArray(value)) return [];
  const out: JobFitGate[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const key = typeof rec.key === "string" ? rec.key : "";
    const label = typeof rec.label === "string" ? rec.label : "";
    const status = rec.status;
    if (!key || !label || (status !== "PASS" && status !== "RISK" && status !== "BLOCK")) continue;
    const evidence = typeof rec.evidence === "string" ? rec.evidence : undefined;
    const statusValue: JobFitGate["status"] = status;
    out.push({ key, label, status: statusValue, evidence });
  }
  return out;
}

function asEvidenceArray(value: unknown): JobFitEvidence[] {
  if (!Array.isArray(value)) return [];
  const out: JobFitEvidence[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const label = typeof rec.label === "string" ? rec.label : "";
    const jd = typeof rec.jd === "string" ? rec.jd : "";
    if (!label || !jd) continue;
    const resume = typeof rec.resume === "string" ? rec.resume : null;
    out.push({ label, jd, resume });
  }
  return out;
}

function normalizeSource(value: string | null): JobFitSource {
  return value === "heuristic+gemini" ? "heuristic+gemini" : "heuristic";
}

function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function toApiResponse(row: {
  status: "PENDING" | "READY" | "FAILED";
  score: number | null;
  gateStatus: "PASS" | "RISK" | "BLOCK" | null;
  recommendation: string | null;
  stackMatched: number | null;
  stackTotal: number | null;
  topGaps: unknown;
  gates: unknown;
  evidence: unknown;
  source: string | null;
  aiEnhanced: boolean | null;
  provider: string | null;
  model: string | null;
  aiReason: string | null;
  error: string | null;
  updatedAt: Date;
}): JobFitApiResponse {
  if (row.status === "FAILED") {
    return {
      status: "FAILED",
      source: normalizeSource(row.source),
      aiEnhanced: row.aiEnhanced ?? false,
      provider: row.provider ?? null,
      model: row.model ?? null,
      aiReason: row.aiReason ?? "ANALYSIS_FAILED",
      message: row.error || "Fit analysis failed.",
    };
  }
  if (row.status !== "READY" || row.score === null || row.gateStatus === null || !row.recommendation) {
    return {
      status: "PENDING",
      source: row.source ? normalizeSource(row.source) : undefined,
      aiEnhanced: row.aiEnhanced ?? undefined,
      provider: row.provider ?? undefined,
      model: row.model ?? undefined,
      aiReason: row.aiReason ?? undefined,
    };
  }

  const recommendation =
    row.recommendation === "Worth Applying" ||
    row.recommendation === "Apply with Tailored CV" ||
    row.recommendation === "Low Priority"
      ? row.recommendation
      : "Apply with Tailored CV";

  return {
    status: "READY",
    source: normalizeSource(row.source),
    aiEnhanced: row.aiEnhanced ?? false,
    provider: row.provider ?? null,
    model: row.model ?? null,
    aiReason: row.aiReason ?? null,
    analysis: {
      score: row.score,
      gateStatus: row.gateStatus,
      recommendation,
      stackMatch: {
        matched: row.stackMatched ?? 0,
        total: row.stackTotal ?? 0,
      },
      topGaps: asStringArray(row.topGaps),
      gates: asGateArray(row.gates),
      evidence: asEvidenceArray(row.evidence),
      generatedAt: row.updatedAt.toISOString(),
    },
  };
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = await ctx.params;
  const parsed = ParamsSchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });

  const context = await buildContext(userId, parsed.data.id);
  if ("error" in context) return context.error;

  const cacheIdentity = {
    userId,
    jobId: context.job.id,
    resumeSnapshotUpdatedAt: context.profile.updatedAt,
    promptRuleVersion: context.promptRuleVersion,
    jobUpdatedAt: context.job.updatedAt,
    analyzerVersion: JOB_FIT_ANALYZER_VERSION,
    model: context.model,
  };
  const cache = await prisma.jobFitAnalysis.findFirst({
    where: cacheIdentity,
    orderBy: { updatedAt: "desc" },
  });

  if (!cache) {
    return NextResponse.json({
      status: "PENDING",
      source: "heuristic",
      aiEnhanced: false,
      provider: context.provider,
      model: context.model,
      aiReason: "NOT_COMPUTED",
    } satisfies JobFitApiResponse);
  }
  return NextResponse.json(toApiResponse(cache));
}

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = await ctx.params;
  const parsed = ParamsSchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });

  const context = await buildContext(userId, parsed.data.id);
  if ("error" in context) return context.error;

  const cacheIdentity = {
    userId,
    jobId: context.job.id,
    resumeSnapshotUpdatedAt: context.profile.updatedAt,
    promptRuleVersion: context.promptRuleVersion,
    jobUpdatedAt: context.job.updatedAt,
    analyzerVersion: JOB_FIT_ANALYZER_VERSION,
    model: context.model,
  };
  const cacheWhere = {
    ...cacheIdentity,
    provider: context.provider,
  };

  const cached = await prisma.jobFitAnalysis.findFirst({
    where: cacheIdentity,
    orderBy: { updatedAt: "desc" },
  });
  if (cached?.status === "READY") {
    return NextResponse.json(toApiResponse(cached));
  }

  const description = (context.job.description ?? "").trim();
  if (!description) {
    if (!cached) {
      try {
        await prisma.jobFitAnalysis.create({
          data: {
            ...cacheWhere,
            status: "PENDING",
            source: "heuristic",
            aiEnhanced: false,
            aiReason: "NO_JD",
            error: null,
          },
        });
      } catch (error) {
        if (!isUniqueConflict(error)) throw error;
      }
    }
    return NextResponse.json({
      status: "PENDING",
      source: "heuristic",
      aiEnhanced: false,
      provider: context.provider,
      model: context.model,
      aiReason: "NO_JD",
      message: "Waiting for JD enrichment before analysis.",
    } satisfies JobFitApiResponse);
  }

  try {
    const analysis = await buildJobFitAnalysis({
      title: context.job.title,
      company: context.job.company,
      description,
      resume: context.profile,
    });
    const readyPayload = {
      status: "READY" as const,
      source: analysis.source,
      aiEnhanced: analysis.aiEnhanced,
      provider: context.provider,
      model: analysis.model ?? context.model,
      aiReason: analysis.aiReason,
      score: analysis.analysis.score,
      gateStatus: analysis.analysis.gateStatus,
      recommendation: analysis.analysis.recommendation,
      stackMatched: analysis.analysis.stackMatch.matched,
      stackTotal: analysis.analysis.stackMatch.total,
      topGaps: analysis.analysis.topGaps,
      gates: analysis.analysis.gates,
      evidence: analysis.analysis.evidence,
      error: null,
    };
    const saved = cached
      ? await prisma.jobFitAnalysis.update({
          where: { id: cached.id },
          data: readyPayload,
        })
      : await (async () => {
          try {
            return await prisma.jobFitAnalysis.create({
              data: {
                ...cacheWhere,
                ...readyPayload,
              },
            });
          } catch (error) {
            if (!isUniqueConflict(error)) throw error;
            const existing = await prisma.jobFitAnalysis.findFirst({
              where: cacheIdentity,
              orderBy: { updatedAt: "desc" },
            });
            if (!existing) throw error;
            return prisma.jobFitAnalysis.update({
              where: { id: existing.id },
              data: readyPayload,
            });
          }
        })();
    return NextResponse.json(toApiResponse(saved));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    if (cached) {
      await prisma.jobFitAnalysis.update({
        where: { id: cached.id },
        data: {
          status: "FAILED",
          source: "heuristic",
          aiEnhanced: false,
          aiReason: "ANALYSIS_FAILED",
          error: message,
        },
      });
    } else {
      try {
        await prisma.jobFitAnalysis.create({
          data: {
            ...cacheWhere,
            status: "FAILED",
            source: "heuristic",
            aiEnhanced: false,
            aiReason: "ANALYSIS_FAILED",
            error: message,
          },
        });
      } catch (createError) {
        if (!isUniqueConflict(createError)) throw createError;
        const existing = await prisma.jobFitAnalysis.findFirst({
          where: cacheIdentity,
          orderBy: { updatedAt: "desc" },
        });
        if (existing) {
          await prisma.jobFitAnalysis.update({
            where: { id: existing.id },
            data: {
              status: "FAILED",
              source: "heuristic",
              aiEnhanced: false,
              aiReason: "ANALYSIS_FAILED",
              error: message,
            },
          });
        }
      }
    }
    return NextResponse.json({ status: "FAILED", message } satisfies JobFitApiResponse, { status: 500 });
  }
}
