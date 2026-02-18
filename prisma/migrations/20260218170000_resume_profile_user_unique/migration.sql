WITH ranked AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "userId"
      ORDER BY "updatedAt" DESC, "createdAt" DESC, "id" DESC
    ) AS rn
  FROM "ResumeProfile"
)
DELETE FROM "ResumeProfile" p
USING ranked r
WHERE p."id" = r."id"
  AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS "ResumeProfile_userId_key"
ON "ResumeProfile"("userId");
