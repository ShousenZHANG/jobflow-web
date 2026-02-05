import { prisma } from "@/lib/server/prisma";
import type { AiProvider } from "@/lib/generated/prisma";

export type UserAiProviderInput = {
  provider: AiProvider;
  model?: string | null;
  apiKeyCiphertext: string;
  apiKeyIv: string;
  apiKeyTag: string;
};

export async function getUserAiProvider(userId: string) {
  return prisma.userAiProviderConfig.findUnique({
    where: { userId },
  });
}

export async function upsertUserAiProvider(
  userId: string,
  data: UserAiProviderInput,
) {
  return prisma.userAiProviderConfig.upsert({
    where: { userId },
    create: {
      userId,
      provider: data.provider,
      model: data.model ?? null,
      apiKeyCiphertext: data.apiKeyCiphertext,
      apiKeyIv: data.apiKeyIv,
      apiKeyTag: data.apiKeyTag,
    },
    update: {
      provider: data.provider,
      model: data.model ?? null,
      apiKeyCiphertext: data.apiKeyCiphertext,
      apiKeyIv: data.apiKeyIv,
      apiKeyTag: data.apiKeyTag,
    },
  });
}

export async function deleteUserAiProvider(userId: string) {
  return prisma.userAiProviderConfig.delete({
    where: { userId },
  });
}
