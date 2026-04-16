-- AlterTable
ALTER TABLE "Job" ADD COLUMN "matchScore" DOUBLE PRECISION;
ALTER TABLE "Job" ADD COLUMN "matchBreakdown" JSONB;
ALTER TABLE "Job" ADD COLUMN "scoredAt" TIMESTAMP(3);
ALTER TABLE "Job" ADD COLUMN "scoredProfileVersion" INTEGER;

-- CreateIndex
CREATE INDEX "Job_userId_matchScore_idx" ON "Job"("userId", "matchScore");
