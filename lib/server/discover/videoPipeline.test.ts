import { describe, it, expect } from "vitest";
import {
  queriesForCategory,
  scoreRelevance,
  ALL_VIDEO_CACHE_COMBOS,
} from "./videoPipeline";

describe("queriesForCategory", () => {
  it('"all" returns exactly one query per sub-category (quota-safe)', () => {
    const queries = queriesForCategory("all");
    // Six sub-categories (claude, anthropic, rag, agents, agent-skills,
    // harness-engineering) → 6 queries — well under the previous 25.
    expect(queries.length).toBe(6);
    // No duplicates.
    expect(new Set(queries).size).toBe(queries.length);
  });

  it("returns at most 4 queries per specific category", () => {
    for (const cat of [
      "claude",
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
});

describe("ALL_VIDEO_CACHE_COMBOS", () => {
  it("covers 14 (cat, window) pairs — 7 categories × 2 windows", () => {
    expect(ALL_VIDEO_CACHE_COMBOS.length).toBe(14);
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
