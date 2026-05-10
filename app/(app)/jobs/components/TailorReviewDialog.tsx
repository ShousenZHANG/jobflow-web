"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, FileText, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchJson, ApiError } from "@/lib/api/fetchJson";
import type { AiContent } from "@/lib/shared/schemas/aiContent";
import { cn } from "@/lib/utils";
import { BulletsSection } from "../[id]/tailor/BulletsSection";
import { ConflictDialog } from "../[id]/tailor/ConflictDialog";
import { CoverParagraphsSection } from "../[id]/tailor/CoverParagraphsSection";
import { PdfPreview } from "../[id]/tailor/PdfPreview";
import { SaveIndicator } from "../[id]/tailor/SaveIndicator";
import { SkillsSection } from "../[id]/tailor/SkillsSection";
import { SummarySection } from "../[id]/tailor/SummarySection";
import { useTailorDraft } from "../[id]/tailor/useTailorDraft";

type TailorTarget = "resume" | "cover";

export type TailorReviewDraft = {
  applicationId: string;
  target: TailorTarget;
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
  };
};

export type TailorReviewFinalized = {
  target: TailorTarget;
  resumePdfUrl?: string;
  resumePdfName?: string;
  coverPdfUrl?: string;
  coverPdfName?: string;
};

type TailorReviewDialogProps = {
  open: boolean;
  draft: TailorReviewDraft | null;
  onOpenChange: (open: boolean) => void;
  onFinalized: (result: TailorReviewFinalized) => void;
};

