import { describe, it, expect } from "vitest";
import { chunkArray } from "./chunk";

describe("chunkArray", () => {
  it("splits array into evenly sized chunks", () => {
    expect(chunkArray([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
  });

  it("places remainder in the final (smaller) chunk", () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns a single chunk when input is shorter than size", () => {
    expect(chunkArray([1, 2], 5)).toEqual([[1, 2]]);
  });

  it("returns empty array for empty input (no empty chunk)", () => {
    expect(chunkArray([], 5)).toEqual([]);
  });

  it("handles size of 1", () => {
    expect(chunkArray(["a", "b", "c"], 1)).toEqual([["a"], ["b"], ["c"]]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4];
    const snapshot = [...input];
    chunkArray(input, 2);
    expect(input).toEqual(snapshot);
  });

  it("throws on non-positive size to surface programmer error", () => {
    expect(() => chunkArray([1, 2], 0)).toThrow();
    expect(() => chunkArray([1, 2], -1)).toThrow();
  });
});
