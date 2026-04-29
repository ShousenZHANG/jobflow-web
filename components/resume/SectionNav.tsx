"use client";

import { useEffect, useRef, type ElementType } from "react";
import {
  User,
  FileText,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Wrench,
  Save,
  Eye,
  Loader2,
} from "lucide-react";
import { useResumeContext } from "./ResumeContext";
import type { SectionId } from "./constants";
import { getSectionIds } from "./constants";
import { cn } from "@/lib/utils";

type SectionTranslationKey =
  | "personalInfo"
  | "summary"
  | "experience"
  | "projects"
  | "education"
  | "skills";

const SECTION_CONFIG: Array<{ id: SectionId; tKey: SectionTranslationKey; icon: ElementType }> = [
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
 * Primary resume navigation.
 *
 * Desktop uses a compact text sidebar: navigation stays in the top
 * region, while the bottom dock owns the primary save action plus a
 * persistent status dot. Mobile keeps the preview/save icon cluster
 * beside the horizontal section tabs.
 */
export function SectionNav({ className }: SectionNavProps) {
  const {
    activeSection,
    setActiveSection,
    locale,
    t,
    saving,
    handleSave,
    hasAnyContent,
    setPreviewOpen,
    schedulePreview,
    isTaskHighlighted,
  } = useResumeContext();

  const visibleSectionIds = getSectionIds(locale);
  const visibleSections = SECTION_CONFIG.filter((s) => visibleSectionIds.includes(s.id));
  const guideHighlight = isTaskHighlighted("resume_setup");

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

  const saveStatusLabel = saving
    ? t("saving")
    : hasAnyContent
      ? t("toastSaved")
      : t("toastAddDetailsFirst");

  return (
    <nav className={cn("flex [contain:layout_style]", className)} aria-label="Resume sections">
      <div className="hidden lg:flex lg:h-full lg:w-full lg:flex-col lg:bg-card/35 lg:px-2.5 lg:py-3">
        <div className="px-2 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {t("resumeSetup")}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-1">
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
                  "group relative flex h-10 w-full items-center gap-2 rounded-xl px-2.5 text-left text-[13px] font-medium",
                  "transition-colors duration-150 ease-out motion-reduce:transition-none",
                  "active:scale-[0.98] motion-reduce:active:scale-100",
                  isActive
                    ? "bg-emerald-500/12 text-emerald-700 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.16)] dark:bg-emerald-500/15 dark:text-emerald-300"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">{label}</span>
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-[3px] bg-emerald-600 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-3 border-t border-border/70 pt-3">
          <div className="mb-2 flex items-center gap-2 px-1 text-xs text-muted-foreground">
            <span
              aria-hidden
              className={cn(
                "h-2 w-2 shrink-0 rounded-full ring-[3px] transition-colors",
                saving
                  ? "bg-amber-500 ring-amber-500/20 motion-safe:animate-pulse"
                  : hasAnyContent
                    ? "bg-emerald-500 ring-emerald-500/15"
                    : "bg-muted-foreground/40 ring-muted-foreground/10",
              )}
            />
            <span aria-live="polite" className="min-w-0 truncate font-medium text-foreground/75">
              {saveStatusLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasAnyContent}
            aria-label={saving ? t("saving") : t("saveSelectedResume")}
            title={saving ? t("saving") : t("saveSelectedResume")}
            data-guide-anchor="resume_setup"
            data-guide-highlight={guideHighlight ? "true" : "false"}
            className={cn(
              "flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-[13px] font-semibold text-white",
              "shadow-[0_10px_24px_-14px_rgba(5,150,105,0.7)] transition-[transform,box-shadow,filter] duration-150 ease-out",
              "hover:brightness-105 hover:shadow-[0_14px_28px_-14px_rgba(5,150,105,0.8)]",
              "active:scale-[0.98] motion-reduce:active:scale-100",
              "disabled:cursor-not-allowed disabled:opacity-70",
              guideHighlight &&
                "ring-2 ring-emerald-400 ring-offset-2 ring-offset-background",
            )}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
            ) : (
              <Save className="h-4 w-4 shrink-0" aria-hidden />
            )}
            <span className="min-w-0 truncate">
              {saving ? t("saving") : t("saveSelectedResume")}
            </span>
          </button>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 px-3 py-2 lg:hidden">
        <div
          className="scrollbar-hide flex flex-1 gap-2 overflow-x-auto scroll-smooth"
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

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            disabled={!hasAnyContent}
            onClick={() => {
              setPreviewOpen(true);
              schedulePreview(0);
            }}
            aria-label={t("preview")}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-emerald-300 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Eye className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasAnyContent}
            aria-label={saving ? t("saving") : t("saveSelectedResume")}
            data-guide-anchor="resume_setup"
            data-guide-highlight={guideHighlight ? "true" : "false"}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white shadow-sm",
              "transition-[transform,filter] duration-150 ease-out",
              "hover:brightness-105 active:scale-[0.97] motion-reduce:active:scale-100",
              "disabled:cursor-not-allowed disabled:opacity-60",
              guideHighlight &&
                "ring-2 ring-emerald-400 ring-offset-2 ring-offset-background",
            )}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Save className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
