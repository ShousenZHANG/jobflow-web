-- Enable pg_trgm extension for trigram-based fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram GIN indexes for ILIKE middle-match acceleration on search fields
CREATE INDEX idx_job_title_trgm ON "Job" USING gin (title gin_trgm_ops);
CREATE INDEX idx_job_company_trgm ON "Job" USING gin (company gin_trgm_ops);
CREATE INDEX idx_job_location_trgm ON "Job" USING gin (location gin_trgm_ops);

-- B-tree index for jobLevel exact/insensitive match
CREATE INDEX idx_job_user_joblevel ON "Job" ("userId", "jobLevel");
