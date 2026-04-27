"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PreviewStatus, ResumeProfilePayload } from "./types";

interface UseResumePreviewParams {
  buildPayload: (mode: "preview" | "save") => ResumeProfilePayload;
  hasAnyContent: boolean;
  t: (key: string) => string;
  toast: (opts: { title: string; description?: string; variant?: "default" | "destructive" }) => void;
}

export function useResumePreview({
  buildPayload,
  hasAnyContent,
  t,
  toast,
}: UseResumePreviewParams) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>("idle");
  const [previewError, setPreviewError] = useState<string | null>(null);

  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewAbortRef = useRef<AbortController | null>(null);
  const previewScheduledKeyRef = useRef<string | null>(null);
  const previewInFlightKeyRef = useRef<string | null>(null);
  const previewLatestKeyRef = useRef<string | null>(null);

  // cleanup timer and abort on unmount
  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
      previewAbortRef.current?.abort();
    };
  }, []);

  // revoke object URL on change
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const schedulePreview = useCallback(
    (
      delayMs = 800,
      showEmptyToast = false,
      options?: { payload?: ResumeProfilePayload; payloadKey?: string; force?: boolean },
    ) => {
      if (!hasAnyContent) {
        if (showEmptyToast) {
          toast({
            title: t("toastAddDetailsFirst"),
            description: t("toastAddDetailsFirstDesc"),
            variant: "destructive",
          });
        }
        return;
      }

      const payload = options?.payload ?? buildPayload("preview");
      const payloadKey = options?.payloadKey ?? JSON.stringify(payload);
      const shouldSkip =
        !options?.force &&
        (payloadKey === previewScheduledKeyRef.current ||
          payloadKey === previewInFlightKeyRef.current ||
          payloadKey === previewLatestKeyRef.current);
      if (shouldSkip) return;

      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
      previewAbortRef.current?.abort();

      const hasExistingPreview = Boolean(pdfUrl);
      // Manual force refresh: always show "loading" so the spinner gives
      // immediate feedback even when a stale preview is on screen.
      // Background autosave refresh (force === undefined): keep showing the
      // existing preview as "ready" to avoid flicker on every keystroke.
      if (!hasExistingPreview || options?.force) {
        setPreviewStatus("loading");
      } else {
        setPreviewStatus("ready");
      }
      setPreviewError(null);
      previewScheduledKeyRef.current = payloadKey;

      const runPreview = async (attempt: number) => {
        previewScheduledKeyRef.current = null;
        previewInFlightKeyRef.current = payloadKey;
        const controller = new AbortController();
        previewAbortRef.current = controller;
        try {
          const res = await fetch("/api/resume-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });

          if (!res.ok) {
            let message = t("previewFailed");
            let code: string | undefined;
            if (res.headers.get("content-type")?.includes("application/json")) {
              const json = await res.json().catch(() => null);
              code = json?.error?.code;
              if (code === "LATEX_RENDER_CONFIG_MISSING") {
                message = t("previewNotConfigured");
              } else if (code === "LATEX_RENDER_TIMEOUT") {
                message = t("previewTimeout");
              } else if (code === "LATEX_RENDER_UNREACHABLE") {
                message = t("previewUnavailable");
              } else if (code === "LATEX_RENDER_FAILED") {
                message = t("previewCompileFailed");
              } else if (code === "NO_PROFILE") {
                message = t("previewSaveFirst");
              }
            }

            if (attempt === 0 && [502, 503, 504].includes(res.status)) {
              await new Promise((resolve) => setTimeout(resolve, 1200));
              return runPreview(1);
            }

            if (!hasExistingPreview) {
              setPreviewError(message);
              setPreviewStatus("error");
            }
            return;
          }

          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setPdfUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
          setPreviewStatus("ready");
          previewLatestKeyRef.current = payloadKey;
        } catch (err) {
          if ((err as Error).name === "AbortError") return;
          if (!hasExistingPreview) {
            setPreviewError(t("previewFailed"));
            setPreviewStatus("error");
          }
        } finally {
          if (previewInFlightKeyRef.current === payloadKey) {
            previewInFlightKeyRef.current = null;
          }
          previewAbortRef.current = null;
        }
      };

      previewTimerRef.current = setTimeout(() => {
        runPreview(0);
      }, delayMs);
    },
    [buildPayload, hasAnyContent, pdfUrl, toast, t],
  );

  const resetPreview = useCallback(() => {
    setPdfUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setPreviewStatus("idle");
    setPreviewError(null);
  }, []);

  return {
    pdfUrl,
    setPdfUrl,
    previewStatus,
    setPreviewStatus,
    previewError,
    setPreviewError,
    schedulePreview,
    resetPreview,
  };
}

export type UseResumePreviewReturn = ReturnType<typeof useResumePreview>;
