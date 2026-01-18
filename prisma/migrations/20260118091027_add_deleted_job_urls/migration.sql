-- CreateTable
CREATE TABLE "DeletedJobUrl" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "jobUrl" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletedJobUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeletedJobUrl_userId_deletedAt_idx" ON "DeletedJobUrl"("userId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedJobUrl_userId_jobUrl_key" ON "DeletedJobUrl"("userId", "jobUrl");

-- AddForeignKey
ALTER TABLE "DeletedJobUrl" ADD CONSTRAINT "DeletedJobUrl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
