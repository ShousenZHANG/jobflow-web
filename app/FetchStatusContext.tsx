"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type FetchRunStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";

type FetchRunSnapshot = {
  status: FetchRunStatus;
  importedCount: number;
  error: string | null;
};

type FetchStatusContextValue = {
  runId: string | null;
  status: FetchRunStatus | null;
  importedCount: number;
  error: string | null;
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

export function FetchStatusProvider({ children }: { children: React.ReactNode }) {
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchRunStatus | null>(null);
  const [importedCount, setImportedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [open, setOpenState] = useState(false);

  const refreshFromStorage = useCallback(() => {
    const id = localStorage.getItem(RUN_ID_KEY);
    const started = localStorage.getItem(STARTED_AT_KEY);
    if (id) {
      setRunId(id);
      const storedOpen = localStorage.getItem(PANEL_OPEN_KEY);
      setOpenState(storedOpen === "0" ? false : true);
    }
    if (started) {
      const ms = Number(started);
      if (!Number.isNaN(ms)) {
        const secs = Math.max(0, Math.floor((Date.now() - ms) / 1000));
        setElapsedSeconds(secs);
      }
    }
  }, []);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

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
    localStorage.setItem(PANEL_OPEN_KEY, next ? "1" : "0");
  }, []);

  const startRun = useCallback((id: string) => {
    setRunId(id);
    setStatus("QUEUED");
    setImportedCount(0);
    setError(null);
    setElapsedSeconds(0);
    setOpen(true);
    localStorage.setItem(RUN_ID_KEY, id);
    localStorage.setItem(STARTED_AT_KEY, String(Date.now()));
    localStorage.setItem(PANEL_OPEN_KEY, "1");
    window.dispatchEvent(new Event("jobflow-fetch-started"));
  }, [setOpen]);

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
    const t = setInterval(async () => {
      try {
        const r = await fetchRun(runId);
        if (!alive) return;
        setStatus(r.status);
        setImportedCount(r.importedCount ?? 0);
        setError(r.error ?? null);
        if (r.status === "SUCCEEDED" || r.status === "FAILED") {
          clearInterval(t);
        }
      } catch (e: unknown) {
        if (!alive) return;
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Polling failed");
        }
      }
    }, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [fetchRun, runId]);

  useEffect(() => {
    if (!open) return;
    if (status !== "RUNNING") return;
    const t = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status, open]);

  const value = useMemo(
    () => ({
      runId,
      status,
      importedCount,
      error,
      elapsedSeconds,
      open,
      setOpen,
      startRun,
      cancelRun,
    }),
    [runId, status, importedCount, error, elapsedSeconds, open, setOpen, startRun, cancelRun],
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
