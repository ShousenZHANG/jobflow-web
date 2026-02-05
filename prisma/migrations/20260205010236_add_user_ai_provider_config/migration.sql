-- CreateEnum
CREATE TYPE "AiProvider" AS ENUM ('OPENAI', 'GEMINI', 'CLAUDE');

-- CreateTable
CREATE TABLE "UserAiProviderConfig" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" "AiProvider" NOT NULL,
    "model" TEXT,
    "apiKeyCiphertext" TEXT NOT NULL,
    "apiKeyIv" TEXT NOT NULL,
    "apiKeyTag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAiProviderConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAiProviderConfig_userId_key" ON "UserAiProviderConfig"("userId");

-- AddForeignKey
ALTER TABLE "UserAiProviderConfig" ADD CONSTRAINT "UserAiProviderConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
