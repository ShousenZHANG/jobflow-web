import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { withSessionRoute } from "@/lib/server/api/routeHandler";
import {
  aiContentSchema,
  hashAiContent,
  type AiContent,
} from "@/lib/shared/schemas/aiContent";

export const runtime = "nodejs";

const ParamsSchema = z.object({ id: z.string().uuid() });

/**
 * Reset all user edits on the stored aiContent back to the original
 * AI proposal:
 *   - Clear userEdit on every editable field (summary, bullets,
 *     cover paragraphs).
 *   - Reset summary.accepted = true.
 *   - Reset bullet.accepted to qualityGate.passed (or true if no
 *     gate verdict was recorded).
 *   - Reset skillsAdditions[i].accepted = true.
 *   - Reset cover paragraphs accepted = true.
 *
 * Status stays DRAFT. The caller's UI then re-renders from the reset
 * snapshot.
 */
export async function POST(
  _req: Request,
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

    const existing = await prisma.application.findFirst({
      where: { id: parsedParams.data.id, userId },
      select: { id: true, aiContent: true },
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
            message: "No AI content to discard",
          },
          requestId,
        },
        { status: 400 },
      );
    }

    const parsed = aiContentSchema.safeParse(existing.aiContent);
    if (!parsed.success) {
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

    const reset = resetToOriginalProposal(parsed.data);
    const newHash = hashAiContent(reset);

    await prisma.application.update({
      where: { id: existing.id },
      data: {
        status: "DRAFT",
        aiContent: reset,
        aiContentHash: newHash,
      },
    });

    return NextResponse.json({
      status: "DRAFT",
      aiContent: reset,
      aiContentHash: newHash,
      requestId,
    });
  });
}

function resetToOriginalProposal(content: AiContent): AiContent {
  return {
    ...content,
    cv: {
      summary: {
        aiText: content.cv.summary.aiText,
        originalText: content.cv.summary.originalText,
        accepted: true,
      },
      latestExperience: {
        experienceIndex: content.cv.latestExperience.experienceIndex,
        addedBullets: content.cv.latestExperience.addedBullets.map((b) => ({
          text: b.text,
          accepted: b.qualityGate?.passed ?? true,
          ...(b.qualityGate ? { qualityGate: b.qualityGate } : {}),
        })),
      },
      skillsAdditions: content.cv.skillsAdditions.map((s) => ({
        label: s.label,
        items: [...s.items],
        accepted: true,
      })),
    },
    cover: {
      paragraphOne: { aiText: content.cover.paragraphOne.aiText, accepted: true },
      paragraphTwo: { aiText: content.cover.paragraphTwo.aiText, accepted: true },
      paragraphThree: { aiText: content.cover.paragraphThree.aiText, accepted: true },
    },
  };
}
