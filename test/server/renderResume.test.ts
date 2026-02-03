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
      education: {
        edu1Location: "Sydney",
        edu1Dates: "2023-2025",
        edu1SchoolDegree: "UNSW - MIT",
        edu1Detail: "WAM 80",
        edu2Location: "Jiangsu",
        edu2Dates: "2016-2020",
        edu2SchoolDegree: "JUST - BE",
      },
      openSourceProjects: "\\textbf{Project A}",
    });

    expect(output).toContain("Focused engineer.");
    expect(output).toContain("\\item Delivered features");
    expect(output).toContain("Frontend");
    expect(output).toContain("React, TypeScript");
    expect(output).toContain("Project A");
    expect(output).toContain("Jane Doe");
    expect(output).toContain("Example Co");
  });
});
