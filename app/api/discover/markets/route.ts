import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import type { MarketItem, MarketsResponse } from "@/app/(app)/discover/types";

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const cache = new Map<string, { data: MarketsResponse; expiry: number }>();

const AI_TECH_KEYWORDS =
  /\b(ai|artificial.intelligence|gpt|llm|openai|anthropic|claude|gemini|google|apple|microsoft|meta|nvidia|tesla|spacex|crypto|bitcoin|ethereum|tech|robot|autonomous|quantum|chip|semiconductor)\b/i;

async function fetchPolymarket(): Promise<MarketItem[]> {
  const res = await fetch(
    "https://gamma-api.polymarket.com/markets?closed=false&limit=50&order=volume24hr&ascending=false",
    { headers: { "User-Agent": "Joblit-Discover/1.0" } },
  );
  if (!res.ok) throw new Error(`Polymarket API ${res.status}`);

  const markets: any[] = await res.json();

  return markets
    .filter((m) => AI_TECH_KEYWORDS.test(m.question ?? ""))
    .slice(0, 15)
    .map((m) => {
      const outcomes: string[] = JSON.parse(m.outcomes ?? "[]");
      const prices: number[] = JSON.parse(m.outcomePrices ?? "[]").map(Number);
      const slug = m.events?.[0]?.slug ?? m.slug ?? m.id;

      return {
        id: m.id,
        question: m.question,
        url: `https://polymarket.com/event/${slug}`,
        outcomes,
        prices,
        volume24h: m.volume24hr ?? 0,
        imageUrl: m.image ?? "",
        endDate: m.endDate ?? "",
      };
    });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cacheKey = "markets";
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return NextResponse.json(cached.data);
  }

  try {
    const items = await fetchPolymarket();
    const response: MarketsResponse = {
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
      err instanceof Error ? err.message : "Failed to fetch markets";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
