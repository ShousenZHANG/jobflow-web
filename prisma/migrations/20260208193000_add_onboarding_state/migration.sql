-- Add onboarding state table for in-app guide/checklist.

CREATE TYPE "OnboardingStage" AS ENUM ('NEW_USER', 'ACTIVATED_USER', 'RETURNING_USER');

CREATE TABLE "OnboardingState" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "stage" "OnboardingStage" NOT NULL DEFAULT 'NEW_USER',
    "checklist" JSONB,
    "dismissedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingState_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OnboardingState_userId_key" ON "OnboardingState"("userId");
CREATE INDEX "OnboardingState_userId_stage_updatedAt_idx" ON "OnboardingState"("userId", "stage", "updatedAt");

ALTER TABLE "OnboardingState"
ADD CONSTRAINT "OnboardingState_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
