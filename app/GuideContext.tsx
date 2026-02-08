"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { CircleHelp, Circle, CircleCheckBig, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ONBOARDING_TASKS, type OnboardingChecklist, type OnboardingTaskId } from "@/lib/onboarding";

type GuideState = {
  stage: "NEW_USER" | "ACTIVATED_USER" | "RETURNING_USER";
  checklist: OnboardingChecklist;
  completedCount: number;
  totalCount: number;
  isComplete: boolean;
  dismissed: boolean;
  dismissedAt: string | null;
  completedAt: string | null;
  persisted: boolean;
};

type GuideContextValue = {
  loading: boolean;
  open: boolean;
  state: GuideState | null;
  activeTaskId: OnboardingTaskId | null;
  openGuide: () => void;
  closeGuide: () => void;
  skipGuide: () => void;
  resetGuide: () => void;
  markTaskComplete: (taskId: OnboardingTaskId) => void;
  isTaskHighlighted: (taskId: OnboardingTaskId) => boolean;
};

const GuideContext = createContext<GuideContextValue | null>(null);

function currentPageTips(pathname: string) {
  if (pathname.startsWith("/resume/rules")) {
    return {
      title: "Prompt rules page",
      points: [
        "Review active template before changing prompts.",
        "Create a new version instead of editing history in place.",
      ],
    };
  }
  if (pathname.startsWith("/resume")) {
    return {
      title: "Resume page",
      points: [
        "Complete all steps, then click Save master resume.",
        "Use Preview to verify bullets and formatting before tailoring.",
      ],
    };
  }
  if (pathname.startsWith("/fetch")) {
    return {
      title: "Fetch page",
      points: [
        "Start with one role title and clear filters.",
        "Run fetch once, then move to Jobs and triage quickly.",
      ],
    };
  }
  if (pathname.startsWith("/jobs")) {
    return {
      title: "Jobs page",
      points: [
        "Open JD details and update status for your first role.",
        "Generate CV/CL after your master resume is saved, then download one PDF.",
      ],
    };
  }
  return {
    title: "Guide",
    points: ["Open the checklist and continue from your next recommended step."],
  };
}

