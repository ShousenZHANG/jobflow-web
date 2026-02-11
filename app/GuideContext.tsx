"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CircleHelp, Circle, CircleCheckBig, Navigation, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ONBOARDING_TASKS,
  mergeOnboardingChecklists,
  type OnboardingChecklist,
  type OnboardingTask,
  type OnboardingTaskId,
} from "@/lib/onboarding";

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
  tourRunning: boolean;
  tourTaskId: OnboardingTaskId | null;
  openGuide: () => void;
  closeGuide: () => void;
  skipGuide: () => void;
  resetGuide: () => void;
  startTour: () => void;
  stopTour: () => void;
  markTaskComplete: (taskId: OnboardingTaskId) => void;
  isTaskHighlighted: (taskId: OnboardingTaskId) => boolean;
};

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const GUIDE_CARD_WIDTH = 332;
const GUIDE_CARD_HEIGHT_ESTIMATE = 244;
const GUIDE_EDGE = 12;
const SPOTLIGHT_PADDING = 8;

const GuideContext = createContext<GuideContextValue | null>(null);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function sameRect(a: SpotlightRect | null, b: SpotlightRect | null) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    Math.abs(a.top - b.top) < 1 &&
    Math.abs(a.left - b.left) < 1 &&
    Math.abs(a.width - b.width) < 1 &&
    Math.abs(a.height - b.height) < 1
  );
}

function getTaskById(taskId: OnboardingTaskId | null): OnboardingTask | null {
  if (!taskId) return null;
  return ONBOARDING_TASKS.find((task) => task.id === taskId) ?? null;
}

function pageLabel(href: OnboardingTask["href"]) {
  if (href === "/resume") return "Resume";
  if (href === "/fetch") return "Fetch";
  return "Jobs";
}

function taskCoachTip(taskId: OnboardingTaskId) {
  if (taskId === "resume_setup") {
    return "Complete all resume sections, then save your master resume.";
  }
  if (taskId === "first_fetch") {
    return "Use one clear role title first, then run fetch once.";
  }
  if (taskId === "triage_first_job") {
    return "Update one job status to Applied or Rejected to start tracking.";
  }
  if (taskId === "generate_first_pdf") {
    return "Generate CV or CL from the selected job to create your first tailored document.";
  }
  return "Open the PDF and download once to complete the full loop.";
}

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

function resolveGuideState(
  previousState: GuideState | null,
  nextState: GuideState,
  preserveCompleted: boolean,
): GuideState {
  if (!previousState || !preserveCompleted) {
    return nextState;
  }
  const checklist = mergeOnboardingChecklists(previousState.checklist, nextState.checklist);
  const completedCount = ONBOARDING_TASKS.reduce(
    (count, task) => (checklist[task.id] ? count + 1 : count),
    0,
  );
  return {
    ...nextState,
    checklist,
    completedCount,
    isComplete: completedCount >= nextState.totalCount,
  };
}

