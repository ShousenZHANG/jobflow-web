-- CreateEnum
CREATE TYPE "ApplicationBatchScope" AS ENUM ('NEW');

-- CreateEnum
CREATE TYPE "ApplicationBatchStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ApplicationBatchTaskStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "ApplicationBatch" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "scope" "ApplicationBatchScope" NOT NULL DEFAULT 'NEW',
    "status" "ApplicationBatchStatus" NOT NULL DEFAULT 'QUEUED',
    "totalCount" INTEGER NOT NULL,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationBatchTask" (
    "id" UUID NOT NULL,
    "batchId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "status" "ApplicationBatchTaskStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationBatchTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationBatch_userId_createdAt_idx" ON "ApplicationBatch"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicationBatch_userId_status_updatedAt_idx" ON "ApplicationBatch"("userId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "ApplicationBatchTask_batchId_status_createdAt_idx" ON "ApplicationBatchTask"("batchId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicationBatchTask_userId_status_createdAt_idx" ON "ApplicationBatchTask"("userId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationBatchTask_batchId_jobId_key" ON "ApplicationBatchTask"("batchId", "jobId");

-- AddForeignKey
ALTER TABLE "ApplicationBatch" ADD CONSTRAINT "ApplicationBatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationBatchTask" ADD CONSTRAINT "ApplicationBatchTask_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ApplicationBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationBatchTask" ADD CONSTRAINT "ApplicationBatchTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationBatchTask" ADD CONSTRAINT "ApplicationBatchTask_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
