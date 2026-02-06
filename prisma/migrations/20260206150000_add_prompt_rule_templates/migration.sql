-- Add per-user prompt rules templates (versioned, with active template marker).

CREATE TABLE "PromptRuleTemplate" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en-AU',
    "cvRules" JSONB NOT NULL,
    "coverRules" JSONB NOT NULL,
    "hardConstraints" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptRuleTemplate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PromptRuleTemplate_userId_version_key"
ON "PromptRuleTemplate"("userId", "version");

CREATE INDEX "PromptRuleTemplate_userId_isActive_updatedAt_idx"
ON "PromptRuleTemplate"("userId", "isActive", "updatedAt");

ALTER TABLE "PromptRuleTemplate"
ADD CONSTRAINT "PromptRuleTemplate_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

