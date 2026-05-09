"use client";

import { Sparkles } from "lucide-react";
import type { AiContent } from "@/lib/shared/schemas/aiContent";
import { cn } from "@/lib/utils";

interface SkillsSectionProps {
  skillsAdditions: AiContent["cv"]["skillsAdditions"];
  onChange: (next: AiContent["cv"]["skillsAdditions"]) => void;
}

export function SkillsSection({ skillsAdditions, onChange }: SkillsSectionProps) {
  if (skillsAdditions.length === 0) {
    return null;
  }
  const totalAccepted = skillsAdditions.filter((s) => s.accepted).length;

  function toggle(index: number, accepted: boolean) {
    onChange(skillsAdditions.map((s, i) => (i === index ? { ...s, accepted } : s)));
  }

  return (
    <section className="space-y-3 rounded-2xl border border-border/60 bg-background p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-brand-emerald-50 px-2 text-[11px] font-semibold uppercase tracking-wider text-brand-emerald-700">
            <Sparkles className="h-3 w-3" aria-hidden />
            AI proposed
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Skills additions
          </h2>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          {totalAccepted} of {skillsAdditions.length} accepted
        </span>
      </header>

      <ul className="flex flex-col gap-2">
        {skillsAdditions.map((group, i) => (
          <li
            key={`${group.label}-${i}`}
            className={cn(
              "flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors",
              group.accepted
                ? "border-brand-emerald-200 bg-brand-emerald-50/40"
                : "border-border/60 bg-muted/30",
            )}
          >
            <input
              type="checkbox"
              checked={group.accepted}
              onChange={(e) => toggle(i, e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-border/80 text-brand-emerald-600 focus:ring-brand-emerald-400/40"
              aria-label={`Accept skill addition for ${group.label}`}
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">
                {group.label}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex h-5 items-center rounded-full bg-background px-2 text-[11px] font-medium text-muted-foreground ring-1 ring-border/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
