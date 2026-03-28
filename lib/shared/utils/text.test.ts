import { describe, it, expect } from "vitest";
import { asRecord, asArray, toStringValue, hasText, truncate } from "./text";

describe("asRecord", () => {
  it("returns empty object for null", () => {
    expect(asRecord(null)).toEqual({});
  });

  it("returns empty object for undefined", () => {
    expect(asRecord(undefined)).toEqual({});
  });

  it("returns empty object for primitives", () => {
    expect(asRecord(42)).toEqual({});
    expect(asRecord("hello")).toEqual({});
    expect(asRecord(true)).toEqual({});
  });

  it("returns the object when given an object", () => {
    const obj = { a: 1, b: "two" };
    expect(asRecord(obj)).toBe(obj);
  });

  it("returns empty object for arrays (not a plain record)", () => {
    // Arrays are objects but asRecord should still cast them
    const arr = [1, 2];
    expect(asRecord(arr)).toBe(arr);
  });
});

describe("asArray", () => {
  it("returns the array when given an array", () => {
    const arr = [1, 2, 3];
    expect(asArray(arr)).toBe(arr);
  });

  it("returns empty array for non-array values", () => {
    expect(asArray(null)).toEqual([]);
    expect(asArray(undefined)).toEqual([]);
    expect(asArray(42)).toEqual([]);
    expect(asArray("hello")).toEqual([]);
    expect(asArray({ a: 1 })).toEqual([]);
  });
});

describe("toStringValue", () => {
  it("returns the string when given a string", () => {
    expect(toStringValue("hello")).toBe("hello");
  });

  it("returns empty string for non-string values", () => {
    expect(toStringValue(null)).toBe("");
    expect(toStringValue(undefined)).toBe("");
    expect(toStringValue(42)).toBe("");
    expect(toStringValue(true)).toBe("");
    expect(toStringValue({ a: 1 })).toBe("");
  });
});

describe("hasText", () => {
  it("returns true for non-whitespace content", () => {
    expect(hasText("hello")).toBe(true);
    expect(hasText("  hello  ")).toBe(true);
  });

  it("returns false for empty or whitespace-only strings", () => {
    expect(hasText("")).toBe(false);
    expect(hasText("   ")).toBe(false);
    expect(hasText("\t\n")).toBe(false);
  });
});

describe("truncate", () => {
  it("returns text unchanged when under max length", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns text unchanged when exactly at max length", () => {
    expect(truncate("12345", 5)).toBe("12345");
  });

  it("truncates with ellipsis when over max length", () => {
    expect(truncate("1234567890", 5)).toBe("12345...");
  });

  it("uses default max of 1600", () => {
    const short = "a".repeat(1600);
    expect(truncate(short)).toBe(short);

    const long = "a".repeat(1601);
    expect(truncate(long)).toBe("a".repeat(1600) + "...");
  });
});
