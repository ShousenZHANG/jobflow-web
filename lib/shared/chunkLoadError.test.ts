import { describe, expect, it } from "vitest";
import { isChunkLoadError } from "./chunkLoadError";

describe("isChunkLoadError", () => {
  it("detects common JavaScript and CSS chunk load failures", () => {
    expect(isChunkLoadError(new Error("Loading chunk app/jobs failed"))).toBe(true);
    expect(isChunkLoadError(new Error("Loading CSS chunk 123 failed"))).toBe(true);
    expect(isChunkLoadError(new Error("Failed to fetch dynamically imported module"))).toBe(true);
    expect(isChunkLoadError("ChunkLoadError: missing app chunk")).toBe(true);
  });

  it("does not classify normal application errors as chunk failures", () => {
    expect(isChunkLoadError(new Error("Job not found"))).toBe(false);
    expect(isChunkLoadError(null)).toBe(false);
  });
});
