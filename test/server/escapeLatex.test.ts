import { describe, expect, it } from "vitest";

import { escapeLatexWithBold } from "@/lib/server/latex/escapeLatex";

describe("escapeLatexWithBold", () => {
  it("preserves spaces around malformed bold markers", () => {
    const input = "Built **Java **and **Spring Boot** services.";
    const output = escapeLatexWithBold(input);

    expect(output).toContain("\\textbf{Java} and");
    expect(output).toContain("and \\textbf{Spring Boot} services.");
  });

  it("keeps plain text unchanged when no bold markers exist", () => {
    const input = "No marker content";
    const output = escapeLatexWithBold(input);

    expect(output).toBe("No marker content");
  });
});

