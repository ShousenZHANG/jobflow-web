import { beforeEach, describe, expect, it, vi } from "vitest";

const jobStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

const applicationStore = vi.hoisted(() => ({
  upsert: vi.fn(),
}));

const aiPromptProfileStore = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

const aiProviderStore = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    job: jobStore,
    application: applicationStore,
    aiPromptProfile: aiPromptProfileStore,
    userAiProviderConfig: aiProviderStore,
    resumeProfile: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/server/resumeProfile", () => ({
  getResumeProfile: vi.fn(),
}));

vi.mock("@/lib/server/latex/mapResumeProfile", () => ({
  mapResumeProfile: vi.fn(() => ({
    candidate: {
      name: "Jane Doe",
      title: "Software Engineer",
      email: "jane@example.com",
      phone: "+1 555 0100",
    },
    summary: "Summary",
    skills: [],
    experiences: [],
    projects: [],
    education: [],
  })),
}));

vi.mock("@/lib/server/latex/renderResume", () => ({
  renderResumeTex: vi.fn(() => "\\documentclass{article}"),
}));

vi.mock("@/lib/server/latex/compilePdf", () => ({
  LatexRenderError: class LatexRenderError extends Error {
    constructor(
      public code: string,
      public status: number,
      message: string,
      public details?: unknown,
    ) {
      super(message);
    }
  },
  compileLatexToPdf: vi.fn(async () => Buffer.from([37, 80, 68, 70])),
}));

import { getServerSession } from "next-auth/next";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { POST } from "@/app/api/applications/generate/route";

const VALID_JOB_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("applications generate api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockReset();
    jobStore.findFirst.mockReset();
    applicationStore.upsert.mockReset();
    aiPromptProfileStore.findUnique.mockReset();
    aiProviderStore.findUnique.mockReset();
  });

  it("returns 404 when job does not exist", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    jobStore.findFirst.mockResolvedValueOnce(null);

    const res = await POST(
      new Request("http://localhost/api/applications/generate", {
        method: "POST",
        body: JSON.stringify({ jobId: VALID_JOB_ID }),
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error.code).toBe("JOB_NOT_FOUND");
  });

  it("generates a resume pdf and upserts application", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    jobStore.findFirst.mockResolvedValueOnce({
      id: VALID_JOB_ID,
      title: "Software Engineer",
      company: "Example Co",
    });
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "rp-1",
      userId: "user-1",
      basics: {
        fullName: "Jane Doe",
        title: "Software Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
      },
      summary: "Summary",
      skills: [],
      experiences: [],
      projects: [],
      education: [],
    });
    applicationStore.upsert.mockResolvedValueOnce({
      id: "app-1",
    });

    const res = await POST(
      new Request("http://localhost/api/applications/generate", {
        method: "POST",
        body: JSON.stringify({ jobId: VALID_JOB_ID }),
      }),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("x-application-id")).toBe("app-1");
    expect(applicationStore.upsert).toHaveBeenCalled();
  });
});
