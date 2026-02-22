import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import {
  BatchRunnerError,
  claimNextBatchTask,
  completeBatchTask,
  getBatchProgress,
  type BatchProgress,
} from "@/lib/server/applicationBatches/runner";
import { getActivePromptSkillRulesForUser } from "@/lib/server/promptRuleTemplates";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { buildPromptMeta } from "@/lib/server/ai/promptContract";

export const runtime = "nodejs";

const ParamsSchema = z.object({
  id: z.string().uuid(),
});

const CompletedTaskSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(["SUCCEEDED", "FAILED", "SKIPPED"]),
  error: z.string().trim().max(500).optional().nullable(),
});

const BodySchema = z.object({
  maxSteps: z.coerce.number().int().min(1).max(20).optional().default(1),
  completedTasks: z.array(CompletedTaskSchema).max(20).optional().default([]),
});

const TERMINAL_BATCH_STATUSES = new Set(["SUCCEEDED", "FAILED", "CANCELLED"]);

type StopReason = "LIMIT_REACHED" | "BATCH_COMPLETE" | "BATCH_TERMINAL";

function buildResumeSnapshotHash(profile: unknown) {
  const record = profile as Record<string, unknown>;
  const payload = {
    summary: record.summary ?? null,
    basics: record.basics ?? null,
    links: record.links ?? null,
    skills: record.skills ?? null,
    experiences: record.experiences ?? null,
    projects: record.projects ?? null,
    education: record.education ?? null,
    updatedAt:
      record.updatedAt instanceof Date ? record.updatedAt.toISOString() : String(record.updatedAt ?? ""),
  };
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function toBatchStatusFromRun(input: {
  initialBatchStatus: string;
  progress: BatchProgress;
  claimedCount: number;
  stopReason: StopReason;
  claimedDoneStatus: string | null;
  terminalStatus: string | null;
}) {
  if (input.terminalStatus) return input.terminalStatus;
  if (input.claimedDoneStatus) return input.claimedDoneStatus;
  if (input.progress.pending > 0 || input.progress.running > 0) return "RUNNING";
  if (input.progress.failed > 0) return "FAILED";
  if (input.progress.succeeded > 0 || input.progress.skipped > 0) return "SUCCEEDED";
  if (input.claimedCount > 0 || input.stopReason === "LIMIT_REACHED") return "RUNNING";
  return input.initialBatchStatus;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const parsedParams = ParamsSchema.safeParse(await ctx.params);
  if (!parsedParams.success) return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });

  const json = await req.json().catch(() => ({}));
  const parsedBody = BodySchema.safeParse(json ?? {});
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  const batch = await prisma.applicationBatch.findFirst({
    where: {
      id: parsedParams.data.id,
      userId,
    },
    select: {
      id: true,
      scope: true,
      status: true,
      totalCount: true,
      error: true,
    },
  });
  if (!batch) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const profile = await getResumeProfile(userId);
  if (!profile) {
    return NextResponse.json(
      {
        error: "NO_PROFILE",
        message: "Create and save your master resume before running codex batch.",
      },
      { status: 404 },
    );
  }

  const rules = await getActivePromptSkillRulesForUser(userId);
  const resumeSnapshotHash = buildResumeSnapshotHash(profile);
  const resumeSnapshotUpdatedAt = profile.updatedAt.toISOString();
  const resumePromptMeta = buildPromptMeta({
    target: "resume",
    ruleSetId: rules.id,
    resumeSnapshotUpdatedAt,
  });
  const coverPromptMeta = buildPromptMeta({
    target: "cover",
    ruleSetId: rules.id,
    resumeSnapshotUpdatedAt,
  });

  const completionResults: Array<{
    taskId: string;
    status: "SUCCEEDED" | "FAILED" | "SKIPPED";
    accepted: boolean;
    error?: string;
  }> = [];
  const completionMap = new Map<string, z.infer<typeof CompletedTaskSchema>>();
  for (const item of parsedBody.data.completedTasks) {
    if (!completionMap.has(item.taskId)) {
      completionMap.set(item.taskId, item);
    }
  }

  for (const completion of completionMap.values()) {
    try {
      await completeBatchTask({
        userId,
        batchId: batch.id,
        taskId: completion.taskId,
        status: completion.status,
        error: completion.error,
      });
      completionResults.push({
        taskId: completion.taskId,
        status: completion.status,
        accepted: true,
      });
    } catch (error) {
      if (error instanceof BatchRunnerError) {
        completionResults.push({
          taskId: completion.taskId,
          status: completion.status,
          accepted: false,
          error: error.code,
        });
        continue;
      }
      throw error;
    }
  }

  const maxSteps = parsedBody.data.maxSteps;
  const tasks: Array<{
    taskId: string;
    jobId: string;
    job: {
      id: string;
      title: string;
      company: string | null;
      jobUrl: string;
      status: "NEW" | "APPLIED" | "REJECTED";
      description: string | null;
      updatedAt: string;
    };
  }> = [];

  let stopReason: StopReason = "LIMIT_REACHED";
  let terminalStatus: string | null = null;
  let doneStatus: string | null = null;

  if (!TERMINAL_BATCH_STATUSES.has(batch.status)) {
    for (let i = 0; i < maxSteps; i += 1) {
      const claimed = await claimNextBatchTask({
        userId,
        batchId: batch.id,
      });

      if (claimed.kind === "not_found") {
        return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
      }
      if (claimed.kind === "terminal") {
        terminalStatus = claimed.batchStatus;
        stopReason = "BATCH_TERMINAL";
        break;
      }
      if (claimed.kind === "done") {
        doneStatus = claimed.batchStatus;
        stopReason = "BATCH_COMPLETE";
        break;
      }

      const job = await prisma.job.findFirst({
        where: {
          id: claimed.task.jobId,
          userId,
        },
        select: {
          id: true,
          title: true,
          company: true,
          jobUrl: true,
          status: true,
          description: true,
          updatedAt: true,
        },
      });

      if (job) {
        tasks.push({
          taskId: claimed.task.id,
          jobId: claimed.task.jobId,
          job: {
            id: job.id,
            title: job.title,
            company: job.company,
            jobUrl: job.jobUrl,
            status: job.status,
            description: job.description,
            updatedAt: job.updatedAt.toISOString(),
          },
        });
      }
    }
  } else {
    terminalStatus = batch.status;
    stopReason = "BATCH_TERMINAL";
  }

  const progress = await getBatchProgress({
    userId,
    batchId: batch.id,
  });

  const batchStatus = toBatchStatusFromRun({
    initialBatchStatus: batch.status,
    progress,
    claimedCount: tasks.length,
    stopReason,
    claimedDoneStatus: doneStatus,
    terminalStatus,
  });

  return NextResponse.json({
    batch: {
      id: batch.id,
      scope: batch.scope,
      status: batchStatus,
      totalCount: batch.totalCount,
      error: batch.error,
    },
    progress,
    context: {
      promptMeta: resumePromptMeta,
      promptMetaByTarget: {
        resume: resumePromptMeta,
        cover: coverPromptMeta,
      },
      rules: {
        locale: rules.locale,
        cvRules: rules.cvRules,
        coverRules: rules.coverRules,
        hardConstraints: rules.hardConstraints,
      },
      resumeSnapshotHash,
    },
    tasks,
    execution: {
      requestedMaxSteps: maxSteps,
      claimedCount: tasks.length,
      completedCount: completionResults.filter((result) => result.accepted).length,
      completionResults,
      stopReason,
    },
  });
}

