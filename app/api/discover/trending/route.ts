import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import type { TrendingRepo, TrendingResponse } from "@/app/(app)/discover/types";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Narrowing helpers for untyped third-party JSON responses.
function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}
function asNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

const cache = new Map<string, { data: TrendingResponse; expiry: number }>();

// ── Primary: OSS Insight Trending API (real weekly/monthly trending by activity score) ──

async function fetchOSSInsight(
  period: "weekly" | "monthly",
): Promise<TrendingRepo[]> {
  const ossPeriod = period === "weekly" ? "past_week" : "past_month";
  const url = `https://api.ossinsight.io/v1/trends/repos?period=${ossPeriod}&limit=20`;

  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "Joblit-Discover/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`OSS Insight API ${res.status}`);

  const json = (await res.json()) as unknown;
  const rawRows = asRecord(asRecord(json).data).rows;
  const rows: unknown[] = Array.isArray(rawRows) ? rawRows : [];

  return rows.map((raw) => {
    const row = asRecord(raw);
    const repoName = asString(row.repo_name);
    return {
      id: asNumber(row.repo_id),
      fullName: repoName,
      description: asNullableString(row.description),
      url: `https://github.com/${repoName}`,
      stars: asNumber(row.stars),
      forks: asNumber(row.forks),
      language: asNullableString(row.primary_language),
      topics: asString(row.collection_names)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5),
      ownerAvatar: repoName
        ? `https://github.com/${repoName.split("/")[0]}.png?size=64`
        : "",
      pushedAt: "", // OSS Insight does not provide push date
    };
  });
}

// ── Fallback: GitHub Search API ──

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

async function fetchGitHubSearch(
  period: "weekly" | "monthly",
): Promise<TrendingRepo[]> {
  const since = period === "weekly" ? daysAgo(7) : daysAgo(30);
  const url = new URL("https://api.github.com/search/repositories");
  url.searchParams.set("q", `created:>${since} stars:>50`);
  url.searchParams.set("sort", "stars");
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", "20");

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Joblit-Discover/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url.toString(), { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);

  const json = (await res.json()) as unknown;
  const rawItems = asRecord(json).items;
  const items: unknown[] = Array.isArray(rawItems) ? rawItems : [];

  return items.map((raw) => {
    const item = asRecord(raw);
    const owner = asRecord(item.owner);
    const topics = Array.isArray(item.topics)
      ? (item.topics as unknown[]).filter((t): t is string => typeof t === "string")
      : [];
    return {
      id: asNumber(item.id),
      fullName: asString(item.full_name),
      description: asNullableString(item.description),
      url: asString(item.html_url),
      stars: asNumber(item.stargazers_count),
      forks: asNumber(item.forks_count),
      language: asNullableString(item.language),
      topics: topics.slice(0, 5),
      ownerAvatar: asString(owner.avatar_url),
      pushedAt: asString(item.pushed_at),
    };
  });
}

// ── Route handler ──

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period =
    searchParams.get("period") === "monthly" ? "monthly" : "weekly";

  const cacheKey = `trending:${period}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return NextResponse.json(cached.data);
  }

  try {
    // Primary: OSS Insight (real trending by activity score)
    // Fallback: GitHub Search API (recent high-star repos)
    let repos: TrendingRepo[];
    try {
      repos = await fetchOSSInsight(period);
    } catch {
      repos = await fetchGitHubSearch(period);
    }

    const response: TrendingResponse = {
      repos,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
    cache.set(cacheKey, {
      data: { ...response, cached: true },
      expiry: Date.now() + CACHE_TTL_MS,
    });
    return NextResponse.json(response);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch trending repos";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
