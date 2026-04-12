"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNews } from "../hooks/useDiscoverData";
import { NewsCard } from "./NewsCard";
import { NewsSkeleton } from "./DiscoverSkeleton";

export function NewsList() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useNews();

  const items = data?.items ?? [];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 lg:text-lg">
          AI Community
        </h2>
        <span className="text-[11px] font-medium text-slate-400">
          r/ClaudeAI + r/anthropic + r/LocalLLaMA
        </span>
      </div>

      {isLoading ? (
        <NewsSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          <p className="text-sm text-rose-700">
            {error instanceof Error ? error.message : "Failed to load news"}
          </p>
          <button
            type="button"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["discover-news"] })
            }
            className="flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-200"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">
            No posts found this week. Reddit may be temporarily unavailable from this server.
          </p>
          <button
            type="button"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["discover-news"] })
            }
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
