-- Fix FieldMappingRule: nullable columns in unique constraint cause upsert failures.
-- PostgreSQL treats NULL != NULL, so upsert where-clause never matches existing rows.
-- Convert atsProvider and pageDomain from nullable to non-null with default "".

-- First, update any existing NULL values to empty string
UPDATE "FieldMappingRule" SET "atsProvider" = '' WHERE "atsProvider" IS NULL;
UPDATE "FieldMappingRule" SET "pageDomain" = '' WHERE "pageDomain" IS NULL;

-- Drop the old unique constraint and indexes that reference nullable columns
DROP INDEX IF EXISTS "FieldMappingRule_userId_fieldSelector_atsProvider_pageDomain_key";
DROP INDEX IF EXISTS "FieldMappingRule_userId_atsProvider_fieldLabel_idx";
DROP INDEX IF EXISTS "FieldMappingRule_userId_pageDomain_idx";

-- Alter columns to non-null with default
ALTER TABLE "FieldMappingRule" ALTER COLUMN "atsProvider" SET DEFAULT '';
ALTER TABLE "FieldMappingRule" ALTER COLUMN "atsProvider" SET NOT NULL;
ALTER TABLE "FieldMappingRule" ALTER COLUMN "pageDomain" SET DEFAULT '';
ALTER TABLE "FieldMappingRule" ALTER COLUMN "pageDomain" SET NOT NULL;

-- Recreate unique constraint and indexes
CREATE UNIQUE INDEX "FieldMappingRule_userId_fieldSelector_atsProvider_pageDomain_key"
  ON "FieldMappingRule"("userId", "fieldSelector", "atsProvider", "pageDomain");
CREATE INDEX "FieldMappingRule_userId_atsProvider_fieldLabel_idx"
  ON "FieldMappingRule"("userId", "atsProvider", "fieldLabel");
CREATE INDEX "FieldMappingRule_userId_pageDomain_idx"
  ON "FieldMappingRule"("userId", "pageDomain");
