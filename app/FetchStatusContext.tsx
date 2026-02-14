"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";

export type FetchRunStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";

type FetchRunSnapshot = {
  status: FetchRunStatus;
  importedCount: number;
  error: string | null;
  queryTitle?: string | null;
  queryTerms?: string[];
  smartExpand?: boolean;
  updatedAt?: string | null;
};

type FetchStatusContextValue = {
  runId: string | null;
  status: FetchRunStatus | null;
  importedCount: number;
  error: string | null;
  queryTitle: string | null;
  queryTerms: string[];
  smartExpand: boolean;
  elapsedSeconds: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  startRun: (id: string) => void;
  cancelRun: () => Promise<void>;
};

const FetchStatusContext = createContext<FetchStatusContextValue | null>(null);

const RUN_ID_KEY = "jobflow_fetch_run_id";
const STARTED_AT_KEY = "jobflow_fetch_started_at";
const PANEL_OPEN_KEY = "jobflow_fetch_panel_open";
const ENDED_AT_KEY = "jobflow_fetch_ended_at";

export function FetchStatusProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchRunStatus | null>(null);
  const [importedCount, setImportedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [queryTitle, setQueryTitle] = useState<string | null>(null);
  const [queryTerms, setQueryTerms] = useState<string[]>([]);
  const [smartExpand, setSmartExpand] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [open, setOpenState] = useState(false);
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const storageKeys = useMemo(() => {
    const suffix = userId ?? "anonymous";
    return {
      runId: `${RUN_ID_KEY}:${suffix}`,
      startedAt: `${STARTED_AT_KEY}:${suffix}`,
      panelOpen: `${PANEL_OPEN_KEY}:${suffix}`,
      endedAt: `${ENDED_AT_KEY}:${suffix}`,
    };
  }, [userId]);

  const prevKeysRef = useRef<typeof storageKeys | null>(null);

  const resetState = useCallback(() => {
    setRunId(null);
    setStatus(null);
    setImportedCount(0);
    setError(null);
    setQueryTitle(null);
    setQueryTerms([]);
    setSmartExpand(true);
    setElapsedSeconds(0);
    setOpenState(false);
  }, []);

  const refreshFromStorage = useCallback(() => {
    const id = localStorage.getItem(storageKeys.runId);
    const started = localStorage.getItem(storageKeys.startedAt);
    const ended = localStorage.getItem(storageKeys.endedAt);
    if (id) {
      setRunId(id);
      const storedOpen = localStorage.getItem(storageKeys.panelOpen);
      setOpenState(storedOpen === "0" ? false : true);
    } else {
      setRunId(null);
    }
    if (started) {
      const ms = Number(started);
      if (!Number.isNaN(ms)) {
        const endMs = ended ? Number(ended) : null;
        const effectiveEnd = endMs && !Number.isNaN(endMs) ? endMs : Date.now();
        const secs = Math.max(0, Math.floor((effectiveEnd - ms) / 1000));
        setElapsedSeconds(secs);
      }
    }
  }, [storageKeys.runId, storageKeys.startedAt, storageKeys.panelOpen, storageKeys.endedAt]);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  useEffect(() => {
    const prev = prevKeysRef.current;
    if (prev && prev.runId !== storageKeys.runId) {
      localStorage.removeItem(prev.runId);
      localStorage.removeItem(prev.startedAt);
      localStorage.removeItem(prev.panelOpen);
      localStorage.removeItem(prev.endedAt);
      resetState();
    }
    prevKeysRef.current = storageKeys;
    refreshFromStorage();
  }, [storageKeys, resetState, refreshFromStorage]);

  useEffect(() => {
    function handleStart() {
      refreshFromStorage();
    }

    window.addEventListener("jobflow-fetch-started", handleStart);
    window.addEventListener("storage", handleStart);
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        handleStart();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("jobflow-fetch-started", handleStart);
      window.removeEventListener("storage", handleStart);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshFromStorage]);

  const fetchRun = useCallback(async (id: string): Promise<FetchRunSnapshot> => {
    const res = await fetch(`/api/fetch-runs/${id}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to fetch run");
    return json.run as FetchRunSnapshot;
  }, []);

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next);
    localStorage.setItem(storageKeys.panelOpen, next ? "1" : "0");
  }, [storageKeys.panelOpen]);

  const startRun = useCallback((id: string) => {
    setRunId(id);
    setStatus("QUEUED");
    setImportedCount(0);
    setError(null);
    setQueryTitle(null);
    setQueryTerms([]);
    setSmartExpand(true);
    setElapsedSeconds(0);
    setOpen(true);
    localStorage.setItem(storageKeys.runId, id);
    localStorage.setItem(storageKeys.startedAt, String(Date.now()));
    localStorage.setItem(storageKeys.panelOpen, "1");
    localStorage.removeItem(storageKeys.endedAt);
    window.dispatchEvent(new Event("jobflow-fetch-started"));
  }, [setOpen, storageKeys]);

  const cancelRun = useCallback(async () => {
    if (!runId) return;
    try {
      const res = await fetch(`/api/fetch-runs/${runId}/cancel`, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to cancel run");
      setStatus("FAILED");
      setError("Cancelled by user");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to cancel run");
      }
    }
  }, [runId]);

  useEffect(() => {
    if (!runId) return;
    let alive = true;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleNextPoll = (delayMs = 3000) => {
      if (!alive) return;
      pollTimer = setTimeout(() => {
        void poll();
      }, delayMs);
    };

    const poll = async () => {
      let shouldContinue = true;
      try {
        const r = await fetchRun(runId);
        if (!alive) return;
        setStatus(r.status);
        setImportedCount(r.importedCount ?? 0);
        setError(r.error ?? null);
        setQueryTitle(r.queryTitle ?? null);
        setQueryTerms(Array.isArray(r.queryTerms) ? r.queryTerms : []);
        setSmartExpand(r.smartExpand ?? true);
        if (r.status === "SUCCEEDED" || r.status === "FAILED") {
          const endMs = r.updatedAt ? Date.parse(r.updatedAt) : Date.now();
          localStorage.setItem(storageKeys.endedAt, String(endMs));
          const startedRaw = localStorage.getItem(storageKeys.startedAt);
          const startedMs = startedRaw ? Number(startedRaw) : null;
          if (startedMs && !Number.isNaN(startedMs)) {
            setElapsedSeconds(Math.max(0, Math.floor((endMs - startedMs) / 1000)));
          }
          if (autoCloseTimer.current) {
            clearTimeout(autoCloseTimer.current);
          }
          autoCloseTimer.current = setTimeout(() => {
            setOpen(false);
          }, 3000);
          shouldContinue = false;
        }
      } catch (e: unknown) {
        if (!alive) return;
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Polling failed");
        }
      } finally {
        if (shouldContinue) {
          scheduleNextPoll();
        }
      }
    };

    scheduleNextPoll(0);

    return () => {
      alive = false;
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    };
  }, [fetchRun, runId, setOpen, storageKeys.endedAt, storageKeys.startedAt]);

  useEffect(() => {
    if (!open) return;
    if (status !== "RUNNING" && status !== "QUEUED") return;

    // Count time from the moment the user clicked "fetch", including queue time.
    // Compute from timestamps (instead of incrementing) so it stays accurate when the tab sleeps.
    const tick = () => {
      const startedRaw = localStorage.getItem(storageKeys.startedAt);
      const endedRaw = localStorage.getItem(storageKeys.endedAt);
      const startedMs = startedRaw ? Number(startedRaw) : null;
      if (!startedMs || Number.isNaN(startedMs)) return;
      const endedMs = endedRaw ? Number(endedRaw) : null;
      const effectiveEnd = endedMs && !Number.isNaN(endedMs) ? endedMs : Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((effectiveEnd - startedMs) / 1000)));
    };

    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [status, open, storageKeys.endedAt, storageKeys.startedAt]);

  const value = useMemo(
    () => ({
      runId,
      status,
      importedCount,
      error,
      queryTitle,
      queryTerms,
      smartExpand,
      elapsedSeconds,
      open,
      setOpen,
      startRun,
      cancelRun,
    }),
    [
      runId,
      status,
      importedCount,
      error,
      queryTitle,
      queryTerms,
      smartExpand,
      elapsedSeconds,
      open,
      setOpen,
      startRun,
      cancelRun,
    ],
  );

  return <FetchStatusContext.Provider value={value}>{children}</FetchStatusContext.Provider>;
}

export function useFetchStatus() {
  const ctx = useContext(FetchStatusContext);
  if (!ctx) {
    throw new Error("useFetchStatus must be used within FetchStatusProvider");
  }
  return ctx;
}
