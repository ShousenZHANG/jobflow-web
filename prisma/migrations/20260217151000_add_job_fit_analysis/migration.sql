-- Add versioned job fit analysis cache for Jobs quick decision card.

CREATE TYPE "JobFitStatus" AS ENUM ('PENDING', 'READY', 'FAILED');
CREATE TYPE "JobFitGateStatus" AS ENUM ('PASS', 'RISK', 'BLOCK');

CREATE TABLE "JobFitAnalysis" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "resumeSnapshotUpdatedAt" TIMESTAMP(3) NOT NULL,
    "promptRuleVersion" INTEGER NOT NULL,
    "jobUpdatedAt" TIMESTAMP(3) NOT NULL,
    "analyzerVersion" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" "JobFitStatus" NOT NULL DEFAULT 'PENDING',
    "score" INTEGER,
    "gateStatus" "JobFitGateStatus",
    "recommendation" TEXT,
    "stackMatched" INTEGER,
    "stackTotal" INTEGER,
    "topGaps" JSONB,
    "gates" JSONB,
    "evidence" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobFitAnalysis_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "JobFitAnalysis_userId_jobId_resumeSnapshotUpdatedAt_promptRuleVersion_jobUpdatedAt_analyzerVersion_model_key"
ON "JobFitAnalysis"("userId", "jobId", "resumeSnapshotUpdatedAt", "promptRuleVersion", "jobUpdatedAt", "analyzerVersion", "model");

CREATE INDEX "JobFitAnalysis_userId_jobId_updatedAt_idx" ON "JobFitAnalysis"("userId", "jobId", "updatedAt");
CREATE INDEX "JobFitAnalysis_userId_status_idx" ON "JobFitAnalysis"("userId", "status");

ALTER TABLE "JobFitAnalysis"
ADD CONSTRAINT "JobFitAnalysis_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JobFitAnalysis"
ADD CONSTRAINT "JobFitAnalysis_jobId_fkey"
FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
