import { describe, expect, it } from "vitest";
import { shouldUseRelevanceSort, escapeLikePattern } from "@/lib/server/jobs/searchUtils";

describe("shouldUseRelevanceSort", () => {
  it("returns false for empty string", () => {
    expect(shouldUseRelevanceSort("")).toBe(false);
  });

  it("returns false for 1-2 character English query", () => {
    expect(shouldUseRelevanceSort("ab")).toBe(false);
  });

  it("returns true for 3+ character English query", () => {
    expect(shouldUseRelevanceSort("eng")).toBe(true);
  });

  it("returns true for long English query", () => {
    expect(shouldUseRelevanceSort("software engineer")).toBe(true);
  });

  it("returns false for single Chinese character", () => {
    expect(shouldUseRelevanceSort("产")).toBe(false);
  });

  it("returns true for 2+ Chinese characters", () => {
    expect(shouldUseRelevanceSort("产品经理")).toBe(true);
  });

  it("returns true for mixed Chinese-English 3+ chars", () => {
    expect(shouldUseRelevanceSort("AI工程师")).toBe(true);
  });

  it("trims whitespace before checking length", () => {
    expect(shouldUseRelevanceSort("  a  ")).toBe(false);
  });
});

describe("escapeLikePattern", () => {
  it("escapes percent sign", () => {
    expect(escapeLikePattern("100%")).toBe("100\\%");
  });

  it("escapes underscore", () => {
    expect(escapeLikePattern("job_title")).toBe("job\\_title");
  });

  it("escapes backslash", () => {
    expect(escapeLikePattern("path\\to")).toBe("path\\\\to");
  });

  it("returns normal strings unchanged", () => {
    expect(escapeLikePattern("software engineer")).toBe("software engineer");
  });

  it("escapes multiple special characters", () => {
    expect(escapeLikePattern("50%_off\\deal")).toBe("50\\%\\_off\\\\deal");
  });
});