export function GuideProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userId = session?.user?.id ?? null;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<GuideState | null>(null);

  const fetchState = useCallback(async () => {
    if (!userId) {
      setState(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/state", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load onboarding state");
      setState(json.state as GuideState);
    } catch {
      setState(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchState();
  }, [fetchState]);

  useEffect(() => {
    if (!userId || !state) return;
    if (state.isComplete || state.dismissed) return;
    const key = `jobflow.guide.autoshown.${userId}`;
    if (window.sessionStorage.getItem(key) === "1") return;
    setOpen(true);
    window.sessionStorage.setItem(key, "1");
  }, [state, userId]);

  const patchState = useCallback(
    async (payload: { type: "complete_task"; taskId: OnboardingTaskId } | { type: "reopen" } | { type: "skip" } | { type: "reset" }) => {
      if (!userId) return;
      try {
        const res = await fetch("/api/onboarding/state", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "Failed to update onboarding state");
        setState(json.state as GuideState);
      } catch {
        // Keep UI resilient even if persistence is temporarily unavailable.
      }
    },
    [userId],
  );

  const activeTaskId = useMemo<OnboardingTaskId | null>(() => {
    if (!state || state.isComplete || state.dismissed) return null;
    const nextTask = ONBOARDING_TASKS.find((task) => !state.checklist[task.id]);
    return nextTask?.id ?? null;
  }, [state]);

  const isTaskHighlighted = useCallback(
    (taskId: OnboardingTaskId) => {
      if (!open || !activeTaskId || activeTaskId !== taskId) return false;
      const task = ONBOARDING_TASKS.find((item) => item.id === taskId);
      if (!task) return false;
      return pathname === task.href || pathname.startsWith(`${task.href}/`);
    },
    [activeTaskId, open, pathname],
  );

  const markTaskComplete = useCallback(
    (taskId: OnboardingTaskId) => {
      setState((prev) => {
        if (!prev || prev.checklist[taskId]) return prev;
        const checklist = { ...prev.checklist, [taskId]: true };
        const completedCount = ONBOARDING_TASKS.reduce(
          (count, task) => (checklist[task.id] ? count + 1 : count),
          0,
        );
        return {
          ...prev,
          checklist,
          completedCount,
          isComplete: completedCount >= prev.totalCount,
        };
      });
      void patchState({ type: "complete_task", taskId });
    },
    [patchState],
  );

  const openGuide = useCallback(() => {
    setOpen(true);
    void patchState({ type: "reopen" });
  }, [patchState]);

  const closeGuide = useCallback(() => {
    setOpen(false);
  }, []);

  const skipGuide = useCallback(() => {
    setOpen(false);
    void patchState({ type: "skip" });
  }, [patchState]);

  const resetGuide = useCallback(() => {
    void patchState({ type: "reset" });
  }, [patchState]);

  const tips = useMemo(() => currentPageTips(pathname), [pathname]);

  const value = useMemo<GuideContextValue>(
    () => ({
      loading,
      open,
      state,
      activeTaskId,
      openGuide,
      closeGuide,
      skipGuide,
      resetGuide,
      markTaskComplete,
      isTaskHighlighted,
    }),
    [
      loading,
      open,
      state,
      activeTaskId,
      openGuide,
      closeGuide,
      skipGuide,
      resetGuide,
      markTaskComplete,
      isTaskHighlighted,
    ],
  );

  return (
    <GuideContext.Provider value={value}>
      {children}
      {userId ? (
        <>
          {open ? (
            <section className="fixed bottom-24 left-6 z-50 w-[360px] rounded-3xl border-2 border-slate-900/10 bg-white/95 p-4 shadow-[0_24px_50px_-32px_rgba(15,23,42,0.36)] backdrop-blur">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                    <Sparkles className="h-3 w-3" />
                    Getting started
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-slate-900">
                    Guide checklist ({state?.completedCount ?? 0}/{state?.totalCount ?? ONBOARDING_TASKS.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Complete these steps once, then use Guide anytime from the top bar.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeGuide}
                  className="h-7 px-2 text-xs"
                >
                  Close
                </Button>
              </div>

              <div className="space-y-2">
                {ONBOARDING_TASKS.map((task) => {
                  const done = Boolean(state?.checklist?.[task.id]);
                  const active = activeTaskId === task.id;
                  return (
                    <Link
                      key={task.id}
                      href={task.href}
                      className={[
                        "block rounded-xl border bg-slate-50/70 p-2 transition hover:bg-slate-50",
                        active
                          ? "border-emerald-300 ring-2 ring-emerald-200"
                          : "border-slate-900/10 hover:border-slate-300",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-2">
                        {done ? (
                          <CircleCheckBig className="mt-0.5 h-4 w-4 text-emerald-600" />
                        ) : (
                          <Circle className="mt-0.5 h-4 w-4 text-slate-400" />
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900">{task.title}</div>
                          <div className="line-clamp-2 text-[11px] text-muted-foreground">{task.description}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 rounded-xl border border-slate-900/10 bg-white p-2">
                <div className="mb-1 text-xs font-semibold text-slate-900">{tips.title}</div>
                <ul className="space-y-1 text-[11px] text-muted-foreground">
                  {tips.points.map((point) => (
                    <li key={point} className="leading-5">
                      - {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={skipGuide}
                  className="h-8 rounded-xl text-xs"
                >
                  Skip for now
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetGuide}
                  className="h-8 rounded-xl text-xs text-muted-foreground"
                >
                  Reset checklist
                </Button>
              </div>
            </section>
          ) : null}

          <button
            type="button"
            aria-label="Open guide"
            onClick={openGuide}
            className="edu-outline edu-cta--press edu-outline--compact fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium"
          >
            <CircleHelp className="h-4 w-4" />
            Guide
            {loading ? null : (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                {state?.completedCount ?? 0}/{state?.totalCount ?? ONBOARDING_TASKS.length}
              </span>
            )}
          </button>
        </>
      ) : null}
    </GuideContext.Provider>
  );
}

export function useGuide() {
  const context = useContext(GuideContext);
  if (context) return context;
  return {
    loading: false,
    open: false,
    state: null,
    activeTaskId: null,
    openGuide: () => {},
    closeGuide: () => {},
    skipGuide: () => {},
    resetGuide: () => {},
    markTaskComplete: () => {},
    isTaskHighlighted: () => false,
  };
}
