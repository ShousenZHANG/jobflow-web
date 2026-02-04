import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import {
  getAiPromptProfile,
  upsertAiPromptProfile,
} from "@/lib/server/aiPromptProfile";

export const runtime = "nodejs";

const RulesSchema = z
  .array(z.string().trim().min(1).max(280))
  .max(50);

const AiPromptProfileSchema = z.object({
  cvRules: RulesSchema,
  coverRules: RulesSchema,
});

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const profile = await getAiPromptProfile(userId);
  return NextResponse.json({ profile }, { status: 200 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = AiPromptProfileSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const profile = await upsertAiPromptProfile(userId, parsed.data);
  return NextResponse.json({ profile }, { status: 200 });
}
