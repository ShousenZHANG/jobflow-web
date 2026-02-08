import { describe, expect, it } from "vitest";

import { computeTop3Coverage } from "@/lib/server/ai/responsibilityCoverage";

describe("responsibility coverage", () => {
  it("returns 2-3 addition target and fallback responsibilities when top-3 is under-covered", () => {
    const description = `
Responsibilities:
- Build distributed Java services for payments.
- Own CI/CD and release automation in GitHub Actions.
- Improve observability with OpenTelemetry and dashboards.
- Collaborate with product stakeholders on roadmap planning.
- Mentor engineers and run incident reviews.
`.trim();

    const baseBullets = ["Built backend services with Java and Spring Boot."];
    const coverage = computeTop3Coverage(description, baseBullets);

    expect(coverage.topResponsibilities.length).toBe(3);
    expect(coverage.missingFromBase.length).toBeGreaterThan(0);
    expect(coverage.requiredNewBulletsMin).toBe(2);
    expect(coverage.requiredNewBulletsMax).toBe(3);
    expect(coverage.fallbackResponsibilities.length).toBeGreaterThan(0);
  });

  it("returns zero additions when top-3 is already covered", () => {
    const description = `
- Build distributed Java services for payments.
- Own CI/CD and release automation in GitHub Actions.
- Improve observability with OpenTelemetry and dashboards.
`.trim();

    const baseBullets = [
      "Built distributed Java services for payments.",
      "Owned CI/CD and release automation in GitHub Actions.",
      "Improved observability with OpenTelemetry and dashboards.",
    ];
    const coverage = computeTop3Coverage(description, baseBullets);

    expect(coverage.missingFromBase).toHaveLength(0);
    expect(coverage.requiredNewBulletsMin).toBe(0);
    expect(coverage.requiredNewBulletsMax).toBe(0);
    expect(coverage.fallbackResponsibilities).toHaveLength(0);
  });
});
