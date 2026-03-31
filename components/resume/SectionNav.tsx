"use client";

import { User, FileText, Briefcase, FolderKanban, GraduationCap, Wrench } from "lucide-react";
import { useResumeContext } from "./ResumeContext";
import type { SectionId } from "./constants";
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

export function SectionNav({ className }: SectionNavProps) {
  const { activeSection, setActiveSection, t } = useResumeContext();

  return (
    <nav className={cn("flex", className)} aria-label="Resume sections">
      {/* Desktop: vertical list */}
      <div className="hidden lg:flex lg:w-full lg:flex-col lg:gap-1">
        {SECTION_CONFIG.map(({ id, tKey, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-10 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition",
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-white/70",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{t(tKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile: horizontal scrollable tabs */}
      <div className="scrollbar-hide flex w-full gap-2 overflow-x-auto px-4 py-2 lg:hidden">
        {SECTION_CONFIG.map(({ id, tKey, icon: Icon }) => {
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
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300",
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
