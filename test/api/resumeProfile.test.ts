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

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { GET, POST } from "@/app/api/resume-profile/route";

describe("resume profile api", () => {
  beforeEach(() => {
    resumeProfileStore.findFirst.mockReset();
    resumeProfileStore.create.mockReset();
    resumeProfileStore.update.mockReset();
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  it("returns empty profile for new user", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    resumeProfileStore.findFirst.mockResolvedValueOnce(null);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.profile).toBeNull();
  });

  it("upserts profile on POST", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    resumeProfileStore.findFirst.mockResolvedValueOnce(null);
    resumeProfileStore.create.mockResolvedValueOnce({
      id: "rp-1",
      userId: "user-1",
      summary: "Hello",
    });

    const payload = {
      summary: "Hello",
      basics: {
        fullName: "Jane Doe",
        title: "Software Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
        location: "Sydney",
      },
      links: [{ label: "LinkedIn", url: "https://linkedin.com/in/jane" }],
      experiences: [
        {
          location: "Sydney, Australia",
          dates: "2023-2025",
          title: "Software Engineer",
          company: "Example Co",
          bullets: ["Built features"],
        },
      ],
      projects: [
        {
          name: "Jobflow",
          dates: "2024",
          link: "https://example.com",
          summary: "",
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
      skills: [{ category: "Languages", items: ["TypeScript", "Python"] }],
    };

    const res = await POST(
      new Request("http://localhost/api/resume-profile", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.profile.summary).toBe("Hello");
    expect(resumeProfileStore.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        ...payload,
      },
    });
  });
});
