-- CreateTable
CREATE TABLE "DiscoverVideoCache" (
    "key" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscoverVideoCache_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "DiscoverVideoCache_expiresAt_idx" ON "DiscoverVideoCache"("expiresAt");
