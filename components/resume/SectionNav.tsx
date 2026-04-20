"use client";

import { User, FileText, Briefcase, FolderKanban, GraduationCap, Wrench, PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SectionNav({ className, collapsed, onToggle }: SectionNavProps) {
  const { activeSection, setActiveSection, locale, t } = useResumeContext();
  const visibleSectionIds = getSectionIds(locale);
  const visibleSections = SECTION_CONFIG.filter((s) => visibleSectionIds.includes(s.id));

  return (
    <nav className={cn("flex", className)} aria-label="Resume sections">
      {/* Desktop: vertical list */}
      <div className="hidden lg:flex lg:w-full lg:flex-col lg:gap-1">
        {visibleSections.map(({ id, tKey, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? t(tKey) : undefined}
              className={cn(
                "transition",
                collapsed
                  ? cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border mx-auto",
                      isActive
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground",
                    )
                  : cn(
                      "flex min-h-10 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm",
                      isActive
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground",
                    ),
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {collapsed ? null : <span>{t(tKey)}</span>}
            </button>
          );
        })}

        {/* Collapse/expand toggle */}
        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "mt-auto flex items-center rounded-xl border border-transparent px-3 py-2 text-muted-foreground/80 transition hover:border-border hover:bg-muted/60 hover:text-foreground",
              collapsed ? "h-10 w-10 justify-center mx-auto" : "gap-3 text-sm",
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 shrink-0" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* Mobile: horizontal scrollable tabs */}
      <div className="scrollbar-hide flex w-full gap-2 overflow-x-auto px-4 py-2 lg:hidden">
        {visibleSections.map(({ id, tKey, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
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
