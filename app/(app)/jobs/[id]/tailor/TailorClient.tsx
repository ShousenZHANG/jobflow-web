"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { fetchJson, ApiError } from "@/lib/api/fetchJson";
import type { AiContent } from "@/lib/shared/schemas/aiContent";
import { cn } from "@/lib/utils";
import { useTailorDraft } from "./useTailorDraft";
import { SaveIndicator } from "./SaveIndicator";
import { SummarySection } from "./SummarySection";
import { BulletsSection } from "./BulletsSection";
import { PdfPreview } from "./PdfPreview";

interface TailorClientProps {
  applicationId: string;
  initialStatus: "DRAFT" | "FINAL";
  initialAiContent: AiContent;
  initialAiContentHash: string | null;
  resumePdfUrl: string | null;
  coverPdfUrl: string | null;
  job: {
    id: string | null;
    title: string;
    company: string | null;
    location: string | null;
    market: string;
  };
}

export function TailorClient({
  applicationId,
  initialStatus,
  initialAiContent,
  initialAiContentHash,
  resumePdfUrl,
  job,
}: TailorClientProps) {
  const router = useRouter();
  const draft = useTailorDraft({
    applicationId,
    initialAiContent,
    initialAiContentHash,
  });

  const [status, setStatus] = useState<"DRAFT" | "FINAL">(initialStatus);
  const [pdfUrl, setPdfUrl] = useState<string | null>(resumePdfUrl);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number | null>(
    resumePdfUrl ? Date.now() : null,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function patchSummary(summary: AiContent["cv"]["summary"]) {
    draft.setAiContent({
      ...draft.aiContent,
      cv: { ...draft.aiContent.cv, summary },
    });
  }

  function patchLatestExperience(le: AiContent["cv"]["latestExperience"]) {
    draft.setAiContent({
      ...draft.aiContent,
      cv: { ...draft.aiContent.cv, latestExperience: le },
    });
  }

  async function handleRefresh() {
    setActionError(null);
    setIsRefreshing(true);
    try {
      await draft.flushNow();
      const json = await fetchJson<undefined>(
        `/api/applications/${applicationId}/finalize`,
        {
          method: "POST",
          body: JSON.stringify({ expectedHash: draft.currentHash }),
        },
      );
      const data = json as { resumePdfUrl: string; status: "FINAL" };
      setPdfUrl(data.resumePdfUrl);
      setLastRefreshedAt(Date.now());
      // Refresh re-finalizes; flip back to DRAFT only if user keeps editing.
      setStatus("FINAL");
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Refresh failed";
      setActionError(message);
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleFinalize() {
    setActionError(null);
    setIsFinalizing(true);
    try {
      await draft.flushNow();
      const json = await fetchJson<undefined>(
        `/api/applications/${applicationId}/finalize`,
        {
          method: "POST",
          body: JSON.stringify({ expectedHash: draft.currentHash }),
        },
      );
      const data = json as { resumePdfUrl: string };
      setPdfUrl(data.resumePdfUrl);
      setStatus("FINAL");
      router.push("/jobs");
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Finalize failed";
      setActionError(message);
    } finally {
      setIsFinalizing(false);
    }
  }

  async function handleDiscard() {
    if (
      !window.confirm(
        "Discard your edits and reset to the original AI proposal?",
      )
    )
      return;
    setActionError(null);
    setIsDiscarding(true);
    try {
      const json = await fetchJson<undefined>(
        `/api/applications/${applicationId}/discard`,
        { method: "POST" },
      );
      const data = json as { aiContent: AiContent; aiContentHash: string };
      draft.replaceFromServer(data.aiContent, data.aiContentHash);
      setStatus("DRAFT");
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Discard failed";
      setActionError(message);
    } finally {
      setIsDiscarding(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 pb-32 pt-6 lg:px-8">
      <header className="flex flex-wrap items-center gap-4">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to jobs
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {job.title}
            {job.company ? (
              <span className="text-muted-foreground"> · {job.company}</span>
            ) : null}
          </h1>
          {job.location ? (
            <p className="truncate text-xs text-muted-foreground">
              {job.location}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={status} />
          <SaveIndicator status={draft.saveStatus} />
        </div>
      </header>

      {actionError ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive"
        >
          {actionError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-4">
          <SummarySection
            summary={draft.aiContent.cv.summary}
            onChange={patchSummary}
          />
          <BulletsSection
            latestExperience={draft.aiContent.cv.latestExperience}
            onChange={patchLatestExperience}
          />
          {/* Phase 2 unlocks Skills + Cover Letter sections here. */}
        </div>

        <PdfPreview
          pdfUrl={pdfUrl}
          jobTitle={job.title}
          isRefreshing={isRefreshing}
          lastRefreshedAt={lastRefreshedAt}
          onRefresh={handleRefresh}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={isDiscarding}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full border border-border/70 bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:border-brand-emerald-300/60 hover:bg-muted",
              "disabled:pointer-events-none disabled:opacity-60",
            )}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            {isDiscarding ? "Discarding…" : "Discard changes"}
          </button>
          <button
            type="button"
            onClick={handleFinalize}
            disabled={isFinalizing}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-[0_8px_20px_-8px_rgba(15,23,42,0.4)] transition-all hover:-translate-y-px hover:bg-foreground/90 hover:shadow-[0_12px_28px_-10px_rgba(15,23,42,0.5)]",
              "disabled:pointer-events-none disabled:opacity-60",
            )}
          >
            {isFinalizing ? "Finalizing…" : "Finalize"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </main>
  );
}

function StatusPill({ status }: { status: "DRAFT" | "FINAL" }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold uppercase tracking-wider",
        status === "FINAL"
          ? "bg-brand-emerald-100 text-brand-emerald-800"
          : "bg-amber-100 text-amber-800",
      )}
    >
      {status}
    </span>
  );
}
