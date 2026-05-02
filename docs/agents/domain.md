# Domain Docs

This is a single-context Joblit repo. Engineering skills should use one root `CONTEXT.md` for domain language and root `docs/adr/` for architectural decisions.

## Before exploring

Read these when they exist:

- `CONTEXT.md`
- `docs/adr/`

If either file does not exist, proceed silently. Do not create them upfront. `/grill-with-docs` creates them lazily when domain terms or architectural decisions are resolved.

## Domain vocabulary

Use the glossary vocabulary from `CONTEXT.md` when naming domain concepts in issue titles, hypotheses, tests, refactor proposals, and implementation notes.

Important existing Joblit concepts include:

- Job
- FetchRun
- ResumeProfile
- ActiveResumeProfile
- ApplicationBatch
- application artifact
- manual-generate
- promptMeta
- locale profile

If a needed concept is missing from `CONTEXT.md`, treat that as a signal to clarify it through `/grill-with-docs`.

## ADR conflicts

If a proposed change contradicts an ADR in `docs/adr/`, surface the conflict explicitly before proceeding.
