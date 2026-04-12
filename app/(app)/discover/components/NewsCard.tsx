import { ArrowUpCircle, MessageSquare, ExternalLink } from "lucide-react";
import type { NewsItem } from "../types";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatScore(n: number): string {
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function NewsCard({ item }: { item: NewsItem }) {
  const isHot = item.score >= 500;

  return (
    <article className="group relative flex flex-col rounded-xl border border-slate-200 bg-white transition-all duration-150 hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-1 flex-col p-4">
        {/* Score + subreddit badge */}
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
            Reddit
          </span>
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              isHot ? "text-orange-600" : "text-slate-500"
            }`}
          >
            <ArrowUpCircle className={`h-3.5 w-3.5 ${isHot ? "text-orange-500" : ""}`} />
            {formatScore(item.score)}
          </span>
        </div>

        {/* Title */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors hover:text-emerald-700"
        >
          {item.title}
        </a>

        {/* Description preview */}
        {item.description && (
          <p className="mb-2 line-clamp-2 text-[12px] leading-relaxed text-slate-500">
            {item.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>u/{item.author}</span>
            <span>{relativeTime(item.publishedAt)}</span>
            {item.commentCount > 0 && (
              <span className="flex items-center gap-0.5">
                <MessageSquare className="h-3 w-3" />
                {item.commentCount}
              </span>
            )}
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 font-medium text-slate-400 transition-colors hover:text-emerald-600"
            aria-label={`Read: ${item.title}`}
          >
            Read
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
