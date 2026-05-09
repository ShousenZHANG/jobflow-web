"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCcw, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfPreviewProps {
  /** Current rendered PDF URL. May be null on first load. */
  pdfUrl: string | null;
  /** Title used for the iframe a11y title. */
  jobTitle: string;
  /** Triggered when the user clicks Refresh or after 30s idle. */
  onRefresh: () => Promise<void> | void;
  /** Render-in-progress flag. */
  isRefreshing: boolean;
  /**
   * Timestamp (ms) of the last successful render. Used for the
   * "Last refresh: Xs ago" hint.
   */
  lastRefreshedAt: number | null;
}

const IDLE_REFRESH_MS = 30_000;

export function PdfPreview({
  pdfUrl,
  jobTitle,
  onRefresh,
  isRefreshing,
  lastRefreshedAt,
}: PdfPreviewProps) {
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastLabel, setLastLabel] = useState<string | null>(null);

  // Tick "Last refresh: Xs ago" every 5s. setState only fires inside
  // timer callbacks (subscription handlers), never synchronously in
  // the effect body, to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    if (!lastRefreshedAt) return;
    function tick() {
      setLastLabel(formatRelative(Date.now() - lastRefreshedAt!));
    }
    const initial = setTimeout(tick, 0);
    const id = setInterval(tick, 5_000);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [lastRefreshedAt]);

  // 30s-idle auto-refresh: any keypress / pointer-move resets the timer;
  // when the timer expires, kick a refresh once. Only re-arms when
  // the user resumes activity.
  useEffect(() => {
    function arm() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        void onRefresh();
      }, IDLE_REFRESH_MS);
    }
    function onActivity() {
      arm();
    }
    arm();
    window.addEventListener("keydown", onActivity);
    window.addEventListener("pointermove", onActivity);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("pointermove", onActivity);
    };
  }, [onRefresh]);

  return (
    <aside className="flex h-full min-h-[500px] flex-col gap-3 rounded-2xl border border-border/60 bg-background p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="h-4 w-4 text-brand-emerald-700" aria-hidden />
          PDF preview
        </div>
        <div className="flex items-center gap-2">
          {lastLabel ? (
            <span className="text-[11px] text-muted-foreground">
              Last: {lastLabel}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => void onRefresh()}
            disabled={isRefreshing}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 text-xs font-semibold text-foreground transition-colors",
              "hover:border-brand-emerald-300/60 hover:bg-muted",
              "disabled:pointer-events-none disabled:opacity-60",
            )}
          >
            <RefreshCcw
              className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")}
              aria-hidden
            />
            {isRefreshing ? "Rendering…" : "Refresh"}
          </button>
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
        {pdfUrl ? (
          <iframe
            key={pdfUrl}
            src={pdfUrl}
            title={`Resume preview · ${jobTitle}`}
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-8 w-8 text-muted-foreground/50" aria-hidden />
            <span>No preview yet — click Refresh to render.</span>
          </div>
        )}
      </div>
    </aside>
  );
}

function formatRelative(diffMs: number): string {
  if (diffMs < 5_000) return "just now";
  if (diffMs < 60_000) return `${Math.floor(diffMs / 1_000)}s ago`;
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  return `${Math.floor(diffMs / 3_600_000)}h ago`;
}
