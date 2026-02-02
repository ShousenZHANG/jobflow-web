ALTER TABLE "ResumeProfile" ADD COLUMN "experiences" JSONB;

ALTER TABLE "ResumeProfile" DROP COLUMN "latestRoleTitle";
ALTER TABLE "ResumeProfile" DROP COLUMN "latestCompany";
ALTER TABLE "ResumeProfile" DROP COLUMN "latestLocation";
ALTER TABLE "ResumeProfile" DROP COLUMN "latestStart";
ALTER TABLE "ResumeProfile" DROP COLUMN "latestEnd";
ALTER TABLE "ResumeProfile" DROP COLUMN "latestBullets";