export function TailorReviewDialog({
  open,
  draft,
  onOpenChange,
  onFinalized,
}: TailorReviewDialogProps) {
  return (
    <Dialog open={open && !!draft} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="fixed left-2 top-2 flex h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none translate-x-0 translate-y-0 grid-rows-none flex-col gap-0 overflow-hidden rounded-2xl border-border/70 bg-background p-0 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.55)] sm:left-4 sm:top-4 sm:h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:max-w-none sm:rounded-3xl"
      >
        {draft ? (
          <TailorReviewDialogBody
            key={`${draft.applicationId}-${draft.target}`}
            draft={draft}
            onClose={() => onOpenChange(false)}
            onFinalized={onFinalized}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function TailorReviewDialogBody({
  draft: initialDraft,
  onClose,
  onFinalized,
}: {
  draft: TailorReviewDraft;
  onClose: () => void;
  onFinalized: (result: TailorReviewFinalized) => void;
}) {
  const draft = useTailorDraft({
    applicationId: initialDraft.applicationId,
    initialAiContent: initialDraft.initialAiContent,
    initialAiContentHash: initialDraft.initialAiContentHash,
  });
  const [status, setStatus] = useState<"DRAFT" | "FINAL">(
    initialDraft.initialStatus,
  );
  const [resumePdf, setResumePdf] = useState<string | null>(
    initialDraft.resumePdfUrl,
  );
  const [coverPdf, setCoverPdf] = useState<string | null>(
    initialDraft.coverPdfUrl,
  );
  const [lastResumeRefreshAt, setLastResumeRefreshAt] = useState<number | null>(
    initialDraft.resumePdfUrl ? Date.now() : null,
  );
  const [lastCoverRefreshAt, setLastCoverRefreshAt] = useState<number | null>(
    initialDraft.coverPdfUrl ? Date.now() : null,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showConflictDialog, setShowConflictDialog] = useState(false);

  const target = initialDraft.target;
  const targetLabel = target === "resume" ? "CV" : "Cover Letter";
  const currentPdf = target === "resume" ? resumePdf : coverPdf;
  const currentRefreshAt =
    target === "resume" ? lastResumeRefreshAt : lastCoverRefreshAt;
  const canClose = !isRefreshing && !isFinalizing;

  useEffect(() => {
    if (
      draft.saveStatus.kind === "error" &&
      draft.saveStatus.message.includes("Another tab")
    ) {
      setShowConflictDialog(true);
    }
  }, [draft.saveStatus]);

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

  function patchSkills(sa: AiContent["cv"]["skillsAdditions"]) {
    draft.setAiContent({
      ...draft.aiContent,
      cv: { ...draft.aiContent.cv, skillsAdditions: sa },
    });
  }

  function patchCover(cover: AiContent["cover"]) {
    draft.setAiContent({ ...draft.aiContent, cover });
  }

  const callFinalize = useCallback(async () => {
    const expectedHash = await draft.flushNow();
    const json = await fetchJson<undefined>(
      `/api/applications/${initialDraft.applicationId}/finalize?target=${target}`,
      {
        method: "POST",
        body: JSON.stringify({ expectedHash }),
      },
    );
    return json as {
      status: "FINAL";
      resumePdfUrl?: string;
      resumePdfName?: string;
      coverPdfUrl?: string;
      coverPdfName?: string;
    };
  }, [draft, initialDraft.applicationId, target]);

  async function handleRefresh() {
    setActionError(null);
    setIsRefreshing(true);
    try {
      const data = await callFinalize();
      applyFinalizedResult(data);
    } catch (err: unknown) {
      setActionError(extractMessage(err, "Preview render failed"));
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleFinalize() {
    setActionError(null);
    setIsFinalizing(true);
    try {
      const data = await callFinalize();
      applyFinalizedResult(data);
    } catch (err: unknown) {
      setActionError(extractMessage(err, "Finalize failed"));
    } finally {
      setIsFinalizing(false);
    }
  }

  function applyFinalizedResult(data: {
    status: "FINAL";
    resumePdfUrl?: string;
    resumePdfName?: string;
    coverPdfUrl?: string;
    coverPdfName?: string;
  }) {
    if (data.resumePdfUrl) {
      setResumePdf(data.resumePdfUrl);
      setLastResumeRefreshAt(Date.now());
    }
    if (data.coverPdfUrl) {
      setCoverPdf(data.coverPdfUrl);
      setLastCoverRefreshAt(Date.now());
    }
    setStatus("FINAL");
    onFinalized({
      target,
      resumePdfUrl: data.resumePdfUrl,
      resumePdfName: data.resumePdfName,
      coverPdfUrl: data.coverPdfUrl,
      coverPdfName: data.coverPdfName,
    });
  }

  async function handleDiscard() {
    setActionError(null);
    setIsDiscarding(true);
    try {
      const json = await fetchJson<undefined>(
        `/api/applications/${initialDraft.applicationId}/discard`,
        { method: "POST" },
      );
      const data = json as { aiContent: AiContent; aiContentHash: string };
      draft.replaceFromServer(data.aiContent, data.aiContentHash);
      setStatus("DRAFT");
    } catch (err: unknown) {
      setActionError(extractMessage(err, "Discard failed"));
    } finally {
      setIsDiscarding(false);
    }
  }

  return (
    <>
      <DialogHeader className="shrink-0 border-b border-border/70 bg-background/95 px-5 py-4 text-left backdrop-blur md:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <DialogTitle className="flex flex-wrap items-center gap-2 text-base md:text-lg">
              <span>Review tailored {targetLabel}</span>
              <StatusPill status={status} />
            </DialogTitle>
            <DialogDescription className="truncate text-xs md:text-sm">
              {initialDraft.job.title}
              {initialDraft.job.company ? ` | ${initialDraft.job.company}` : ""}
              {initialDraft.job.location ? ` | ${initialDraft.job.location}` : ""}
            </DialogDescription>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SaveIndicator status={draft.saveStatus} />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={!canClose}
              onClick={onClose}
              className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close review dialog"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogHeader>

      {actionError ? (
        <div
          role="alert"
          className="mx-5 mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive md:mx-6"
        >
          {actionError}
        </div>
      ) : null}

      <div className="grid min-h-0 flex-1 gap-4 overflow-hidden p-5 md:p-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(440px,1.05fr)]">
        <div className="min-h-0 overflow-y-auto pr-1">
          <div className="flex flex-col gap-4 pb-2">
            {target === "resume" ? (
              <>
                <SummarySection
                  summary={draft.aiContent.cv.summary}
                  onChange={patchSummary}
                />
                <BulletsSection
                  latestExperience={draft.aiContent.cv.latestExperience}
                  onChange={patchLatestExperience}
                />
                <SkillsSection
                  skillsAdditions={draft.aiContent.cv.skillsAdditions}
                  onChange={patchSkills}
                />
              </>
            ) : (
              <CoverParagraphsSection
                cover={draft.aiContent.cover}
                onChange={patchCover}
              />
            )}
          </div>
        </div>

        <div className="hidden min-h-0 lg:block">
          <PdfPreview
            pdfUrl={currentPdf}
            jobTitle={initialDraft.job.title}
            isRefreshing={isRefreshing}
            lastRefreshedAt={currentRefreshAt}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-border/70 bg-background/95 px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4 text-brand-emerald-700" />
          <span className="hidden sm:inline">
            Edit AI proposals here, then render the final PDF without leaving Jobs.
          </span>
          <span className="sm:hidden">Edit here, then finalize.</span>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDiscard}
            disabled={isDiscarding}
            className="h-9 rounded-xl border-border bg-background px-3 text-sm font-medium text-foreground/85 shadow-sm hover:bg-muted/50"
          >
            <RotateCcw className="h-4 w-4" />
            {isDiscarding ? "Discarding..." : "Discard"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={canClose ? onClose : undefined}
            disabled={!canClose}
            className="h-9 rounded-xl border-border bg-background px-3 text-sm font-medium text-foreground/85 shadow-sm hover:bg-muted/50"
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleFinalize}
            disabled={isFinalizing}
            className={cn(
              "h-9 rounded-xl border border-brand-emerald-500 bg-brand-emerald-500 px-4 text-sm font-semibold text-white shadow-sm hover:border-brand-emerald-600 hover:bg-brand-emerald-600",
              "disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
            )}
          >
            {isFinalizing ? "Finalizing..." : `Finalize ${targetLabel}`}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showConflictDialog ? (
        <ConflictDialog
          onReload={() => window.location.reload()}
          onOverwrite={() => window.location.reload()}
        />
      ) : null}
    </>
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

function extractMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}
