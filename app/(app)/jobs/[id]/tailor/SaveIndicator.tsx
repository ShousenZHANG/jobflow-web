"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { SaveStatus } from "./useTailorDraft";

interface SaveIndicatorProps {
  status: SaveStatus;
}

function formatRelative(at: number): string {
  const diff = Math.max(0, Date.now() - at);
  if (diff < 5_000) return "just now";
  if (diff < 60_000) return `${Math.floor(diff / 1_000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

/**
 * Header status pill: 'Saved Xs ago' / 'Saving...' / 'Unsaved changes'
 * / 'Save failed'. Updates every 5s while idle so the relative text
 * stays fresh.
 */
export function SaveIndicator({ status }: SaveIndicatorProps) {
  const [savedLabel, setSavedLabel] = useState<string>("just now");
  useEffect(() => {
    if (status.kind !== "saved") return;
    const at = status.at;
    function tick() {
      setSavedLabel(formatRelative(at));
    }
    const initial = setTimeout(tick, 0);
    const id = setInterval(tick, 5_000);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [status]);

  if (status.kind === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        Saving…
      </span>
    );
  }
  if (status.kind === "dirty") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-amber-500"
        />
        Unsaved changes
      </span>
    );
  }
  if (status.kind === "error") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive"
        title={status.message}
      >
        <AlertCircle className="h-3.5 w-3.5" aria-hidden />
        Save failed — retry
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-emerald-700">
      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
      Saved {savedLabel}
    </span>
  );
}
