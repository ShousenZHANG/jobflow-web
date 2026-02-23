import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import PromptBlock from "./PromptBlock";
import SkillPackDownloadButton from "./SkillPackDownloadButton";

const MCP_CONFIG = `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--extension"],
      "env": {
        "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}`;

const PROMPT_VERIFY = `Use Playwright MCP to verify setup:
1) Open https://jobflow-web.vercel.app/jobs
2) If not signed in, stop and ask me to sign in first
3) Call GET /api/application-batches/active
4) Return a short result: batchId, status, updatedAt`;

const PROMPT_RUN = `Use Playwright MCP with my signed-in session:
1) Open https://jobflow-web.vercel.app/jobs
2) Create batch: POST /api/application-batches with body {"scope":"NEW","limit":200}
3) If response is ACTIVE_BATCH_EXISTS, reuse returned batchId
4) Initialize completedTasks as []
5) Loop:
   5a) POST /api/application-batches/{batchId}/run-once with body {"maxSteps":1,"completedTasks": completedTasks}
   5b) Reset completedTasks = []
   5c) For each task in response.tasks:
      - Build resume prompt: POST /api/applications/prompt with body {"jobId":"<task.jobId>","target":"resume"}.
      - Treat this response as the single source of truth for this job. Do not reuse static/local template text.
      - Generate strict JSON from the returned prompt, then import it:
        POST /api/applications/manual-generate with body {"jobId":"<task.jobId>","target":"resume","modelOutput":"<JSON string>","promptMeta":<resume promptMeta>}
      - Build cover prompt: POST /api/applications/prompt with body {"jobId":"<task.jobId>","target":"cover"}.
      - Treat this response as the single source of truth for this job. Do not reuse static/local template text.
      - Generate strict JSON from the returned prompt, then import it:
        POST /api/applications/manual-generate with body {"jobId":"<task.jobId>","target":"cover","modelOutput":"<JSON string>","promptMeta":<cover promptMeta>}
      - If both imports succeed, push {"taskId":"<taskId>","status":"SUCCEEDED"} into completedTasks
      - Otherwise push {"taskId":"<taskId>","status":"FAILED","error":"<reason>"} into completedTasks
   5d) After each loop, call GET /api/application-batches/{batchId}/summary
6) Stop when remainingCount is 0 OR batch.status is SUCCEEDED/FAILED/CANCELLED
7) Return final report:
   - total tasks, succeeded, failed
   - top 10 failed jobs with reason
Important: do NOT use /api/application-batches/{batchId}/execute in this flow.
Do not click unrelated UI. Prefer API-first execution.`;

const PROMPT_RETRY = `Use Playwright MCP to retry failed tasks:
1) Read current active batch from GET /api/application-batches/active
2) POST /api/application-batches/{batchId}/retry-failed with body {"limit":100}
3) Use the same run-once + applications/prompt + manual-generate loop strategy from Prompt B (do not use /execute)
4) Return final failed list only`;

const COMMAND_PRESET = `Recommended Cursor/Codex command aliases:
/jobflow-verify  -> Prompt A - Setup Verification
/jobflow-run     -> Prompt B - Full Batch Execution
/jobflow-retry   -> Prompt C - Retry Failed

Store these aliases in your local command snippets so users can run a single slash command daily.`;

export default async function AutomationPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/automation");

  return (
    <main className="flex h-full min-h-0 flex-1 flex-col gap-6">
      <section className="rounded-3xl border-2 border-slate-900/10 bg-white/80 p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.3)] backdrop-blur">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Cursor + Codex Automation Setup</h1>
          <p className="text-sm text-slate-600">
            Enterprise runbook for users who do not have repository access. Configure Playwright MCP once, then run
            deterministic batch generation from a blank Codex chat.
          </p>
        </div>

        <div className="grid gap-4">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Step 1: Configure Playwright MCP in Cursor</h2>
            <p className="mt-1 text-xs text-slate-600">
              Install the Playwright MCP browser extension, copy your extension token, and paste this server config in
              Cursor MCP settings.
            </p>
          </section>
          <PromptBlock title="Playwright MCP Config JSON" content={MCP_CONFIG} copyLabel="Copy MCP config JSON" />

          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Step 2: Download and Import Skill Pack</h2>
            <p className="mt-1 text-xs text-slate-600">
              Download from <code>/api/prompt-rules/skill-pack</code>, import the package into your Cursor/Codex
              workspace, then run all generation with that package as the source of truth.
            </p>
            <div className="mt-3">
              <SkillPackDownloadButton />
            </div>
          </section>

          <PromptBlock title="Slash Command Presets" content={COMMAND_PRESET} copyLabel="Copy command presets" />

          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Step 3: Verify Connection</h2>
            <p className="mt-1 text-xs text-slate-600">In a blank Codex chat, run this exact prompt first.</p>
          </section>
          <PromptBlock
            title="Prompt A - Setup Verification"
            content={PROMPT_VERIFY}
            copyLabel="Copy Prompt A"
          />

          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Step 4: Run Full Batch</h2>
            <p className="mt-1 text-xs text-slate-600">
              Use this as the main daily command after you finish manual filtering.
            </p>
          </section>
          <PromptBlock
            title="Prompt B - Full Batch Execution"
            content={PROMPT_RUN}
            copyLabel="Copy Prompt B"
          />

          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Step 5: Retry Failed Tasks</h2>
            <p className="mt-1 text-xs text-slate-600">
              Use this when summary reports failures.
            </p>
          </section>
          <PromptBlock title="Prompt C - Retry Failed" content={PROMPT_RETRY} copyLabel="Copy Prompt C" />
        </div>
      </section>
    </main>
  );
}
