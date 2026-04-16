"use client";

import { useTranslations } from "next-intl";
import type { MinScoreTier } from "../types";

interface TierFilterProps {
  value: MinScoreTier;
  onChange: (next: MinScoreTier) => void;
  /** How many currently-loaded jobs fall below the active tier — for the
   *  "N hidden" hint. Pass 0 to suppress the hint. */
  hiddenCount?: number;
}

const TIERS: MinScoreTier[] = ["strong", "good", "fair", "any"];

/**
 * "Filter, don't spray" pill selector. Persists the user's selected
 * minimum-fit threshold so they can hide weak matches by default.
 */
export function TierFilter({ value, onChange, hiddenCount }: TierFilterProps) {
  const t = useTranslations("matchScore");
  return (
    <div className="flex items-center gap-2">
      <div
        role="tablist"
        aria-label={t("filterLabel")}
        className="inline-flex gap-0.5 rounded-full bg-slate-100/80 p-0.5"
      >
        {TIERS.map((tier) => {
          const active = value === tier;
          return (
            <button
              key={tier}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tier)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all sm:text-xs ${
                active
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t(`filterOption.${tier}`)}
            </button>
          );
        })}
      </div>
      {hiddenCount && hiddenCount > 0 && value !== "any" ? (
        <button
          type="button"
          onClick={() => onChange("any")}
          className="text-[11px] font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
        >
          {t("hiddenCount", { count: hiddenCount })}
        </button>
      ) : null}
    </div>
  );
}
