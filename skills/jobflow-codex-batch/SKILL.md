---
name: jobflow-codex-batch
description: Execute Jobflow NEW-job batch tailoring in a deterministic Codex loop and persist CV/Cover PDFs with task-level status updates.
---

# Jobflow Codex Batch Skill

## Purpose

Run a deterministic, resumable batch loop that generates resume and cover outputs for filtered `NEW` jobs.

## Required Inputs

- `batchId` (UUID)
- `maxSteps` (default 1, recommended 3-5 per loop)
- External model output JSON for each target (`resume` and `cover`)

## API Sequence

1. Claim tasks
- `POST /api/application-batches/:id/codex-run`
- Read `tasks[]` and `context.promptMetaByTarget`

2. Build target prompt per task
- `POST /api/applications/prompt` with `{ jobId, target }`
- Use returned `prompt` and `expectedJsonSchema`

3. Import generated output
- `POST /api/applications/manual-generate` with:
  - `jobId`
  - `target`
  - `modelOutput` (strict JSON string)
  - `promptMeta` (echo from prompt response)

4. Mark task state
- `PATCH /api/application-batches/:id/tasks/:taskId`
- Status:
  - `SUCCEEDED` when both targets are imported
  - `FAILED` with concise `error` when unrecoverable

5. Check summary
- `GET /api/application-batches/:id/summary`

## Hard Rules

- Never skip `promptMeta` on manual import.
- Keep JSON strict: no markdown wrappers, no prose around JSON.
- Do not fabricate resume facts or unsupported claims.
- Fail fast with concise reason if parsing/validation fails.

## Completion Criteria

- No pending tasks in batch summary.
- Every processed task is `SUCCEEDED`, `FAILED`, or `SKIPPED`.
- Generated PDFs are downloadable from Jobflow UI.

