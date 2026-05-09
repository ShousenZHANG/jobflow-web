-- ApplicationStatus enum + edit-workflow columns on Application.
-- See docs/adr/0001-application-aicontent-provenance.md and
-- docs/adr/0002-unified-tailor-edit-flow.md for context.

CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'FINAL');

ALTER TABLE "Application"
  ADD COLUMN "status" "ApplicationStatus" NOT NULL DEFAULT 'FINAL',
  ADD COLUMN "aiContent" JSONB,
  ADD COLUMN "aiContentHash" TEXT;

-- All pre-existing rows are treated as already-finalized. Their
-- aiContent stays NULL; opening them in the editor prompts the user
-- to re-generate since AI provenance is not recoverable retroactively.
