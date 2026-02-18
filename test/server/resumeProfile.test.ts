import { beforeEach, describe, expect, it, vi } from "vitest";

const resumeProfileStore = vi.hoisted(() => ({
  findUnique: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    resumeProfile: resumeProfileStore,
  },
}));

import { getResumeProfile, upsertResumeProfile } from "@/lib/server/resumeProfile";

describe("resumeProfile data access", () => {
  beforeEach(() => {
    resumeProfileStore.findUnique.mockReset();
    resumeProfileStore.upsert.mockReset();
  });

  it("upserts and fetches resume profile", async () => {
    resumeProfileStore.upsert.mockResolvedValueOnce({
      id: "rp-1",
      userId: "user-1",
      summary: "A",
      basics: {
        fullName: "Jane Doe",
        title: "Software Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
        location: "Sydney",
      },
      links: [{ label: "LinkedIn", url: "https://linkedin.com/in/jane" }],
      skills: [{ category: "Languages", items: ["TypeScript", "Python"] }],
      experiences: [
        {
          location: "Sydney",
          dates: "2023-2025",
          title: "Engineer",
          company: "Example Co",
          bullets: ["Built features"],
        },
      ],
      projects: [
        {
          name: "Jobflow",
          location: "Sydney, Australia",
          dates: "2024",
          stack: "Next.js, TypeScript",
          links: [{ label: "GitHub", url: "https://example.com" }],
          bullets: ["Shipped"],
        },
      ],
      education: [
        {
          school: "UNSW",
          degree: "MIT",
          location: "Sydney",
          dates: "2020-2022",
          details: "WAM 80",
        },
      ],
    });

    const basics = {
      fullName: "Jane Doe",
      title: "Software Engineer",
      email: "jane@example.com",
      phone: "+1 555 0100",
      location: "Sydney",
    };
    const links = [{ label: "LinkedIn", url: "https://linkedin.com/in/jane" }];
    const experiences = [
      {
        location: "Sydney",
        dates: "2023-2025",
        title: "Engineer",
        company: "Example Co",
        bullets: ["Built features"],
      },
    ];
    const projects = [
      {
        name: "Jobflow",
        location: "Sydney, Australia",
        dates: "2024",
        stack: "Next.js, TypeScript",
        links: [{ label: "GitHub", url: "https://example.com" }],
        bullets: ["Shipped"],
      },
    ];
    const education = [
      {
        school: "UNSW",
        degree: "MIT",
        location: "Sydney",
        dates: "2020-2022",
        details: "WAM 80",
      },
    ];
    const skills = [{ category: "Languages", items: ["TypeScript", "Python"] }];

    const created = await upsertResumeProfile("user-1", {
      summary: "A",
      basics,
      links,
      skills,
      experiences,
      projects,
      education,
    });

    expect(resumeProfileStore.upsert).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      update: {
        summary: "A",
        basics,
        links,
        skills,
        experiences,
        projects,
        education,
      },
      create: {
        userId: "user-1",
        summary: "A",
        basics,
        links,
        skills,
        experiences,
        projects,
        education,
      },
    });
    expect(created.summary).toBe("A");

    resumeProfileStore.findUnique.mockResolvedValueOnce({
      id: "rp-1",
      userId: "user-1",
      summary: "A",
      basics,
      links,
      skills,
      experiences,
      projects,
      education,
    });

    const fetched = await getResumeProfile("user-1");
    expect(fetched?.summary).toBe("A");
  });

  it("updates when a profile already exists", async () => {
    resumeProfileStore.upsert.mockResolvedValueOnce({
      id: "rp-2",
      userId: "user-2",
      summary: "New",
    });

    const updated = await upsertResumeProfile("user-2", { summary: "New" });

    expect(resumeProfileStore.upsert).toHaveBeenCalledWith({
      where: { userId: "user-2" },
      update: { summary: "New" },
      create: {
        userId: "user-2",
        summary: "New",
      },
    });
    expect(updated.summary).toBe("New");
  });
});
