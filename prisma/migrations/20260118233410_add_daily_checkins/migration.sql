-- CreateTable
CREATE TABLE "DailyCheckin" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "localDate" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyCheckin_userId_localDate_idx" ON "DailyCheckin"("userId", "localDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCheckin_userId_localDate_key" ON "DailyCheckin"("userId", "localDate");

-- AddForeignKey
ALTER TABLE "DailyCheckin" ADD CONSTRAINT "DailyCheckin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
