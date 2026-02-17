-- Add AI provenance metadata for job fit analysis.

ALTER TABLE "JobFitAnalysis"
ADD COLUMN "source" TEXT DEFAULT 'heuristic',
ADD COLUMN "aiEnhanced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "provider" TEXT,
ADD COLUMN "aiReason" TEXT;
