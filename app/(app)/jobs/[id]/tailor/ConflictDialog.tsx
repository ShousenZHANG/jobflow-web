"use client";

import { AlertTriangle } from "lucide-react";

interface ConflictDialogProps {
  onReload: () => void;
  onOverwrite: () => void;
}

/**
 * Multi-tab conflict dialog: shown when an autosave receives 409
 * STALE_WRITE because another tab has updated the same Application.
 *
 * Reload  -> discard local in-progress edits, refetch from server.
 * Overwrite -> kept as Reload for safety in v1; Phase 4 may wire a
 * /draft?force=true endpoint.
 */
export function ConflictDialog({ onReload, onOverwrite }: ConflictDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-background p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.5)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="conflict-title"
              className="text-base font-semibold tracking-tight text-foreground"
            >
              Another tab updated this draft
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your edits could not be saved because the same Application was
              modified in another tab or window. Reload to see the latest
              version. Local edits since the last save will be lost.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onOverwrite}
            className="inline-flex h-9 items-center rounded-full border border-border/70 bg-background px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Keep my edits
          </button>
          <button
            type="button"
            onClick={onReload}
            className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-px hover:bg-foreground/90"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}
