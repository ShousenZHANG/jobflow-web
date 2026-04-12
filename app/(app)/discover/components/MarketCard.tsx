import { ExternalLink, TrendingUp } from "lucide-react";
import type { MarketItem } from "../types";

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n)}`;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MarketCard({ item }: { item: MarketItem }) {
  // Find the leading outcome
  const leadIdx = item.prices.indexOf(Math.max(...item.prices));
  const leadOutcome = item.outcomes[leadIdx] ?? "—";
  const leadPct = Math.round((item.prices[leadIdx] ?? 0) * 100);

  return (
    <article className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all duration-150 hover:border-slate-300 hover:shadow-md">
      {/* Question */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 line-clamp-2 block text-sm font-semibold leading-snug text-slate-900 transition-colors hover:text-emerald-700"
      >
        {item.question}
      </a>

      {/* Outcome bars */}
      <div className="mb-3 space-y-1.5">
        {item.outcomes.slice(0, 3).map((outcome, i) => {
          const pct = Math.round((item.prices[i] ?? 0) * 100);
          const isLead = i === leadIdx;
          return (
            <div key={outcome} className="flex items-center gap-2">
              <span
                className={`w-14 shrink-0 text-right text-xs font-semibold ${
                  isLead ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                {pct}%
              </span>
              <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
                    isLead
                      ? "bg-emerald-500/20"
                      : "bg-slate-200"
                  }`}
                  style={{ width: `${pct}%` }}
                />
                <span className="relative z-10 flex h-full items-center px-2 text-[11px] font-medium text-slate-700">
                  {outcome}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: volume + end date */}
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-slate-500">
            <TrendingUp className="h-3 w-3" />
            {formatVolume(item.volume24h)} 24h
          </span>
          {item.endDate && (
            <span>Ends {formatDate(item.endDate)}</span>
          )}
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-0.5 font-medium text-slate-400 transition-colors hover:text-emerald-600"
          aria-label={`View market: ${item.question}`}
        >
          Trade
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}
