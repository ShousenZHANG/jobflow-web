"use client";

import { ChevronDown, Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { JobItem, ResumeImportOutput, CoverImportOutput } from "../types";
import type { DialogPhase } from "./StepIndicator";
import { StepIndicator } from "./StepIndicator";
import { StepImport } from "./StepImport";
import { JsonInputPanel } from "./JsonInputPanel";
import { GenerateProgress } from "./GenerateProgress";
import { GenerateSuccess } from "./GenerateSuccess";

const externalBtnPrimary =
  "h-10 rounded-xl border border-emerald-500 bg-emerald-500 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-600 hover:border-emerald-600 active:translate-y-[1px] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none";

interface ExternalGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogPhase: DialogPhase;
  setDialogPhase: (phase: DialogPhase) => void;
  externalTarget: "resume" | "cover";
  externalStep: 1 | 2 | 3;
  setExternalStep: (step: 1 | 2 | 3) => void;
  externalSkillPackFresh: boolean;
  setExternalSkillPackFresh: (fresh: boolean) => void;
  externalSkillPackLoading: boolean;
  externalPromptLoading: boolean;
  externalPromptMeta: unknown;
  externalPromptText: string;
  externalShortPromptText: string;
  promptCopied: boolean;
  externalModelOutput: string;
  setExternalModelOutput: (value: string) => void;
  externalGenerating: boolean;
  generateComplete: boolean;
  successPdf: { url: string; filename: string } | null;
  successTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  parsedExternalOutput: ResumeImportOutput | CoverImportOutput | null;
  selectedJob: JobItem | null;
  onCopySmartPrompt: () => void;
  onDownloadSkillPack: () => void;
  onGenerate: (job: JobItem, target: "resume" | "cover", modelOutput: string) => void;
  onGenerateOther: () => void;
}

export function ExternalGenerateDialog({
  open,
  onOpenChange,
  dialogPhase,
  setDialogPhase,
  externalTarget,
  externalStep,
  setExternalStep,
  externalSkillPackFresh,
  setExternalSkillPackFresh,
  externalSkillPackLoading,
  externalPromptLoading,
  externalPromptMeta,
  externalPromptText,
  externalShortPromptText,
  promptCopied,
  externalModelOutput,
  setExternalModelOutput,
  externalGenerating,
  generateComplete,
  successPdf,
  successTimerRef,
  parsedExternalOutput,
  selectedJob,
  onCopySmartPrompt,
  onDownloadSkillPack,
  onGenerate,
  onGenerateOther,
}: ExternalGenerateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && dialogPhase === "generating") return;
      if (!isOpen) {
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        if (successPdf?.url) URL.revokeObjectURL(successPdf.url);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="flex h-[min(90vh,720px)] w-[min(96vw,880px)] max-w-[880px] flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-5 py-4">
          <DialogTitle className="text-base">
            {dialogPhase === "success"
              ? (externalTarget === "resume" ? "Resume PDF Ready" : "Cover Letter Ready")
              : externalTarget === "resume"
                ? "Generate CV with AI"
                : "Generate Cover Letter with AI"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {dialogPhase === "success"
              ? "Your PDF has been generated successfully."
              : dialogPhase === "generating"
                ? "Please wait while we generate your PDF..."
                : "Three steps: import skill pack, copy prompt, paste AI output."}
          </DialogDescription>
        </DialogHeader>

        {dialogPhase !== "generating" && dialogPhase !== "success" && (
          <div className="shrink-0 border-b border-slate-100 px-5 py-3">
            <StepIndicator
              currentStep={dialogPhase}
              onStepClick={(s) => { setExternalStep(s); setDialogPhase(s); }}
              canGoToStep2={externalSkillPackFresh}
              canGoToStep3={externalPromptText.trim().length > 0}
            />
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">
          {dialogPhase === 1 && (
            <StepImport
              isFresh={externalSkillPackFresh}
              isLoading={externalSkillPackLoading}
              isPromptLoading={externalPromptLoading}
              hasPromptMeta={!!externalPromptMeta}
              onDownload={onDownloadSkillPack}
              onSkip={() => { setExternalSkillPackFresh(true); setExternalStep(2); setDialogPhase(2); }}
              onContinue={() => { setExternalStep(2); setDialogPhase(2); }}
            />
          )}

          {dialogPhase === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-slate-700">
                    {externalTarget === "resume" ? "Resume" : "Cover Letter"}
                  </span>
                  <span className="text-slate-400">for</span>
                  <span className="font-medium text-slate-900 truncate">
                    {selectedJob?.title ?? "..."} at {selectedJob?.company ?? "..."}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                disabled={externalPromptLoading || !externalPromptText.trim()}
                onClick={onCopySmartPrompt}
                className={cn(
                  "h-12 w-full rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 active:translate-y-[1px]",
                  promptCopied
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600"
                )}
              >
                {externalPromptLoading ? (
                  "Building prompt..."
                ) : promptCopied ? (
                  <><Copy className="mr-2 h-4 w-4" /> Copied!</>
                ) : (
                  <><Copy className="mr-2 h-4 w-4" /> Copy Prompt to Clipboard</>
                )}
              </Button>

              {promptCopied && (
                <p className="text-center text-sm text-emerald-700">
                  Now paste into Claude / ChatGPT / Gemini and copy the JSON result.
                </p>
              )}

              <details className="group">
                <summary className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700">
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                  Preview prompt ({(externalSkillPackFresh ? externalShortPromptText : externalPromptText).length} chars)
                </summary>
                <pre className="mt-2 max-h-[200px] overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-600">
                  {externalSkillPackFresh ? externalShortPromptText : externalPromptText}
                </pre>
              </details>
            </div>
          )}

          {dialogPhase === 3 && (
            <JsonInputPanel
              value={externalModelOutput}
              onChange={setExternalModelOutput}
              target={externalTarget}
              parsedOutput={parsedExternalOutput}
            />
          )}

          {dialogPhase === "generating" && (
            <GenerateProgress
              target={externalTarget}
              isComplete={generateComplete}
            />
          )}

          {dialogPhase === "success" && successPdf && (
            <GenerateSuccess
              target={externalTarget}
              pdfUrl={successPdf.url}
              pdfFilename={successPdf.filename}
              onGenerateOther={onGenerateOther}
              onClose={() => onOpenChange(false)}
            />
          )}
        </div>

        {typeof dialogPhase === "number" && (
          <div className="flex shrink-0 items-center justify-between border-t border-slate-100 px-5 py-3">
            <div>
              {dialogPhase > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const prev = (dialogPhase === 3 ? 2 : 1) as 1 | 2 | 3;
                    setExternalStep(prev);
                    setDialogPhase(prev);
                  }}
                  className="h-9 rounded-xl px-3 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 rounded-xl px-3 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                Cancel
              </Button>
              {dialogPhase === 2 && (
                <Button
                  size="sm"
                  onClick={() => { setExternalStep(3); setDialogPhase(3); }}
                  className={externalBtnPrimary}
                >
                  Continue
                </Button>
              )}
              {dialogPhase === 3 && (
                <Button
                  size="sm"
                  className={externalBtnPrimary}
                  disabled={
                    !selectedJob ||
                    externalGenerating ||
                    !parsedExternalOutput ||
                    externalModelOutput.trim().length < 20
                  }
                  data-guide-anchor={externalTarget === "resume" ? "generate_first_pdf" : undefined}
                  onClick={() =>
                    selectedJob &&
                    onGenerate(selectedJob, externalTarget, externalModelOutput)
                  }
                >
                  {externalTarget === "resume" ? "Generate CV PDF" : "Generate Cover PDF"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
