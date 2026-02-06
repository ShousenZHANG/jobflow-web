import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { getActivePromptSkillRulesForUser } from "@/lib/server/promptRuleTemplates";
import { buildGlobalSkillPackFiles } from "@/lib/server/ai/skillPack";
import { createTarGz } from "@/lib/server/archive/tar";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";

export const runtime = "nodejs";

function safeSegment(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "rules";
}

export async function GET(req: Request) {
  const requestId = randomUUID();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Unauthorized" }, requestId },
      { status: 401 },
    );
  }

  const rules = await getActivePromptSkillRulesForUser(userId);
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");
  let context:
    | {
        jobId: string;
        jobTitle: string;
        company: string;
        description: string;
        baseSummary: string;
        resumeSnapshot: unknown;
      }
    | undefined;

  if (jobId) {
    const [job, profile] = await Promise.all([
      prisma.job.findFirst({
        where: { id: jobId, userId },
        select: { id: true, title: true, company: true, description: true },
      }),
      getResumeProfile(userId),
    ]);

    if (job && profile) {
      const mapped = mapResumeProfile(profile);
      context = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company || "the company",
        description: job.description || "",
        baseSummary: mapped.summary || "",
        resumeSnapshot: {
          summary: profile.summary ?? "",
          basics: profile.basics ?? null,
          links: profile.links ?? [],
          skills: profile.skills ?? [],
          experiences: profile.experiences ?? [],
          projects: profile.projects ?? [],
          education: profile.education ?? [],
        },
      };
    }
  }

  const files = buildGlobalSkillPackFiles(rules, context);
  const tarGz = createTarGz(files);
  const today = new Date().toISOString().slice(0, 10);
  const filename = `jobflow-skill-pack-${safeSegment(rules.id)}-${today}.tar.gz`;

  return new NextResponse(new Uint8Array(tarGz), {
    status: 200,
    headers: {
      "content-type": "application/gzip",
      "content-disposition": `attachment; filename="${filename}"`,
      "x-request-id": requestId,
    },
  });
}

