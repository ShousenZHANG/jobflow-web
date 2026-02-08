export type OnboardingTaskId = "resume_setup" | "first_fetch" | "triage_first_job";

export type OnboardingTask = {
  id: OnboardingTaskId;
  title: string;
  description: string;
  href: "/resume" | "/fetch" | "/jobs";
};

export const ONBOARDING_TASKS: OnboardingTask[] = [
  {
    id: "resume_setup",
    title: "Set up master resume",
    description: "Save your base resume profile before tailoring any role.",
    href: "/resume",
  },
  {
    id: "first_fetch",
    title: "Run first fetch",
    description: "Start one fetch run to import fresh jobs into your workspace.",
    href: "/fetch",
  },
  {
    id: "triage_first_job",
    title: "Triage first job",
    description: "Update one job status to begin your tracking workflow.",
    href: "/jobs",
  },
];

export type OnboardingChecklist = Record<OnboardingTaskId, boolean>;

export function defaultOnboardingChecklist(): OnboardingChecklist {
  return {
    resume_setup: false,
    first_fetch: false,
    triage_first_job: false,
  };
}

export function normalizeOnboardingChecklist(value: unknown): OnboardingChecklist {
  const fallback = defaultOnboardingChecklist();
  if (!value || typeof value !== "object") return fallback;

  const record = value as Record<string, unknown>;
  return {
    resume_setup:
      typeof record.resume_setup === "boolean" ? record.resume_setup : fallback.resume_setup,
    first_fetch: typeof record.first_fetch === "boolean" ? record.first_fetch : fallback.first_fetch,
    triage_first_job:
      typeof record.triage_first_job === "boolean"
        ? record.triage_first_job
        : fallback.triage_first_job,
  };
}

export function completedOnboardingTasks(checklist: OnboardingChecklist): number {
  return ONBOARDING_TASKS.reduce(
    (count, task) => (checklist[task.id] ? count + 1 : count),
    0,
  );
}

export function isOnboardingComplete(checklist: OnboardingChecklist): boolean {
  return completedOnboardingTasks(checklist) >= ONBOARDING_TASKS.length;
}
