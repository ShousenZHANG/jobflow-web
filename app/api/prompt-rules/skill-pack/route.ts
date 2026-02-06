import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getActivePromptSkillRulesForUser } from "@/lib/server/promptRuleTemplates";
import { buildGlobalSkillPackFiles } from "@/lib/server/ai/skillPack";
import { createTarGz } from "@/lib/server/archive/tar";

export const runtime = "nodejs";

function safeSegment(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "rules";
}

export async function GET() {
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
  const files = buildGlobalSkillPackFiles(rules);
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

