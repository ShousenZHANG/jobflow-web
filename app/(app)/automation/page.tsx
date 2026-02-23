import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

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
4) Loop: POST /api/application-batches/{batchId}/execute with body {"maxSteps":20}
5) After each loop, call GET /api/application-batches/{batchId}/summary
6) Stop when remainingCount is 0 OR batch.status is SUCCEEDED/FAILED/CANCELLED
7) Return final report:
   - total tasks, succeeded, failed
   - top 10 failed jobs with reason
Do not click unrelated UI. Prefer API-first execution.`;

const PROMPT_RETRY = `Use Playwright MCP to retry failed tasks:
1) Read current active batch from GET /api/application-batches/active
2) POST /api/application-batches/{batchId}/retry-failed with body {"limit":100}
3) Execute the new batch with the same execute loop strategy
4) Return final failed list only`;

function PromptBlock({ title, content }: { title: string; content: string }) {
  return (
    <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-6 text-slate-700">
        {content}
      </pre>
    </section>
  );
}

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
            <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 text-xs leading-6 text-slate-700">
              {MCP_CONFIG}
            </pre>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Step 2: Verify Connection</h2>
            <p className="mt-1 text-xs text-slate-600">
              In a blank Codex chat, run this exact prompt first.
            </p>
          </section>
          <PromptBlock title="Prompt A - Setup Verification" content={PROMPT_VERIFY} />

          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Step 3: Run Full Batch</h2>
            <p className="mt-1 text-xs text-slate-600">
              Use this as the main daily command after you finish manual filtering.
            </p>
          </section>
          <PromptBlock title="Prompt B - Full Batch Execution" content={PROMPT_RUN} />

          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Step 4: Retry Failed Tasks</h2>
            <p className="mt-1 text-xs text-slate-600">
              Use this when summary reports failures.
            </p>
          </section>
          <PromptBlock title="Prompt C - Retry Failed" content={PROMPT_RETRY} />
        </div>
      </section>
    </main>
  );
}
