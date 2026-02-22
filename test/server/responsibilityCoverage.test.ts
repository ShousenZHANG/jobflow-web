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

  it("filters out narrative company intro from top responsibilities", () => {
    const description = `
About us:
Aircall is a unicorn, AI-powered customer communications platform used by 22,000+ companies worldwide.
Aircall is headquartered in Paris with offices across Seattle, London, Berlin, Sydney, and New York.

Responsibilities:
- Design and implement low-code workflows integrating AI agents with CRM and help-desk platforms.
- Own technical delivery from solution blueprint to production rollout with measurable outcomes.
- Collaborate with Product and Engineering to improve platform capabilities and deployment quality.
- Build reusable integration patterns and operational playbooks for scalable customer onboarding.
`.trim();

    const baseBullets = [
      "Built reusable integration workflows with CRM platforms.",
      "Implemented production rollout checklists for customer deployments.",
    ];
    const coverage = computeTop3Coverage(description, baseBullets);

    expect(coverage.topResponsibilities).toHaveLength(3);
    expect(coverage.topResponsibilities.join(" ")).not.toMatch(/unicorn|headquartered|offices/i);
    expect(coverage.topResponsibilities.join(" ")).toMatch(/design and implement|own technical delivery/i);
    expect(coverage.fallbackResponsibilities.join(" ")).not.toMatch(/unicorn|headquartered|offices/i);
  });

  it("prefers action-oriented responsibility bullets over long narrative lines", () => {
    const description = `
Aircall is customer-obsessed and data-driven with rapid global growth.
Our mission is to help teams work smarter, not harder, across markets worldwide.

What you'll do:
- Build API integrations with CRMs and ticketing tools.
- Automate deployment workflows and monitor quality signals.
- Lead cross-functional implementation projects with customer success.
`.trim();

    const coverage = computeTop3Coverage(description, []);

    expect(coverage.topResponsibilities).toEqual([
      "Build API integrations with CRMs and ticketing tools.",
      "Automate deployment workflows and monitor quality signals.",
      "Lead cross-functional implementation projects with customer success.",
    ]);
  });
});
