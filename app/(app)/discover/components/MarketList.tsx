"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useMarkets } from "../hooks/useDiscoverData";
import { MarketCard } from "./MarketCard";
import { MarketSkeleton } from "./DiscoverSkeleton";

export function MarketList() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useMarkets();

  const items = data?.items ?? [];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 lg:text-lg">
          Prediction Markets
        </h2>
        <span className="text-[11px] font-medium text-slate-400">
          Powered by Polymarket
        </span>
      </div>

      {isLoading ? (
        <MarketSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          <p className="text-sm text-rose-700">
            {error instanceof Error ? error.message : "Failed to load markets"}
          </p>
          <button
            type="button"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["discover-markets"] })}
            className="flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-200"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No AI/tech prediction markets found.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <MarketCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
