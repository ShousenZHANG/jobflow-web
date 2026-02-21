-- Move from one-resume-per-user to multi-resume profiles with an explicit active pointer.
ALTER TABLE "ResumeProfile"
  DROP CONSTRAINT IF EXISTS "ResumeProfile_userId_key";

ALTER TABLE "ResumeProfile"
  ADD COLUMN IF NOT EXISTS "name" TEXT NOT NULL DEFAULT 'Custom Blank',
  ADD COLUMN IF NOT EXISTS "revision" INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS "ActiveResumeProfile" (
  "userId" UUID NOT NULL,
  "resumeProfileId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActiveResumeProfile_pkey" PRIMARY KEY ("userId"),
  CONSTRAINT "ActiveResumeProfile_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ActiveResumeProfile_resumeProfileId_fkey"
    FOREIGN KEY ("resumeProfileId") REFERENCES "ResumeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ActiveResumeProfile_resumeProfileId_idx"
  ON "ActiveResumeProfile"("resumeProfileId");

CREATE INDEX IF NOT EXISTS "ResumeProfile_userId_name_idx"
  ON "ResumeProfile"("userId", "name");

-- Backfill active pointer for existing users by latest updated profile.
INSERT INTO "ActiveResumeProfile" ("userId", "resumeProfileId", "createdAt", "updatedAt")
SELECT rp."userId", rp."id", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (
  SELECT DISTINCT ON ("userId") "id", "userId"
  FROM "ResumeProfile"
  ORDER BY "userId", "updatedAt" DESC, "createdAt" DESC
) rp
ON CONFLICT ("userId") DO NOTHING;
