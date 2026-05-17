import { describe, it, expect } from "vitest";
import {
  queriesForCategory,
  scoreRelevance,
  searchOrderForSort,
  ALL_VIDEO_CACHE_COMBOS,
} from "./videoPipeline";

describe("queriesForCategory", () => {
  it('"all" returns exactly one query per sub-category (quota-safe)', () => {
    const queries = queriesForCategory("all");
    // Seven sub-categories, one query each, well under the previous 25.
    expect(queries.length).toBe(7);
    // No duplicates.
    expect(new Set(queries).size).toBe(queries.length);
  });

  it("returns at most 4 queries per specific category", () => {
    for (const cat of [
      "claude",
      "codex",
      "anthropic",
      "rag",
      "agents",
      "agent-skills",
      "harness-engineering",
    ] as const) {
      const queries = queriesForCategory(cat);
      expect(queries.length).toBeLessThanOrEqual(4);
      expect(queries.length).toBeGreaterThan(0);
    }
  });

  it("is deterministic for the same input", () => {
    expect(queriesForCategory("claude")).toEqual(queriesForCategory("claude"));
  });

  it("includes Codex-specific search intent", () => {
    const text = queriesForCategory("codex").join(" ").toLowerCase();
    expect(text).toContain("codex");
    expect(text).toContain("openai");
  });
});

describe("scoreRelevance", () => {
  it("returns 0 for text with no category keywords", () => {
    expect(scoreRelevance("a story about cats", "rag")).toBe(0);
  });

  it("scores 1/3 for a single matching keyword", () => {
    expect(scoreRelevance("intro to claude", "claude")).toBeCloseTo(
      1 / 3,
      5,
    );
  });

  it("saturates at 1.0 after three matches", () => {
    expect(
      scoreRelevance(
        "agent agentic autonomous tool use function call",
        "agents",
      ),
    ).toBe(1);
  });

  it('"all" takes the max across every sub-category', () => {
    // text matches 3 claude keywords → all-category score should also be 1
    expect(
      scoreRelevance("claude anthropic sonnet opus", "all"),
    ).toBe(1);
  });

  it("is case-insensitive", () => {
    expect(scoreRelevance("CLAUDE SONNET", "claude")).toBeGreaterThan(0);
  });

  it("scores Codex coding-agent content", () => {
    expect(
      scoreRelevance("OpenAI Codex CLI coding agent tutorial", "codex"),
    ).toBeGreaterThan(0);
  });
});

describe("searchOrderForSort", () => {
  it("maps UI sort options to YouTube search orders", () => {
    expect(searchOrderForSort("trending")).toBe("relevance");
    expect(searchOrderForSort("latest")).toBe("date");
    expect(searchOrderForSort("most_viewed")).toBe("viewCount");
  });
});

describe("ALL_VIDEO_CACHE_COMBOS", () => {
  it("covers 16 (cat, window) pairs: 8 categories x 2 windows", () => {
    expect(ALL_VIDEO_CACHE_COMBOS.length).toBe(16);
  });

  it("contains every category exactly twice (once per window)", () => {
    const counts = new Map<string, number>();
    for (const c of ALL_VIDEO_CACHE_COMBOS) {
      counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    }
    for (const n of counts.values()) expect(n).toBe(2);
  });

  it("has no duplicate (category, window) pairs", () => {
    const keys = ALL_VIDEO_CACHE_COMBOS.map(
      (c) => `${c.category}:${c.timeWindow}`,
    );
    expect(new Set(keys).size).toBe(keys.length);
  });
});
