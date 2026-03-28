import { describe, it, expect } from "vitest";
import {
  BASE_STOPWORDS,
  COVER_STOPWORDS,
  QUALITY_STOPWORDS,
  tokenize,
} from "./textAnalysis";

describe("BASE_STOPWORDS", () => {
  it("contains common grammar words", () => {
    expect(BASE_STOPWORDS.has("the")).toBe(true);
    expect(BASE_STOPWORDS.has("and")).toBe(true);
    expect(BASE_STOPWORDS.has("for")).toBe(true);
  });

  it("does not contain domain words", () => {
    expect(BASE_STOPWORDS.has("react")).toBe(false);
    expect(BASE_STOPWORDS.has("typescript")).toBe(false);
  });
});

describe("COVER_STOPWORDS", () => {
  it("includes all base stopwords", () => {
    for (const word of BASE_STOPWORDS) {
      expect(COVER_STOPWORDS.has(word)).toBe(true);
    }
  });

  it("includes cover-specific words", () => {
    expect(COVER_STOPWORDS.has("using")).toBe(true);
    expect(COVER_STOPWORDS.has("experience")).toBe(true);
    expect(COVER_STOPWORDS.has("responsibilities")).toBe(true);
  });
});

describe("QUALITY_STOPWORDS", () => {
  it("includes all base stopwords", () => {
    for (const word of BASE_STOPWORDS) {
      expect(QUALITY_STOPWORDS.has(word)).toBe(true);
    }
  });

  it("includes quality-specific words", () => {
    expect(QUALITY_STOPWORDS.has("role")).toBe(true);
    expect(QUALITY_STOPWORDS.has("team")).toBe(true);
    expect(QUALITY_STOPWORDS.has("company")).toBe(true);
  });
});

describe("tokenize", () => {
  it("lowercases and splits text into tokens", () => {
    const result = tokenize("Built React Components");
    expect(result).toContain("built");
    expect(result).toContain("react");
    expect(result).toContain("components");
  });

  it("strips bold markers (**)", () => {
    const result = tokenize("**TypeScript** development");
    expect(result).toContain("typescript");
    expect(result).toContain("development");
    expect(result.some((t) => t.includes("**"))).toBe(false);
  });

  it("filters out tokens shorter than 4 characters", () => {
    const result = tokenize("I am a dev who codes");
    // "dev" is 3 chars, should be excluded; "codes" has 5, included
    expect(result).not.toContain("dev");
    expect(result).toContain("codes");
  });

  it("filters out base stopwords by default", () => {
    const result = tokenize("this is the test with from");
    expect(result).toContain("test");
    expect(result).not.toContain("this");
    expect(result).not.toContain("with");
    expect(result).not.toContain("from");
  });

  it("accepts custom stopwords set", () => {
    const customStopwords = new Set(["test", "hello"]);
    const result = tokenize("test hello world something", customStopwords);
    expect(result).not.toContain("test");
    expect(result).not.toContain("hello");
    expect(result).toContain("world");
    expect(result).toContain("something");
  });

  it("preserves tech-related special characters", () => {
    const result = tokenize("node.js c++ c#sharp react/redux");
    // These contain special chars that should be preserved
    expect(result).toContain("node.js");
    expect(result).toContain("react/redux");
  });

  it("returns empty array for empty input", () => {
    expect(tokenize("")).toEqual([]);
  });
});
