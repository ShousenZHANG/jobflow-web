import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import type { NewsItem, NewsResponse } from "@/app/(app)/discover/types";

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const cache = new Map<string, { data: NewsResponse; expiry: number }>();

const SUBREDDITS = ["ClaudeAI", "anthropic", "LocalLLaMA"];

async function fetchSubreddit(sub: string): Promise<NewsItem[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${sub}/top.json?t=week&limit=20`,
    {
      headers: {
        "User-Agent": "Joblit:discover:v1.0 (by /u/joblit-app)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    },
  );

  if (!res.ok) {
    // Reddit returns 429 from some cloud IPs — log and skip
    console.warn(`Reddit r/${sub} returned ${res.status}`);
    return [];
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) {
    // Reddit sometimes returns HTML login page instead of JSON
    console.warn(`Reddit r/${sub} returned non-JSON: ${contentType}`);
    return [];
  }

  const json = await res.json();
  const posts: any[] = json?.data?.children ?? [];

  return posts
    .filter((child: any) => {
      const p = child?.data;
      return p && (p.score ?? 0) >= 10;
    })
    .map(({ data: p }: any) => ({
      id: `reddit-${p.id}`,
      source: "reddit" as const,
      title: p.title ?? "",
      url:
        p.url_overridden_by_dest && !p.url_overridden_by_dest.startsWith("https://www.reddit.com")
          ? p.url_overridden_by_dest
          : `https://www.reddit.com${p.permalink}`,
      score: p.score ?? 0,
      author: p.author ?? "",
      publishedAt: new Date((p.created_utc ?? 0) * 1000).toISOString(),
      commentCount: p.num_comments ?? 0,
      description: (p.selftext ?? "").slice(0, 200) || undefined,
    }));
}

async function fetchAllReddit(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    SUBREDDITS.map((sub) => fetchSubreddit(sub)),
  );

  const items: NewsItem[] = [];
  const seenUrls = new Set<string>();

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      // Deduplicate cross-posts
      if (!seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        items.push(item);
      }
    }
  }

  // Sort by score descending
  return items.sort((a, b) => b.score - a.score);
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cacheKey = "news:reddit";
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return NextResponse.json(cached.data);
  }

  try {
    const items = await fetchAllReddit();
    const response: NewsResponse = {
      items,
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
      err instanceof Error ? err.message : "Failed to fetch news";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
