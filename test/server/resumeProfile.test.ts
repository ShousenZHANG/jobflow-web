import { beforeEach, describe, expect, it, vi } from "vitest";

const resumeProfileStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    resumeProfile: resumeProfileStore,
  },
}));

import { getResumeProfile, upsertResumeProfile } from "@/lib/server/resumeProfile";

describe("resumeProfile data access", () => {
  beforeEach(() => {
    resumeProfileStore.findFirst.mockReset();
    resumeProfileStore.create.mockReset();
    resumeProfileStore.update.mockReset();
  });

  it("upserts and fetches resume profile", async () => {
    resumeProfileStore.findFirst.mockResolvedValueOnce(null);
    resumeProfileStore.create.mockResolvedValueOnce({
      id: "rp-1",
      userId: "user-1",
      summary: "A",
      skills: ["React"],
      experiences: [
        {
          location: "Sydney",
          dates: "2023-2025",
          title: "Engineer",
          company: "Example Co",
          bullets: ["Built features"],
        },
      ],
    });

    const experiences = [
      {
        location: "Sydney",
        dates: "2023-2025",
        title: "Engineer",
        company: "Example Co",
        bullets: ["Built features"],
      },
    ];

    const created = await upsertResumeProfile("user-1", {
      summary: "A",
      skills: ["React"],
      experiences,
    });

    expect(resumeProfileStore.create).toHaveBeenCalledWith({
      data: { userId: "user-1", summary: "A", skills: ["React"], experiences },
    });
    expect(created.summary).toBe("A");

    resumeProfileStore.findFirst.mockResolvedValueOnce({
      id: "rp-1",
      userId: "user-1",
      summary: "A",
      skills: ["React"],
      experiences,
    });

    const fetched = await getResumeProfile("user-1");
    expect(fetched?.summary).toBe("A");
  });

  it("updates when a profile already exists", async () => {
    resumeProfileStore.findFirst.mockResolvedValueOnce({
      id: "rp-2",
      userId: "user-2",
      summary: "Old",
    });
    resumeProfileStore.update.mockResolvedValueOnce({
      id: "rp-2",
      userId: "user-2",
      summary: "New",
    });

    const updated = await upsertResumeProfile("user-2", { summary: "New" });

    expect(resumeProfileStore.update).toHaveBeenCalledWith({
      where: { id: "rp-2" },
      data: { summary: "New" },
    });
    expect(updated.summary).toBe("New");
  });
});
