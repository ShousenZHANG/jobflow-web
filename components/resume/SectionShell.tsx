"use client";

import type { ReactNode } from "react";
import { useResumeContext } from "./ResumeContext";
import { getSectionIds } from "./constants";
import { cn } from "@/lib/utils";

interface SectionShellProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

/**
 * SectionShell — wraps every form section with the Joblit Design System
 * "Section head" pattern: emerald step badge inline with a 24px H2 and
 * a muted description capped at 60ch. Step number derives from the
 * active section's index in the locale-specific section list, so it
 * stays in sync between the EN and 中文 layouts (which differ in
 * length and ordering).
 */
export function SectionShell({ title, description, action, children }: SectionShellProps) {
  const { activeSection, locale } = useResumeContext();
  const sectionIds = getSectionIds(locale);
  const stepIndex = sectionIds.indexOf(activeSection);
  const totalSteps = sectionIds.length;
  const stepNumber = stepIndex >= 0 ? stepIndex + 1 : null;

  return (
    <div className="space-y-6 py-1">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            {stepNumber !== null ? (
              <span
                className={cn(
                  "inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5",
                  "bg-emerald-500/12 text-xs font-bold text-emerald-700",
                  "dark:bg-emerald-500/15 dark:text-emerald-300",
                )}
                aria-label={`Step ${stepNumber} of ${totalSteps}`}
              >
                {stepNumber}
              </span>
            ) : null}
            <h2 className="text-2xl font-bold leading-[1.15] tracking-[-0.018em] text-foreground">
              {title}
            </h2>
          </div>
          {description ? (
            <p className="mt-2 max-w-[60ch] text-sm leading-[1.55] text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </div>
  );
}
