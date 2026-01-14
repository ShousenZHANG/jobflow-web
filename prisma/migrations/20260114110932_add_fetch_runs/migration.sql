-- CreateEnum
CREATE TYPE "FetchRunStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "FetchRun" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "userEmail" TEXT NOT NULL,
    "status" "FetchRunStatus" NOT NULL DEFAULT 'QUEUED',
    "error" TEXT,
    "importedCount" INTEGER NOT NULL DEFAULT 0,
    "queries" JSONB NOT NULL,
    "location" TEXT,
    "hoursOld" INTEGER,
    "resultsWanted" INTEGER,
    "includeFromQueries" BOOLEAN NOT NULL DEFAULT false,
    "filterDescription" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FetchRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FetchRun_userId_createdAt_idx" ON "FetchRun"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "FetchRun_userId_status_idx" ON "FetchRun"("userId", "status");

-- AddForeignKey
ALTER TABLE "FetchRun" ADD CONSTRAINT "FetchRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
