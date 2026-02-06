import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { activatePromptRuleTemplate } from "@/lib/server/promptRuleTemplates";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const requestId = randomUUID();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Unauthorized" }, requestId },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const activated = await activatePromptRuleTemplate(userId, id);
  if (!activated) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Template not found" }, requestId },
      { status: 404 },
    );
  }

  return NextResponse.json({
    requestId,
    template: {
      id: activated.id,
      name: activated.name,
      version: activated.version,
      isActive: activated.isActive,
    },
  });
}

