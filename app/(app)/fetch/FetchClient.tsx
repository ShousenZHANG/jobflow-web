"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as Progress from "@radix-ui/react-progress";

type FetchRunStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";

export function FetchClient() {
  const router = useRouter();
  const [queriesText, setQueriesText] = useState(
    '"junior software engineer", "backend engineer", "java developer"',
  );
  const [location, setLocation] = useState("Sydney, New South Wales, Australia");
  const [hoursOld, setHoursOld] = useState(48);
  const [resultsWanted, setResultsWanted] = useState(120);
  const [includeFromQueries, setIncludeFromQueries] = useState(false);
  const [filterDescription, setFilterDescription] = useState(true);

  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchRunStatus | null>(null);
  const [importedCount, setImportedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queries = useMemo(() => {
    return queriesText
      .split("|")
      .flatMap((chunk) => chunk.split(","))
      .map((s) => s.trim())
      .filter(Boolean);
  }, [queriesText]);

  async function createRun() {
    const res = await fetch("/api/fetch-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queries,
        location,
        hoursOld,
        resultsWanted,
        includeFromQueries,
        filterDescription,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to create run");
    return json.id as string;
  }

  async function triggerRun(id: string) {
    const res = await fetch(`/api/fetch-runs/${id}/trigger`, { method: "POST" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to trigger run");
  }

  async function fetchRun(id: string) {
    const res = await fetch(`/api/fetch-runs/${id}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to fetch run");
    return json.run as { status: FetchRunStatus; importedCount: number; error: string | null };
  }

  useEffect(() => {
    if (!runId) return;
    let alive = true;
    const t = setInterval(async () => {
      try {
        const r = await fetchRun(runId);
        if (!alive) return;
        setStatus(r.status);
        setImportedCount(r.importedCount ?? 0);
        setError(r.error ?? null);
        if (r.status === "SUCCEEDED") {
          clearInterval(t);
        }
        if (r.status === "FAILED") {
          clearInterval(t);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Polling failed");
      }
    }, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [runId]);

  async function onSubmit() {
    setIsSubmitting(true);
    setError(null);
    try {
      const id = await createRun();
      setRunId(id);
      setStatus("QUEUED");
      await triggerRun(id);
      setStatus("RUNNING");
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  const progressValue = status === "SUCCEEDED" ? 100 : status === "RUNNING" ? 60 : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-emerald-500/20 bg-zinc-950 p-5 shadow-sm glow">
        <div className="text-sm text-zinc-400 mb-2">Queries (comma or | separated)</div>
        <textarea
          className="w-full rounded-xl border border-emerald-500/20 bg-zinc-950 p-3 text-emerald-100"
          rows={3}
          value={queriesText}
          onChange={(e) => setQueriesText(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="rounded-2xl border border-emerald-500/20 bg-zinc-950 p-5 flex flex-col gap-2 shadow-sm">
          <div className="text-sm text-zinc-400">Location</div>
          <input
            className="rounded-xl border border-emerald-500/20 bg-zinc-950 p-2 text-emerald-100"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <label className="rounded-2xl border border-emerald-500/20 bg-zinc-950 p-5 flex flex-col gap-2 shadow-sm">
          <div className="text-sm text-zinc-400">Hours old</div>
          <input
            className="rounded-xl border border-emerald-500/20 bg-zinc-950 p-2 text-emerald-100"
            type="number"
            value={hoursOld}
            onChange={(e) => setHoursOld(Number(e.target.value))}
          />
        </label>

        <label className="rounded-2xl border border-emerald-500/20 bg-zinc-950 p-5 flex flex-col gap-2 shadow-sm">
          <div className="text-sm text-zinc-400">Results wanted (per query)</div>
          <input
            className="rounded-xl border border-emerald-500/20 bg-zinc-950 p-2 text-emerald-100"
            type="number"
            value={resultsWanted}
            onChange={(e) => setResultsWanted(Number(e.target.value))}
          />
        </label>

        <label className="rounded-2xl border border-emerald-500/20 bg-zinc-950 p-5 flex items-center justify-between gap-2 shadow-sm">
          <div>
            <div className="text-sm text-zinc-400">Filter description</div>
            <div className="text-xs text-zinc-500">Exclude years-of-exp / work-rights jobs</div>
          </div>
          <input
            type="checkbox"
            checked={filterDescription}
            onChange={(e) => setFilterDescription(e.target.checked)}
          />
        </label>

        <label className="rounded-2xl border border-emerald-500/20 bg-zinc-950 p-5 flex items-center justify-between gap-2 shadow-sm md:col-span-2">
          <div>
            <div className="text-sm text-zinc-400">Include from queries</div>
            <div className="text-xs text-zinc-500">Require title to contain a query phrase</div>
          </div>
          <input
            type="checkbox"
            checked={includeFromQueries}
            onChange={(e) => setIncludeFromQueries(e.target.checked)}
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="rounded-full border border-emerald-500/30 px-4 py-2 text-emerald-200 disabled:opacity-50"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Starting..." : "Start fetch"}
        </button>

        <button className="text-sm text-emerald-200 underline" onClick={() => router.push("/jobs")}>
          View jobs
        </button>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-zinc-950 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-400">Run</div>
          <span className="text-xs text-zinc-500">{status ?? "-"}</span>
        </div>
        <div className="font-mono text-sm mt-2 text-emerald-200">
          id={runId ?? "-"} imported={importedCount}
        </div>

        <div className="mt-4">
          <Progress.Root
            className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-900"
            value={progressValue}
          >
            <Progress.Indicator
              className={`h-full w-full rounded-full bg-emerald-400 transition ${
                status === "RUNNING" ? "animate-pulse" : ""
              }`}
              style={{ transform: `translateX(-${100 - progressValue}%)` }}
            />
          </Progress.Root>
          <div className="mt-2 text-xs text-zinc-500">
            {status === "RUNNING"
              ? "Fetching and importing..."
              : status === "SUCCEEDED"
                ? "Completed successfully"
                : status === "FAILED"
                  ? "Run failed"
                  : "Idle"}
          </div>
        </div>

        {error ? <div className="text-sm text-rose-300 mt-2">{error}</div> : null}
      </div>
    </div>
  );
}

