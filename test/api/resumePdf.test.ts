import { beforeEach, describe, expect, it, vi } from "vitest";

const resumeProfileStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

const activeResumeProfileStore = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    resumeProfile: resumeProfileStore,
    activeResumeProfile: activeResumeProfileStore,
  },
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/server/latex/renderResume", () => ({
  renderResumeTex: vi.fn(() => "\\documentclass{article}"),
}));

import { getServerSession } from "next-auth/next";
import { POST } from "@/app/api/resume-pdf/route";

const mockPdf = new Uint8Array([37, 80, 68, 70]);

describe("resume pdf api", () => {
  beforeEach(() => {
    resumeProfileStore.findFirst.mockReset();
    activeResumeProfileStore.findUnique.mockReset();
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    vi.stubGlobal("fetch", vi.fn());
    process.env.LATEX_RENDER_URL = "https://latex.example.com/compile";
    process.env.LATEX_RENDER_TOKEN = "test-token";
  });

  it("returns 404 when profile is missing", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    activeResumeProfileStore.findUnique.mockResolvedValueOnce(null);
    resumeProfileStore.findFirst.mockResolvedValueOnce(null);

    const res = await POST(new Request("http://localhost/api/resume-pdf"));
    expect(res.status).toBe(404);
  });

  it("returns a pdf download when profile exists", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    activeResumeProfileStore.findUnique.mockResolvedValueOnce({ resumeProfileId: "rp-1" });
    resumeProfileStore.findFirst.mockResolvedValueOnce({
      id: "rp-1",
      userId: "user-1",
      summary: "Hi",
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
          location: "Sydney",
          dates: "2023-2025",
          title: "Engineer",
          company: "Example Co",
          bullets: ["Built"],
        },
      ],
      projects: [],
      education: [],
      skills: [{ category: "Languages", items: ["TypeScript"] }],
    });

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => mockPdf.buffer,
      headers: new Headers({ "content-type": "application/pdf" }),
    });

    const res = await POST(new Request("http://localhost/api/resume-pdf"));

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toMatch(/attachment/);
  });
});
