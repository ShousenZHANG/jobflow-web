"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type FetchRunStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";

const RUN_ID_KEY = "jobflow_fetch_run_id";
const STARTED_AT_KEY = "jobflow_fetch_started_at";

export function FetchProgressPanel() {
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchRunStatus | null>(null);
  const [importedCount, setImportedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem(RUN_ID_KEY);
    const started = localStorage.getItem(STARTED_AT_KEY);
    if (id) {
      setRunId(id);
      setOpen(true);
    }
    if (started) {
      const ms = Number(started);
      if (!Number.isNaN(ms)) {
        const secs = Math.max(0, Math.floor((Date.now() - ms) / 1000));
        setElapsedSeconds(secs);
      }
    }
  }, []);

  useEffect(() => {
    function handleStart() {
      const id = localStorage.getItem(RUN_ID_KEY);
      const started = localStorage.getItem(STARTED_AT_KEY);
      if (id) {
        setRunId(id);
        setOpen(true);
      }
      if (started) {
        const ms = Number(started);
        if (!Number.isNaN(ms)) {
          const secs = Math.max(0, Math.floor((Date.now() - ms) / 1000));
          setElapsedSeconds(secs);
        }
      }
    }

    window.addEventListener("jobflow-fetch-started", handleStart);
    window.addEventListener("storage", handleStart);
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        handleStart();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("jobflow-fetch-started", handleStart);
      window.removeEventListener("storage", handleStart);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  async function fetchRun(id: string) {
    const res = await fetch(`/api/fetch-runs/${id}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to fetch run");
    return json.run as { status: FetchRunStatus; importedCount: number; error: string | null };
  }

  async function cancelRun() {
    if (!runId) return;
    try {
      const res = await fetch(`/api/fetch-runs/${runId}/cancel`, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to cancel run");
      setStatus("FAILED");
      setError("Cancelled by user");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to cancel run");
      }
    }
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
        if (r.status === "SUCCEEDED" || r.status === "FAILED") {
          clearInterval(t);
          localStorage.removeItem(RUN_ID_KEY);
          localStorage.removeItem(STARTED_AT_KEY);
        }
      } catch (e: unknown) {
        if (!alive) return;
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Polling failed");
        }
      }
    }, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [runId]);

  useEffect(() => {
    if (!open) return;
    if (status !== "RUNNING") return;
    const t = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status, open]);

  const isRunning = status === "RUNNING" || status === "QUEUED";
  const progressValue =
    status === "SUCCEEDED"
      ? 100
      : status === "FAILED"
        ? 0
        : status === "RUNNING"
          ? Math.min(92, 20 + Math.floor(elapsedSeconds * 2))
          : 10;

  if (!open || !runId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[320px] rounded-xl border bg-background p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Fetch progress</div>
        {!isRunning ? (
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="mt-2 space-y-2">
        <div className="text-xs text-muted-foreground">
          {status === "RUNNING"
            ? "We are collecting and importing results."
            : status === "SUCCEEDED"
              ? "Completed successfully."
              : status === "FAILED"
                ? "Fetch failed or cancelled."
                : "Queued and starting soon."}
        </div>
        <Progress
          value={progressValue}
          className="h-2 bg-emerald-100"
          indicatorClassName="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.45)]"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{progressValue}%</span>
          <span>Elapsed {elapsedSeconds}s</span>
        </div>
        {status === "SUCCEEDED" ? (
          <div className="text-sm text-emerald-600">Imported {importedCount} new jobs.</div>
        ) : null}
        {error ? <div className="text-sm text-destructive">{error}</div> : null}
        {isRunning ? (
          <Button variant="destructive" className="w-full" onClick={cancelRun}>
            Cancel fetch
          </Button>
        ) : null}
      </div>
    </div>
  );
}
