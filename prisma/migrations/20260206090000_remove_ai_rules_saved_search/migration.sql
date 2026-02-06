-- Remove deprecated AI-rules storage and unused saved search table.
DROP TABLE IF EXISTS "AiPromptProfile" CASCADE;
DROP TABLE IF EXISTS "UserAiProviderConfig" CASCADE;
DROP TABLE IF EXISTS "SavedSearch" CASCADE;

DO $$ BEGIN
  DROP TYPE "AiProvider";
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;