"use client";

import { Check, AlertTriangle, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MatchBreakdown, MatchTier } from "../types";

interface MatchScoreCardProps {
  score: number | null | undefined;
  breakdown: MatchBreakdown | null | undefined;
}

const TIER_ACCENT: Record<MatchTier, { text: string; bg: string; border: string }> = {
  strong: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  good: {
    text: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  fair: {
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  weak: {
    text: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
};

/**
 * Rich score card for the Job detail panel. Shows aggregate tier, matched
 * vs missing skills (stable sorted) and the four component scores so users
 * understand WHY their match is strong or weak.
 */
export function MatchScoreCard({ score, breakdown }: MatchScoreCardProps) {
  const t = useTranslations("matchScore");

  // Unscored state — prompt the user to set up their resume.
  if (score === null || score === undefined || !breakdown) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <Target className="h-3.5 w-3.5" aria-hidden />
          <span>{t("notScored")}</span>
        </div>
        <p className="mt-1 text-slate-500">{t("notScoredDesc")}</p>
      </div>
    );
  }

  const tierStyle = TIER_ACCENT[breakdown.tier];
  const { matchedSkills, missingSkills } = breakdown;
  const tierLabel = t(`tier.${breakdown.tier}`);

  return (
    <div
      className={`rounded-xl border ${tierStyle.border} ${tierStyle.bg} p-3 text-sm`}
      data-testid="match-score-card"
      data-tier={breakdown.tier}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${tierStyle.text}`}>
            {Math.round(score)}%
          </span>
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${tierStyle.text}`}
          >
            {tierLabel}
          </span>
        </div>
        <span className="text-[10px] text-slate-500">{t("matchScore")}</span>
      </div>

      {/* Matched skills */}
      {matchedSkills.length > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
            <Check className="h-3 w-3" aria-hidden />
            <span>
              {t("matched")} ({matchedSkills.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {matchedSkills.map((s) => (
              <span
                key={s}
                className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing skills */}
      {missingSkills.length > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-amber-700">
            <AlertTriangle className="h-3 w-3" aria-hidden />
            <span>
              {t("missing")} ({missingSkills.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {missingSkills.map((s) => (
              <span
                key={s}
                className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-800"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown */}
      <div className="mt-3 border-t border-slate-900/10 pt-2">
        <div className="mb-1.5 text-[11px] font-medium text-slate-500">
          {t("breakdown")}
        </div>
        <div className="grid grid-cols-4 gap-2 text-[11px]">
          <BreakdownCell label={t("bSkills")} value={breakdown.breakdown.skillsScore} />
          <BreakdownCell label={t("bTitle")} value={breakdown.breakdown.titleScore} />
          <BreakdownCell label={t("bLevel")} value={breakdown.breakdown.levelScore} />
          <BreakdownCell label={t("bYears")} value={breakdown.breakdown.experienceScore} />
        </div>
      </div>
    </div>
  );
}

function BreakdownCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center rounded-md bg-white/60 px-1 py-1.5 ring-1 ring-slate-900/5">
      <span className="text-base font-semibold text-slate-800">{Math.round(value)}</span>
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
}
