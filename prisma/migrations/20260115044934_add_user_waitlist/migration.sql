-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('WAITING', 'APPROVED', 'BLOCKED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'WAITING';
