"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  /** Whether the preview has a debounced render queued. */
  isPending?: boolean;
  /** Enable legacy idle refresh. Disabled in the Jobs review dialog. */
  autoRefresh?: boolean;
}

const IDLE_REFRESH_MS = 30_000;

export function PdfPreview({
  pdfUrl,
  jobTitle,
  onRefresh,
  isRefreshing,
  lastRefreshedAt,
  isPending = false,
  autoRefresh = true,
}: PdfPreviewProps) {
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastLabel, setLastLabel] = useState<string | null>(null);
  const previewSrc = useMemo(
    () => (pdfUrl ? withPreviewCacheBust(pdfUrl, lastRefreshedAt) : null),
    [lastRefreshedAt, pdfUrl],
  );

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
    if (!autoRefresh) return;
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
  }, [autoRefresh, onRefresh]);

  return (
    <aside className="relative flex h-full min-h-[560px] flex-col overflow-hidden rounded-[1.65rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-3 shadow-[0_26px_70px_-44px_rgba(15,23,42,0.62),0_8px_24px_-20px_rgba(15,23,42,0.28)] ring-1 ring-white/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brand-emerald-300/70 to-transparent"
      />
      <header className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/90 px-3 py-2.5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-brand-emerald-50 text-brand-emerald-700 ring-1 ring-brand-emerald-100">
            <FileText className="h-4 w-4" aria-hidden />
          </span>
          <span>PDF preview</span>
        </div>
        <div className="flex items-center gap-2">
          {isPending ? (
            <span className="rounded-full bg-brand-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-brand-emerald-700 ring-1 ring-brand-emerald-100">
              Updating soon
            </span>
          ) : lastLabel ? (
            <span className="text-[11px] font-medium text-muted-foreground">
              Last: {lastLabel}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => void onRefresh()}
            disabled={isRefreshing}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-foreground shadow-sm transition-all",
              "hover:-translate-y-px hover:border-brand-emerald-200 hover:bg-brand-emerald-50/60 hover:text-brand-emerald-800 hover:shadow-md",
              "active:translate-y-0 active:shadow-sm",
              "disabled:pointer-events-none disabled:opacity-60",
            )}
          >
            <RefreshCcw
              className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")}
              aria-hidden
            />
            {isRefreshing ? "Rendering..." : "Refresh"}
          </button>
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden rounded-[1.35rem] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.14),transparent_34%),linear-gradient(180deg,#e9f1f4_0%,#f8fafc_42%,#eef2f7_100%)] p-3 shadow-inner ring-1 ring-slate-900/10">
        {previewSrc ? (
          <div className="h-full overflow-hidden rounded-xl bg-white shadow-[0_22px_56px_-30px_rgba(15,23,42,0.62),0_8px_18px_-12px_rgba(15,23,42,0.26)] ring-1 ring-slate-900/10">
            <iframe
              key={previewSrc}
              src={previewSrc}
              title={`PDF preview - ${jobTitle}`}
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300/80 bg-white/70 text-sm text-muted-foreground shadow-inner">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileText className="h-6 w-6" aria-hidden />
            </span>
            <span>No preview yet - click Refresh to render.</span>
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

function withPreviewCacheBust(url: string, refreshedAt: number | null): string {
  if (!refreshedAt) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}preview=${refreshedAt}`;
}
