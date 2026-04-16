import { describe, it, expect } from "vitest";
import { SKILLS_GAZETTEER, extractSkills } from "./skillsGazetteer";

describe("SKILLS_GAZETTEER", () => {
  it("has no duplicate canonical names", () => {
    const names = SKILLS_GAZETTEER.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("every entry has at least one alias OR an empty-alias opt-out", () => {
    // Some entries intentionally have empty aliases (too noisy, e.g. "R", "C")
    // but should still be structurally valid.
    for (const entry of SKILLS_GAZETTEER) {
      expect(entry.name).toBeTruthy();
      expect(Array.isArray(entry.aliases)).toBe(true);
    }
  });

  it("no duplicate aliases across entries", () => {
    const seen = new Set<string>();
    for (const entry of SKILLS_GAZETTEER) {
      for (const alias of entry.aliases) {
        expect(seen.has(alias), `duplicate alias: ${alias}`).toBe(false);
        seen.add(alias);
      }
    }
  });

  it("covers at least 200 distinct skills (coverage floor)", () => {
    expect(SKILLS_GAZETTEER.length).toBeGreaterThanOrEqual(200);
  });
});

describe("extractSkills", () => {
  it("returns empty set for empty input", () => {
    expect(extractSkills("")).toEqual(new Set());
  });

  it("extracts a single skill from text", () => {
    expect(extractSkills("Strong React experience required")).toEqual(
      new Set(["React"]),
    );
  });

  it("extracts multiple skills", () => {
    const result = extractSkills(
      "We use React, TypeScript, and Node.js in production",
    );
    expect(result).toEqual(new Set(["React", "TypeScript", "Node.js"]));
  });

  it("is case-insensitive", () => {
    expect(extractSkills("REACT developer")).toEqual(new Set(["React"]));
    expect(extractSkills("typescript engineer")).toEqual(
      new Set(["TypeScript"]),
    );
  });

  it("normalizes aliases to canonical name", () => {
    expect(extractSkills("React.js and ReactJS are the same")).toEqual(
      new Set(["React"]),
    );
    expect(extractSkills("nodejs and Node.js")).toEqual(new Set(["Node.js"]));
  });

  it("deduplicates repeated mentions", () => {
    expect(extractSkills("Python python PYTHON python3")).toEqual(
      new Set(["Python"]),
    );
  });

  it("respects word boundaries (does not match substrings)", () => {
    // "go" should NOT match inside "google"
    expect(extractSkills("I work at google")).not.toContain("Go");
    // "java" should NOT match inside "javascript"
    const jsOnly = extractSkills("javascript only");
    expect(jsOnly.has("JavaScript")).toBe(true);
    expect(jsOnly.has("Java")).toBe(false);
  });

  it("handles punctuation and whitespace correctly", () => {
    const result = extractSkills(
      "Skills: React, TypeScript; experience with Docker/Kubernetes.",
    );
    expect(result).toEqual(
      new Set(["React", "TypeScript", "Docker", "Kubernetes"]),
    );
  });

  it("matches longer aliases before shorter ones (e.g. Node.js before node)", () => {
    // Only Node.js entry has these aliases; there's no separate "Node" entry.
    // This asserts that "Node.js" phrase gets picked up instead of silently
    // failing due to the "." in the alias.
    expect(extractSkills("Node.js backend")).toEqual(new Set(["Node.js"]));
  });

  it("treats multiple calls independently (regex state reset)", () => {
    const first = extractSkills("React developer");
    const second = extractSkills("Python engineer");
    expect(first).toEqual(new Set(["React"]));
    expect(second).toEqual(new Set(["Python"]));
  });

  it("extracts skills from a realistic JD paragraph", () => {
    const jd = `
      We're looking for a Senior Backend Engineer to join our platform team.
      Requirements: 5+ years with Java and Spring Boot, hands-on experience
      with Kubernetes, Docker, PostgreSQL, Redis, and Kafka. Bonus: Terraform
      and AWS (Lambda, SQS). Familiar with gRPC and REST APIs. Git for version
      control.
    `;
    const result = extractSkills(jd);
    expect(result.has("Java")).toBe(true);
    expect(result.has("Spring Boot")).toBe(true);
    expect(result.has("Kubernetes")).toBe(true);
    expect(result.has("Docker")).toBe(true);
    expect(result.has("PostgreSQL")).toBe(true);
    expect(result.has("Redis")).toBe(true);
    expect(result.has("Kafka")).toBe(true);
    expect(result.has("Terraform")).toBe(true);
    expect(result.has("AWS")).toBe(true);
    expect(result.has("Lambda")).toBe(true);
    expect(result.has("SQS")).toBe(true);
    expect(result.has("gRPC")).toBe(true);
    expect(result.has("REST")).toBe(true);
    expect(result.has("Git")).toBe(true);
  });
});
