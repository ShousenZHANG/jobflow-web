"use client";

import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useResumeContext } from "./ResumeContext";

interface PreviewPanelProps {
  className?: string;
}

export function PreviewPanel({ className }: PreviewPanelProps) {
  const { pdfUrl, previewStatus, previewError, schedulePreview, basics, locale, t } =
    useResumeContext();

  const downloadFilename = (() => {
    const fallback = locale === "zh-CN" ? "未命名简历" : "Unnamed_Resume";
    if (!basics.fullName && !basics.title) return `${fallback}.pdf`;
    const safeName = (basics.fullName || "").replace(/\s+/g, "_");
    const safeTitle = (basics.title || "").replace(/\s+/g, "_");
    const connector = safeName && safeTitle ? "_" : "";
    return `${safeName}${connector}${safeTitle}.pdf`;
  })();

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-900/10 bg-white/90 px-3">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {t("pdfPreview")}
        </span>
        <div className="flex items-center gap-1">
          {pdfUrl && previewStatus === "ready" && (
            <a
              href={pdfUrl}
              download={downloadFilename}
              className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <Download className="h-3.5 w-3.5" />
              {t("download")}
            </a>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="Refresh preview"
            onClick={() => schedulePreview(0, false, { force: true })}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", previewStatus === "loading" && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Preview area */}
      <div className="relative flex-1 overflow-hidden bg-slate-50">
        {/* A4 skeleton loading state */}
        {previewStatus === "idle" && !pdfUrl && (
          <div className="flex h-full items-center justify-center p-4">
            <div className="w-full max-w-[280px]">
              {/* A4 proportioned rectangle (1:1.414) */}
              <div className="aspect-[1/1.414] w-full rounded-sm bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                <p className="text-xs text-muted-foreground px-4 text-center">
                  {t("preview")}
                </p>
              </div>
            </div>
          </div>
        )}

        {previewStatus === "loading" && !pdfUrl && (
          <div className="flex h-full items-center justify-center p-4">
            <div className="w-full max-w-[280px]">
              <div className="aspect-[1/1.414] w-full animate-pulse rounded-sm bg-slate-200" />
            </div>
          </div>
        )}

        {pdfUrl && (
          <iframe
            title="Resume preview"
            src={pdfUrl}
            className="h-full w-full"
          />
        )}

        {previewStatus === "loading" && pdfUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-xs text-slate-500">
            {t("previewGenerating") ?? "Generating preview…"}
          </div>
        )}

        {previewStatus === "error" && (
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <span>{previewError ?? t("previewFailed")}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => schedulePreview(0, false, { force: true })}
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
