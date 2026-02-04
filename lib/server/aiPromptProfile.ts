import { prisma } from "@/lib/server/prisma";

export type AiPromptProfileInput = {
  cvRules: string[];
  coverRules: string[];
};

export async function getAiPromptProfile(userId: string) {
  return prisma.aiPromptProfile.findUnique({
    where: { userId },
  });
}

export async function upsertAiPromptProfile(
  userId: string,
  data: AiPromptProfileInput,
) {
  return prisma.aiPromptProfile.upsert({
    where: { userId },
    create: { userId, cvRules: data.cvRules, coverRules: data.coverRules },
    update: { cvRules: data.cvRules, coverRules: data.coverRules },
  });
}

