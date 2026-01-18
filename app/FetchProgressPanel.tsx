"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFetchStatus } from "./FetchStatusContext";

export function FetchProgressPanel() {
  const {
    runId,
    status,
    importedCount,
    error,
    elapsedSeconds,
    open,
    setOpen,
    cancelRun,
  } = useFetchStatus();

  const isRunning = status === "RUNNING" || status === "QUEUED";
  const progressValue =
    status === "SUCCEEDED"
      ? 100
      : status === "FAILED"
        ? 0
        : status === "RUNNING"
          ? Math.min(92, 20 + Math.floor(elapsedSeconds * 2))
          : 10;
  const statusLabel =
    status === "RUNNING"
      ? "Running"
      : status === "QUEUED"
        ? "Queued"
        : status === "SUCCEEDED"
          ? "Completed"
          : status === "FAILED"
            ? "Failed"
            : "Starting";
  const statusTone =
    status === "FAILED"
      ? "bg-destructive/10 text-destructive"
      : status === "SUCCEEDED"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-muted text-muted-foreground";

  if (!open && runId) {
    return (
      <button
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-xs font-medium shadow-lg transition hover:bg-accent"
        onClick={() => setOpen(true)}
        aria-label="Open fetch progress"
      >
        <span
          className={`h-2 w-2 rounded-full ${
            status === "RUNNING" || status === "QUEUED"
              ? "bg-emerald-500"
              : status === "FAILED"
                ? "bg-destructive"
                : "bg-emerald-400"
          }`}
        />
        Fetch progress
      </button>
    );
  }

  if (!open || !runId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[340px] rounded-2xl border bg-background p-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">Fetch progress</div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusTone}`}>
            {statusLabel}
          </span>
        </div>
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
