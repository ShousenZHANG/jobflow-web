import { describe, expect, it } from "vitest";
import { renderResumeTex } from "@/lib/server/latex/renderResume";

describe("renderResumeTex", () => {
  it("replaces summary, skills, and bullets placeholders", () => {
    const output = renderResumeTex({
      candidate: {
        name: "Jane Doe",
        title: "Software Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
        linkedinUrl: "https://linkedin.com/in/jane",
        linkedinText: "linkedin.com/in/jane",
      },
      summary: "Focused engineer.",
      skills: [
        { label: "Frontend", items: ["React", "TypeScript"] },
        { label: "Backend", items: ["Node.js"] },
      ],
      experiences: [
        {
          location: "Sydney, Australia",
          dates: "2023-2025",
          title: "Software Engineer",
          company: "Example Co",
          bullets: ["Delivered features", "Improved performance"],
        },
      ],
      projects: [
        {
          name: "Jobflow",
          location: "Sydney, Australia",
          dates: "2024",
          stack: "Next.js, TypeScript",
          links: [{ label: "GitHub", url: "https://github.com/example" }],
          bullets: ["Shipped features"],
        },
      ],
      education: [
        {
          location: "Sydney",
          dates: "2023-2025",
          schoolDegree: "UNSW - MIT",
          detail: "WAM 80",
        },
        {
          location: "Jiangsu",
          dates: "2016-2020",
          schoolDegree: "JUST - BE",
        },
      ],
    });

    expect(output).toContain("Focused engineer.");
    expect(output).toContain("\\item Delivered features");
    expect(output).toContain("Frontend");
    expect(output).toContain("React, TypeScript");
    expect(output).toContain("Jobflow");
    expect(output).toContain("Jane Doe");
    expect(output).toContain("Example Co");
  });
});
