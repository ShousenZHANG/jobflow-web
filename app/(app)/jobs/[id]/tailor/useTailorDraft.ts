"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchJson, ApiError } from "@/lib/api/fetchJson";
import {
  hashAiContent,
  type AiContent,
} from "@/lib/shared/schemas/aiContent";

export type SaveStatus =
  | { kind: "saved"; at: number }
  | { kind: "dirty" }
  | { kind: "saving" }
  | { kind: "error"; message: string };

export interface UseTailorDraftOptions {
  applicationId: string;
  initialAiContent: AiContent;
  initialAiContentHash: string | null;
  /** Debounce window for autosave, ms. */
  debounceMs?: number;
}

export interface UseTailorDraftReturn {
  aiContent: AiContent;
  setAiContent: (next: AiContent) => void;
  saveStatus: SaveStatus;
  /** Trigger an immediate flush of pending changes (e.g. before Finalize). */
  flushNow: () => Promise<string | null>;
  /** Replace state from server (e.g. after Discard). */
  replaceFromServer: (next: AiContent, hash: string | null) => void;
  currentHash: string | null;
}

export function useTailorDraft({
  applicationId,
  initialAiContent,
  initialAiContentHash,
  debounceMs = 2000,
}: UseTailorDraftOptions): UseTailorDraftReturn {
  const [aiContent, setAiContentState] = useState<AiContent>(initialAiContent);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(() => ({
    kind: "saved" as const,
    at: Date.now(),
  }));
  const [currentHash, setCurrentHash] = useState<string | null>(initialAiContentHash);
  const lastSavedHashRef = useRef<string | null>(initialAiContentHash);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef<Promise<string | null> | null>(null);

  const persist = useCallback(
    async (snapshot: AiContent): Promise<string | null> => {
      const expectedHash = lastSavedHashRef.current;
      setSaveStatus({ kind: "saving" });
      try {
        const res = await fetchJson<undefined>(
          `/api/applications/${applicationId}/draft`,
          {
            method: "PATCH",
            body: JSON.stringify({
              aiContent: snapshot,
              expectedHash,
            }),
          },
        );
        const json = res as { aiContentHash: string };
        lastSavedHashRef.current = json.aiContentHash;
        setCurrentHash(json.aiContentHash);
        setSaveStatus({ kind: "saved", at: Date.now() });
        return json.aiContentHash;
      } catch (err: unknown) {
        if (err instanceof ApiError && err.status === 409) {
          setSaveStatus({
            kind: "error",
            message: "Another tab updated this draft. Reload to continue.",
          });
          return lastSavedHashRef.current;
        }
        const message =
          err instanceof Error ? err.message : "Save failed — retry";
        setSaveStatus({ kind: "error", message });
        return lastSavedHashRef.current;
      }
    },
    [applicationId],
  );

  const setAiContent = useCallback(
    (next: AiContent) => {
      setAiContentState(next);
      setSaveStatus({ kind: "dirty" });
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const localSnapshot = next;
        inFlightRef.current = persist(localSnapshot);
      }, debounceMs);
    },
    [debounceMs, persist],
  );

  const flushNow = useCallback(async () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (saveStatus.kind === "saved") return lastSavedHashRef.current;
    return persist(aiContent);
  }, [aiContent, persist, saveStatus.kind]);

  const replaceFromServer = useCallback(
    (next: AiContent, hash: string | null) => {
      const resolvedHash = hash ?? hashAiContent(next);
      setAiContentState(next);
      lastSavedHashRef.current = resolvedHash;
      setCurrentHash(resolvedHash);
      setSaveStatus({ kind: "saved", at: Date.now() });
    },
    [],
  );

  // Cleanup pending timer on unmount.
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  return {
    aiContent,
    setAiContent,
    saveStatus,
    flushNow,
    replaceFromServer,
    currentHash,
  };
}
