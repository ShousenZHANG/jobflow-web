"use client";

import { useEffect, useRef } from "react";
import { User, FileText, Briefcase, FolderKanban, GraduationCap, Wrench } from "lucide-react";
import { useResumeContext } from "./ResumeContext";
import type { SectionId } from "./constants";
import { getSectionIds } from "./constants";
import { cn } from "@/lib/utils";

type SectionTranslationKey = "personalInfo" | "summary" | "experience" | "projects" | "education" | "skills";

const SECTION_CONFIG: Array<{ id: SectionId; tKey: SectionTranslationKey; icon: React.ElementType }> = [
  { id: "personal", tKey: "personalInfo", icon: User },
  { id: "summary", tKey: "summary", icon: FileText },
  { id: "experience", tKey: "experience", icon: Briefcase },
  { id: "projects", tKey: "projects", icon: FolderKanban },
  { id: "education", tKey: "education", icon: GraduationCap },
  { id: "skills", tKey: "skills", icon: Wrench },
];

interface SectionNavProps {
  className?: string;
}

/**
 * SectionNav — primary section rail.
 *
 * Desktop: a fixed 56px-wide icon rail per the Joblit design system. Each
 * item is a 40×40 button with a hover tooltip; the active item gets an
 * emerald accent bar and tinted background.
 *
 * Mobile: a horizontal scrolling pill row with smooth scroll-into-view of
 * the active tab.
 */
export function SectionNav({ className }: SectionNavProps) {
  const { activeSection, setActiveSection, locale, t } = useResumeContext();
  const visibleSectionIds = getSectionIds(locale);
  const visibleSections = SECTION_CONFIG.filter((s) => visibleSectionIds.includes(s.id));

  // Keep the active mobile pill centered.
  const mobileTabRefs = useRef<Map<SectionId, HTMLButtonElement | null>>(new Map());
  useEffect(() => {
    const node = mobileTabRefs.current.get(activeSection);
    if (!node) return;
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeSection]);

  return (
    <nav
      className={cn("flex [contain:layout_style]", className)}
      aria-label="Resume sections"
    >
      {/* Desktop: 56px icon-only rail */}
      <div className="hidden lg:flex lg:w-full lg:flex-col lg:items-center lg:gap-1 lg:py-2.5">
        {visibleSections.map(({ id, tKey, icon: Icon }) => {
          const isActive = activeSection === id;
          const label = t(tKey);
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              title={label}
              className={cn(
                "group relative grid h-10 w-10 place-items-center rounded-[9px]",
                "transition-colors duration-150 ease-out motion-reduce:transition-none",
                "active:scale-[0.97] motion-reduce:active:scale-100",
                isActive
                  ? "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute -left-2 top-2 bottom-2 w-[3px] rounded-r-[3px] bg-emerald-600 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Mobile: horizontal scrollable tabs */}
      <div
        className="scrollbar-hide flex w-full gap-2 overflow-x-auto scroll-smooth px-4 py-2 lg:hidden"
        role="tablist"
      >
        {visibleSections.map(({ id, tKey, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              ref={(node) => {
                mobileTabRefs.current.set(id, node);
              }}
              type="button"
              onClick={() => setActiveSection(id)}
              aria-current={isActive ? "page" : undefined}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm",
                "transition-colors duration-150 ease-out active:scale-[0.97] motion-reduce:active:scale-100 motion-reduce:transition-none",
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "border-border bg-card text-muted-foreground hover:border-emerald-300",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{t(tKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
