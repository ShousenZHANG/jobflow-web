import { describe, it, expect } from "vitest";
import {
  isFresh,
  isQuotaExceededError,
  buildCacheKey,
} from "./videoCacheHelpers";

describe("isFresh", () => {
  const NOW = 1_700_000_000_000;

  it("returns true when expiresAt is after now", () => {
    expect(isFresh({ expiresAt: new Date(NOW + 1000) }, NOW)).toBe(true);
  });

  it("returns false when expiresAt equals now (boundary)", () => {
    expect(isFresh({ expiresAt: new Date(NOW) }, NOW)).toBe(false);
  });

  it("returns false when expiresAt is in the past", () => {
    expect(isFresh({ expiresAt: new Date(NOW - 1) }, NOW)).toBe(false);
  });
});

describe("isQuotaExceededError", () => {
  it("detects HTTP 403 via status field", () => {
    expect(isQuotaExceededError({ status: 403 })).toBe(true);
  });

  it("detects HTTP 403 via code field", () => {
    expect(isQuotaExceededError({ code: 403 })).toBe(true);
  });

  it("detects quotaExceeded reason (any case)", () => {
    expect(isQuotaExceededError({ reason: "quotaExceeded" })).toBe(true);
    expect(isQuotaExceededError({ reason: "QUOTAEXCEEDED" })).toBe(true);
  });

  it("detects rateLimitExceeded reason", () => {
    expect(isQuotaExceededError({ reason: "rateLimitExceeded" })).toBe(true);
  });

  it("detects dailyLimitExceeded reason", () => {
    expect(isQuotaExceededError({ reason: "dailyLimitExceeded" })).toBe(true);
  });

  it("detects quotaExceeded via message substring", () => {
    expect(
      isQuotaExceededError({ message: "Error: quotaExceeded for project" }),
    ).toBe(true);
  });

  it("returns false for unrelated 4xx errors", () => {
    expect(isQuotaExceededError({ status: 404 })).toBe(false);
    expect(isQuotaExceededError({ status: 400 })).toBe(false);
  });

  it("returns false for non-object errors", () => {
    expect(isQuotaExceededError(null)).toBe(false);
    expect(isQuotaExceededError(undefined)).toBe(false);
    expect(isQuotaExceededError("string error")).toBe(false);
    expect(isQuotaExceededError(42)).toBe(false);
  });

  it("returns false for empty object", () => {
    expect(isQuotaExceededError({})).toBe(false);
  });
});

describe("buildCacheKey", () => {
  it("builds deterministic key with category and window", () => {
    expect(buildCacheKey("claude", "week")).toBe("videos:claude:week");
    expect(buildCacheKey("all", "month")).toBe("videos:all:month");
  });

  it("is stable for same inputs (no surprise normalization)", () => {
    const a = buildCacheKey("agent-skills", "week");
    const b = buildCacheKey("agent-skills", "week");
    expect(a).toBe(b);
  });
});
