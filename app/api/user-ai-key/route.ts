import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { encryptSecret } from "@/lib/server/crypto/encryption";
import {
  deleteUserAiProvider,
  getUserAiProvider,
  upsertUserAiProvider,
} from "@/lib/server/userAiProvider";

export const runtime = "nodejs";

const ProviderSchema = z.enum(["openai", "gemini", "claude"]);

const ConfigSchema = z.object({
  provider: ProviderSchema,
  model: z.string().trim().min(1).max(80).optional(),
  apiKey: z.string().trim().min(8).max(200),
});

function toDbProvider(provider: z.infer<typeof ProviderSchema>) {
  return provider.toUpperCase() as "OPENAI" | "GEMINI" | "CLAUDE";
}

function toApiProvider(provider: string) {
  return provider.toLowerCase();
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const config = await getUserAiProvider(userId);
  if (!config) {
    return NextResponse.json({ config: null }, { status: 200 });
  }

  return NextResponse.json(
    {
      config: {
        provider: toApiProvider(config.provider),
        model: config.model ?? null,
        hasKey: true,
      },
    },
    { status: 200 },
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = ConfigSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const encrypted = encryptSecret(parsed.data.apiKey);
  const config = await upsertUserAiProvider(userId, {
    provider: toDbProvider(parsed.data.provider),
    model: parsed.data.model ?? null,
    apiKeyCiphertext: encrypted.ciphertext,
    apiKeyIv: encrypted.iv,
    apiKeyTag: encrypted.tag,
  });

  return NextResponse.json(
    {
      config: {
        provider: toApiProvider(config.provider),
        model: config.model ?? null,
        hasKey: true,
      },
    },
    { status: 200 },
  );
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    await deleteUserAiProvider(userId);
  } catch {
    // ignore missing record
  }

  return NextResponse.json({ deleted: true }, { status: 200 });
}
