import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { withSessionRoute, parseJsonBody } from "@/lib/server/api/routeHandler";
import {
  renderFinalApplication,
  renderFinalCoverLetter,
} from "@/lib/server/applications/finalizeApplication";
import { aiContentSchema } from "@/lib/shared/schemas/aiContent";

export const runtime = "nodejs";

const ParamsSchema = z.object({ id: z.string().uuid() });

const BodySchema = z.object({
  /**
   * Hash from the client's last-known load. Stale-write guard against
   * concurrent autosaves from a second tab.
   */
  expectedHash: z.string().nullable(),
});

function parseTarget(req: Request): "resume" | "cover" {
  const url = new URL(req.url);
  return url.searchParams.get("target") === "cover" ? "cover" : "resume";
}

/**
 * Render the current aiContent into a PDF and flip the Application
 * to FINAL. The Tailor edit page calls this from the Finalize button.
 *
 * 400 if the row carries no aiContent (legacy migrated row that needs
 * re-generation rather than direct finalize).
 *
 * 409 on hash mismatch: another tab finalized in parallel; the client
 * should reload to see the latest snapshot.
 */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  return withSessionRoute(async ({ userId, requestId }) => {
    const params = await ctx.params;
    const parsedParams = ParamsSchema.safeParse(params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: { code: "INVALID_PARAMS", message: "Invalid application id" }, requestId },
        { status: 400 },
      );
    }

    const parsedBody = await parseJsonBody(req, BodySchema, requestId);
    if (!parsedBody.ok) return parsedBody.response;
    const { expectedHash } = parsedBody.data;

    const existing = await prisma.application.findFirst({
      where: { id: parsedParams.data.id, userId },
      select: {
        id: true,
        userId: true,
        aiContent: true,
        aiContentHash: true,
        jobId: true,
        company: true,
        role: true,
        job: {
          select: { id: true, title: true, company: true, market: true },
        },
      },
    });
    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Application not found" }, requestId },
        { status: 404 },
      );
    }

    if (!existing.aiContent) {
      return NextResponse.json(
        {
          error: {
            code: "NO_AI_CONTENT",
            message:
              "Application has no AI content stored. Re-generate before finalizing.",
          },
          requestId,
        },
        { status: 400 },
      );
    }

    if (expectedHash !== existing.aiContentHash) {
      return NextResponse.json(
        {
          error: {
            code: "STALE_WRITE",
            message: "Another tab updated this draft",
          },
          currentHash: existing.aiContentHash,
          requestId,
        },
        { status: 409 },
      );
    }

    const aiContentParsed = aiContentSchema.safeParse(existing.aiContent);
    if (!aiContentParsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "AI_CONTENT_INVALID",
            message: "Stored aiContent failed schema validation",
          },
          requestId,
        },
        { status: 500 },
      );
    }

    const job = existing.job ?? {
      id: null,
      title: existing.role ?? "Untitled",
      company: existing.company ?? null,
      market: "AU",
    };

    const target = parseTarget(req);
    const renderJob = {
      id: job.id ?? null,
      title: job.title ?? "Untitled",
      company: job.company,
      market: job.market ?? "AU",
    };

    if (target === "cover") {
      const { coverPdfUrl, coverPdfName } = await renderFinalCoverLetter({
        applicationId: existing.id,
        userId,
        aiContent: aiContentParsed.data,
        job: renderJob,
      });
      await prisma.application.update({
        where: { id: existing.id },
        data: { status: "FINAL", coverPdfUrl },
      });
      return NextResponse.json({
        status: "FINAL",
        coverPdfUrl,
        coverPdfName,
        requestId,
      });
    }

    const { resumePdfUrl, resumePdfName } = await renderFinalApplication({
      applicationId: existing.id,
      userId,
      aiContent: aiContentParsed.data,
      job: renderJob,
    });

    await prisma.application.update({
      where: { id: existing.id },
      data: { status: "FINAL", resumePdfUrl, resumePdfName },
    });

    return NextResponse.json({
      status: "FINAL",
      resumePdfUrl,
      resumePdfName,
      requestId,
    });
  });
}
