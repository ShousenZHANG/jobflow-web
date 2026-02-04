-- CreateTable
CREATE TABLE "AiPromptProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "cvRules" JSONB NOT NULL,
    "coverRules" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPromptProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiPromptProfile_userId_key" ON "AiPromptProfile"("userId");

-- AddForeignKey
ALTER TABLE "AiPromptProfile" ADD CONSTRAINT "AiPromptProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
