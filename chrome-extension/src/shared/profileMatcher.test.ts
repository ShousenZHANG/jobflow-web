import { describe, it, expect } from "vitest";
import { matchValueToProfile } from "./profileMatcher";

describe("matchValueToProfile", () => {
  const profile = {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+61 400 000 000",
    city: "Sydney",
    linkedinUrl: "https://linkedin.com/in/johndoe",
  };

  it("returns exact match with confidence 1.0", () => {
    const result = matchValueToProfile("John Doe", profile);
    expect(result).toEqual({ profilePath: "fullName", confidence: 1.0 });
  });

  it("is case-insensitive for exact matches", () => {
    const result = matchValueToProfile("john doe", profile);
    expect(result).toEqual({ profilePath: "fullName", confidence: 1.0 });
  });

  it("returns substring match with confidence 0.7 for long values", () => {
    const result = matchValueToProfile("john@example", profile);
    expect(result).toEqual({ profilePath: "email", confidence: 0.7 });
  });

  it("returns null for short non-matching values", () => {
    const result = matchValueToProfile("abc", profile);
    expect(result).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(matchValueToProfile("", profile)).toBeNull();
  });

  it("returns null for whitespace-only string", () => {
    expect(matchValueToProfile("   ", profile)).toBeNull();
  });

  it("returns null when no profile fields match", () => {
    const result = matchValueToProfile("totally-unknown-value-here", profile);
    expect(result).toBeNull();
  });

  it("returns null for empty profile", () => {
    const result = matchValueToProfile("John Doe", {});
    expect(result).toBeNull();
  });

  it("handles profile values that contain the input (reverse substring)", () => {
    const result = matchValueToProfile("linkedin.com/in/johndoe", profile);
    expect(result).toEqual({ profilePath: "linkedinUrl", confidence: 0.7 });
  });

  it("trims whitespace from input", () => {
    const result = matchValueToProfile("  John Doe  ", profile);
    expect(result).toEqual({ profilePath: "fullName", confidence: 1.0 });
  });

  it("skips empty profile values", () => {
    const sparseProfile = { fullName: "", email: "john@example.com" };
    const result = matchValueToProfile("john@example.com", sparseProfile);
    expect(result).toEqual({ profilePath: "email", confidence: 1.0 });
  });
});
