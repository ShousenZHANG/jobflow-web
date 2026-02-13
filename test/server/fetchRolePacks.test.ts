import { describe, expect, it } from "vitest";
import { expandRoleQueries } from "@/lib/shared/fetchRolePacks";

describe("fetch role packs", () => {
  it("expands software engineer to a related role pack", () => {
    const out = expandRoleQueries(["Software Engineer"]);
    expect(out).toEqual([
      "Software Engineer",
      "Software Developer",
      "Full Stack Engineer",
      "Full Stack Developer",
      "Backend Engineer",
      "Backend Developer",
      "Frontend Engineer",
      "Frontend Developer",
    ]);
  });

  it("dedupes roles while preserving order", () => {
    const out = expandRoleQueries(["Frontend Engineer", "Software Engineer"]);
    expect(out[0]).toBe("Frontend Engineer");
    expect(new Set(out).size).toBe(out.length);
  });

  it("falls back to original role when no pack is defined", () => {
    const out = expandRoleQueries(["Bioinformatics Engineer"]);
    expect(out).toEqual(["Bioinformatics Engineer"]);
  });
});

