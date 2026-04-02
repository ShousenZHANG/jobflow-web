"use client";
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
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

  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  if (!open && runId) {
    return (
      <button
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-200 bg-white/95 shadow-lg backdrop-blur transition-all hover:scale-105 hover:shadow-xl"
        onClick={() => setOpen(true)}
        aria-label="Open fetch progress"
      >
        <svg className="fetch-progress-ring h-11 w-11" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <circle
            cx="24" cy="24" r="22" fill="none"
            stroke={status === "FAILED" ? "#ef4444" : "#22c55e"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-slate-700">
          {status === "SUCCEEDED" ? "\u2713" : status === "FAILED" ? "\u2715" : `${progressValue}%`}
        </span>
        {isRunning && (
          <span className="absolute inset-0 animate-ping rounded-full border-2 border-emerald-400 opacity-20" />
        )}
      </button>
    );
  }

  if (!open || !runId) return null;

  const steps = [
    { label: "Queued", done: status !== "QUEUED" },
    { label: "Fetching", done: status === "SUCCEEDED" || status === "FAILED", active: status === "RUNNING" },
    { label: "Done", done: status === "SUCCEEDED", active: false },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-3xl border-2 border-slate-900/10 bg-white/90 p-4 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition-all">
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

      {/* Step indicator */}
      <div className="mt-3 flex items-center justify-between gap-1">
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-0.5">
              <div className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                step.done ? "bg-emerald-500 text-white" :
                step.active ? "animate-pulse bg-blue-500 text-white" :
                "bg-slate-200 text-slate-500"
              )}>
                {step.done ? "\u2713" : i + 1}
              </div>
              <span className="text-[10px] text-slate-500">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-0.5 flex-1", step.done ? "bg-emerald-400" : "bg-slate-200")} />
            )}
          </React.Fragment>
        ))}
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
        <div className={cn("mt-3", isRunning && "fetch-progress-shimmer")}>
          <Progress
            value={progressValue}
            className="h-2 bg-emerald-100/70"
            indicatorClassName="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.35)] transition-all duration-500 ease-out"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{progressValue}%</span>
          <span>Elapsed {elapsedSeconds}s</span>
        </div>
        {status === "SUCCEEDED" ? (
          <>
            <div className="relative overflow-hidden text-center">
              <ConfettiDots />
              <div className="text-sm font-semibold text-emerald-600">
                Imported {importedCount} new jobs
              </div>
            </div>
            <Button
              className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={() => setOpen(false)}
              asChild
            >
              <a href="/jobs">View Jobs</a>
            </Button>
          </>
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

function ConfettiDots() {
  const dots = [
    { color: "bg-emerald-400", x: -30, delay: "0ms" },
    { color: "bg-sky-400", x: 20, delay: "100ms" },
    { color: "bg-amber-400", x: -15, delay: "200ms" },
    { color: "bg-rose-400", x: 35, delay: "50ms" },
    { color: "bg-violet-400", x: -40, delay: "150ms" },
    { color: "bg-emerald-300", x: 10, delay: "250ms" },
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
      {dots.map((dot, i) => (
        <span
          key={i}
          className={`absolute h-1.5 w-1.5 rounded-full ${dot.color} animate-confetti-pop`}
          style={{
            "--confetti-x": `${dot.x}px`,
            animationDelay: dot.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
