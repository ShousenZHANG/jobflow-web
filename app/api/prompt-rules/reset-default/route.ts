import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { resetPromptRulesToDefault } from "@/lib/server/promptRuleTemplates";

export const runtime = "nodejs";

export async function POST() {
  const requestId = randomUUID();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Unauthorized" }, requestId },
      { status: 401 },
    );
  }

  const created = await resetPromptRulesToDefault(userId);
  return NextResponse.json({
    requestId,
    template: {
      id: created.id,
      name: created.name,
      version: created.version,
      isActive: created.isActive,
    },
  });
}

