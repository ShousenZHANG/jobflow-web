import { describe, expect, it } from "vitest";
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";

describe("mapResumeProfile", () => {
  it("does not duplicate a single LinkedIn link into website", () => {
    const mapped = mapResumeProfile({
      basics: {
        fullName: "Zetphy Deng",
        title: "Full Stack Software Engineer",
        email: "de4rank@gmail.com",
        phone: "0493 705 901",
      },
      links: [{ label: "LinkedIn", url: "https://www.linkedin.com/in/example/" }],
      summary: "",
      skills: [],
      experiences: [],
      projects: [],
      education: [],
    });

    expect(mapped.candidate.linkedinUrl).toContain("linkedin.com");
    expect(mapped.candidate.linkedinText).toBe("LinkedIn");
    expect(mapped.candidate.websiteUrl).toBeUndefined();
    expect(mapped.candidate.websiteText).toBeUndefined();
  });

  it("uses the first non-linkedin/github link as website fallback when present", () => {
    const mapped = mapResumeProfile({
      basics: {
        fullName: "Jane Doe",
        title: "Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
      },
      links: [
        { label: "LinkedIn", url: "https://linkedin.com/in/jane" },
        { label: "GitHub", url: "https://github.com/jane" },
        { label: "Portfolio", url: "https://jane.dev" },
      ],
      summary: "",
      skills: [],
      experiences: [],
      projects: [],
      education: [],
    });

    expect(mapped.candidate.linkedinUrl).toContain("linkedin.com");
    expect(mapped.candidate.githubUrl).toContain("github.com");
    expect(mapped.candidate.websiteUrl).toBe("https://jane.dev");
    expect(mapped.candidate.websiteText).toBe("Portfolio");
  });

  it("maps experience links and caps to 2", () => {
    const mapped = mapResumeProfile({
      basics: {
        fullName: "Jane Doe",
        title: "Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
      },
      links: [],
      summary: "",
      skills: [],
      experiences: [
        {
          location: "Sydney",
          dates: "2024",
          title: "Builder",
          company: "Jobflow",
          links: [
            { label: "GitHub", url: "https://github.com/example/jobflow" },
            { label: "Demo", url: "https://jobflow-web.vercel.app" },
            { label: "Docs", url: "https://docs.example.com" },
          ],
          bullets: ["Built"],
        },
      ],
      projects: [],
      education: [],
    });

    expect(mapped.experiences[0]?.links).toEqual([
      { label: "GitHub", url: "https://github.com/example/jobflow" },
      { label: "Demo", url: "https://jobflow-web.vercel.app" },
    ]);
  });
});