export function GuideProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const userId = session?.user?.id ?? null;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<GuideState | null>(null);

  const [tourRunning, setTourRunning] = useState(false);
  const [tourTaskId, setTourTaskId] = useState<OnboardingTaskId | null>(null);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const [targetMissing, setTargetMissing] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const scrolledTargetKeyRef = useRef<string | null>(null);

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
      const nextState = json.state as GuideState;
      setState((prev) => resolveGuideState(prev, nextState, true));
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
    const syncViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!userId || !state) return;
    if (state.isComplete || state.dismissed) return;
    const key = `jobflow.guide.autoshown.${userId}`;
    if (window.sessionStorage.getItem(key) === "1") return;
    setOpen(true);
    window.sessionStorage.setItem(key, "1");
  }, [state, userId]);

  const patchState = useCallback(
    async (
      payload:
        | { type: "complete_task"; taskId: OnboardingTaskId; checklist?: OnboardingChecklist }
        | { type: "reopen" }
        | { type: "skip" }
        | { type: "reset" },
    ) => {
      if (!userId) return;
      try {
        const res = await fetch("/api/onboarding/state", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "Failed to update onboarding state");
        const nextState = json.state as GuideState;
        setState((prev) => resolveGuideState(prev, nextState, payload.type !== "reset"));
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

  const activeTourTask = useMemo(() => getTaskById(tourTaskId), [tourTaskId]);

  const isTourTaskOnCurrentPage = useMemo(() => {
    if (!activeTourTask) return false;
    return pathname === activeTourTask.href || pathname.startsWith(`${activeTourTask.href}/`);
  }, [activeTourTask, pathname]);

  const stopTour = useCallback(() => {
    setTourRunning(false);
    setTourTaskId(null);
    setSpotlightRect(null);
    setTargetMissing(false);
    scrolledTargetKeyRef.current = null;
  }, []);

  const startTour = useCallback(() => {
    const nextTask = activeTaskId ?? ONBOARDING_TASKS[0]?.id ?? null;
    if (!nextTask) {
      setOpen(true);
      return;
    }
    setTourTaskId(nextTask);
    setTourRunning(true);
    setOpen(false);
    void patchState({ type: "reopen" });
  }, [activeTaskId, patchState]);

  useEffect(() => {
    if (!tourRunning) return;
    if (!activeTaskId) {
      stopTour();
      setOpen(true);
      return;
    }
    if (tourTaskId !== activeTaskId) {
      setTourTaskId(activeTaskId);
      scrolledTargetKeyRef.current = null;
    }
  }, [activeTaskId, stopTour, tourRunning, tourTaskId]);

  const locateTourTarget = useCallback(() => {
    if (!tourRunning || !tourTaskId) {
      setSpotlightRect(null);
      setTargetMissing(false);
      return;
    }
    const target = document.querySelector<HTMLElement>(`[data-guide-anchor="${tourTaskId}"]`);
    if (!target) {
      setSpotlightRect(null);
      setTargetMissing(true);
      return;
    }
    const rect = target.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) {
      setSpotlightRect(null);
      setTargetMissing(true);
      return;
    }
    const nextRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
    setSpotlightRect((prev) => (sameRect(prev, nextRect) ? prev : nextRect));
    setTargetMissing(false);
  }, [tourRunning, tourTaskId]);

  useEffect(() => {
    if (!tourRunning || !tourTaskId) return;

    locateTourTarget();
    const interval = window.setInterval(locateTourTarget, 120);
    const handleScroll = () => locateTourTarget();
    window.addEventListener("resize", locateTourTarget);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", locateTourTarget);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [locateTourTarget, tourRunning, tourTaskId]);

  useEffect(() => {
    if (!tourRunning || !tourTaskId || !isTourTaskOnCurrentPage) return;
    const target = document.querySelector<HTMLElement>(`[data-guide-anchor="${tourTaskId}"]`);
    if (!target) return;

    const key = `${tourTaskId}:${pathname}`;
    if (scrolledTargetKeyRef.current === key) return;
    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    scrolledTargetKeyRef.current = key;
  }, [isTourTaskOnCurrentPage, pathname, tourRunning, tourTaskId]);

  const markTaskComplete = useCallback(
    (taskId: OnboardingTaskId) => {
      let checklistForPatch: OnboardingChecklist | null = null;
      setState((prev) => {
        if (!prev || prev.checklist[taskId]) return prev;
        const checklist = { ...prev.checklist, [taskId]: true };
        checklistForPatch = checklist;
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
      void patchState(
        checklistForPatch
          ? { type: "complete_task", taskId, checklist: checklistForPatch }
          : { type: "complete_task", taskId },
      );
    },
    [patchState],
  );

  const openGuide = useCallback(() => {
    stopTour();
    setOpen(true);
    void patchState({ type: "reopen" });
  }, [patchState, stopTour]);

  const closeGuide = useCallback(() => {
    setOpen(false);
  }, []);

  const skipGuide = useCallback(() => {
    stopTour();
    setOpen(false);
    void patchState({ type: "skip" });
  }, [patchState, stopTour]);

  const resetGuide = useCallback(() => {
    stopTour();
    setOpen(true);
    void patchState({ type: "reset" });
  }, [patchState, stopTour]);

  const handleTourPrimaryAction = useCallback(() => {
    if (!activeTourTask || !tourTaskId) return;
    if (!isTourTaskOnCurrentPage) {
      router.push(activeTourTask.href);
      return;
    }
    markTaskComplete(tourTaskId);
  }, [activeTourTask, isTourTaskOnCurrentPage, markTaskComplete, router, tourTaskId]);

  const isTaskHighlighted = useCallback(
    (taskId: OnboardingTaskId) => {
      if (!(open || tourRunning) || !activeTaskId || activeTaskId !== taskId) return false;
      const task = ONBOARDING_TASKS.find((item) => item.id === taskId);
      if (!task) return false;
      return pathname === task.href || pathname.startsWith(`${task.href}/`);
    },
    [activeTaskId, open, pathname, tourRunning],
  );

  const tips = useMemo(() => currentPageTips(pathname), [pathname]);

  const spotlightBox = useMemo(() => {
    if (!spotlightRect || viewport.width <= 0 || viewport.height <= 0) return null;
    const top = clamp(spotlightRect.top - SPOTLIGHT_PADDING, GUIDE_EDGE, viewport.height - GUIDE_EDGE);
    const left = clamp(spotlightRect.left - SPOTLIGHT_PADDING, GUIDE_EDGE, viewport.width - GUIDE_EDGE);
    const width = clamp(
      spotlightRect.width + SPOTLIGHT_PADDING * 2,
      24,
      viewport.width - left - GUIDE_EDGE,
    );
    const height = clamp(
      spotlightRect.height + SPOTLIGHT_PADDING * 2,
      24,
      viewport.height - top - GUIDE_EDGE,
    );
    return { top, left, width, height };
  }, [spotlightRect, viewport.height, viewport.width]);

  const coachLayout = useMemo(() => {
    if (!spotlightBox || viewport.width <= 0 || viewport.height <= 0) return null;
    const cardWidth = Math.min(GUIDE_CARD_WIDTH, viewport.width - GUIDE_EDGE * 2);
    const left = clamp(
      spotlightBox.left + spotlightBox.width / 2 - cardWidth / 2,
      GUIDE_EDGE,
      viewport.width - cardWidth - GUIDE_EDGE,
    );
    const canPlaceBelow =
      spotlightBox.top + spotlightBox.height + GUIDE_CARD_HEIGHT_ESTIMATE + 24 < viewport.height;
    const top = canPlaceBelow
      ? spotlightBox.top + spotlightBox.height + 16
      : clamp(
          spotlightBox.top - GUIDE_CARD_HEIGHT_ESTIMATE - 16,
          GUIDE_EDGE,
          viewport.height - GUIDE_CARD_HEIGHT_ESTIMATE - GUIDE_EDGE,
        );

    const arrowLeft = clamp(
      spotlightBox.left + spotlightBox.width / 2 - left - 8,
      18,
      cardWidth - 24,
    );

    return {
      top,
      left,
      width: cardWidth,
      arrowLeft,
      placement: canPlaceBelow ? "top" : "bottom",
    } as const;
  }, [spotlightBox, viewport.height, viewport.width]);

  const tourPrimaryLabel = useMemo(() => {
    if (!activeTourTask) return "Continue";
    if (!isTourTaskOnCurrentPage) {
      return `Go to ${pageLabel(activeTourTask.href)}`;
    }
    return "I completed this";
  }, [activeTourTask, isTourTaskOnCurrentPage]);

  const value = useMemo<GuideContextValue>(
    () => ({
      loading,
      open,
      state,
      activeTaskId,
      tourRunning,
      tourTaskId,
      openGuide,
      closeGuide,
      skipGuide,
      resetGuide,
      startTour,
      stopTour,
      markTaskComplete,
      isTaskHighlighted,
    }),
    [
      loading,
      open,
      state,
      activeTaskId,
      tourRunning,
      tourTaskId,
      openGuide,
      closeGuide,
      skipGuide,
      resetGuide,
      startTour,
      stopTour,
      markTaskComplete,
      isTaskHighlighted,
    ],
  );

  return (
    <GuideContext.Provider value={value}>
      {children}
      {userId ? (
        <>
          {tourRunning && activeTourTask ? (
            <>
              <div className="pointer-events-none fixed inset-0 z-[60]">
                {spotlightBox ? (
                  <div
                    className="absolute rounded-2xl border-2 border-emerald-400/95 bg-transparent shadow-[0_0_0_9999px_rgba(15,23,42,0.5)] transition-all duration-150 ease-out"
                    style={{
                      top: spotlightBox.top,
                      left: spotlightBox.left,
                      width: spotlightBox.width,
                      height: spotlightBox.height,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-900/50" />
                )}
              </div>

              <section
                className="fixed z-[70] rounded-2xl border border-slate-900/10 bg-white/95 p-4 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.45)] backdrop-blur"
                style={
                  coachLayout
                    ? {
                        top: coachLayout.top,
                        left: coachLayout.left,
                        width: coachLayout.width,
                      }
                    : {
                        right: GUIDE_EDGE,
                        bottom: GUIDE_EDGE,
                        width: Math.min(GUIDE_CARD_WIDTH, viewport.width - GUIDE_EDGE * 2),
                      }
                }
              >
                {coachLayout ? (
                  <div
                    className={[
                      "absolute h-3 w-3 rotate-45 border border-slate-200 bg-white",
                      coachLayout.placement === "top" ? "-top-1.5 border-l border-t border-r-0 border-b-0" : "-bottom-1.5 border-r border-b border-l-0 border-t-0",
                    ].join(" ")}
                    style={{ left: coachLayout.arrowLeft }}
                  />
                ) : null}

                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                    <Sparkles className="h-3 w-3" />
                    Guided tour
                  </div>
                  <button
                    type="button"
                    onClick={stopTour}
                    className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
                  >
                    Exit
                  </button>
                </div>

                <h3 className="text-sm font-semibold text-slate-900">{activeTourTask.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{activeTourTask.description}</p>
                <p className="mt-2 rounded-lg border border-emerald-100 bg-emerald-50/70 px-2 py-1.5 text-xs text-emerald-800">
                  <Navigation className="mr-1 inline h-3.5 w-3.5" />
                  {taskCoachTip(activeTourTask.id)}
                </p>

                {!isTourTaskOnCurrentPage ? (
                  <p className="mt-2 text-[11px] text-slate-500">
                    This step is on <span className="font-semibold text-slate-700">{pageLabel(activeTourTask.href)}</span>.
                  </p>
                ) : targetMissing ? (
                  <p className="mt-2 text-[11px] text-slate-500">
                    Waiting for this action area to appear. If needed, select a job first.
                  </p>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={skipGuide}
                    className="h-8 rounded-xl px-3 text-xs"
                  >
                    Skip tour
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleTourPrimaryAction}
                    className="h-8 rounded-xl px-3 text-xs"
                  >
                    {tourPrimaryLabel}
                  </Button>
                </div>
              </section>
            </>
          ) : null}

          {open ? (
            <>
              <button
                type="button"
                aria-label="Close guide"
                data-testid="guide-backdrop"
                onClick={closeGuide}
                className="fixed inset-0 z-40 bg-transparent"
              />
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

                <Button
                  type="button"
                  onClick={startTour}
                  className="mb-3 h-9 w-full rounded-xl text-xs"
                >
                  Start guided tour
                </Button>

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
            </>
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
    tourRunning: false,
    tourTaskId: null,
    openGuide: () => {},
    closeGuide: () => {},
    skipGuide: () => {},
    resetGuide: () => {},
    startTour: () => {},
    stopTour: () => {},
    markTaskComplete: () => {},
    isTaskHighlighted: () => false,
  };
}
