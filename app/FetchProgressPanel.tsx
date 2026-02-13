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
    queryTitle,
    queryTerms,
    smartExpand,
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
        : status === "RUNNING"
          ? "bg-blue-100 text-blue-700"
          : "bg-muted text-muted-foreground";
  const shownTerms = queryTerms.slice(0, 6);
  const hiddenTerms = Math.max(0, queryTerms.length - shownTerms.length);

  if (!open && runId) {
    return (
      <button
        className="edu-outline edu-cta--press edu-outline--compact fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-2 text-xs font-medium"
        onClick={() => setOpen(true)}
        aria-label="Open fetch progress"
      >
        <span
          className={`h-2 w-2 rounded-full ${
            status === "RUNNING" || status === "QUEUED"
              ? "bg-blue-500"
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
    <div className="fixed bottom-6 right-6 z-50 w-[340px] rounded-3xl border-2 border-slate-900/10 bg-white/90 p-4 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition-all">
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
        {queryTerms.length ? (
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2">
            <div className="text-[11px] text-muted-foreground">
              {smartExpand && queryTitle
                ? `Smart fetch expanded "${queryTitle}" into ${queryTerms.length} role queries.`
                : `Role queries in this run (${queryTerms.length}).`}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {shownTerms.map((term) => (
                <span
                  key={term}
                  className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700"
                >
                  {term}
                </span>
              ))}
              {hiddenTerms ? (
                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-500">
                  +{hiddenTerms} more
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
        <Progress
          value={progressValue}
          className="h-2 bg-emerald-100/70"
          indicatorClassName="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.35)] transition-all duration-500 ease-out"
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
          <Button
            variant="outline"
            className="edu-outline edu-cta--press edu-outline--compact w-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-700"
            onClick={cancelRun}
          >
            Cancel fetch
          </Button>
        ) : null}
      </div>
    </div>
  );
}
