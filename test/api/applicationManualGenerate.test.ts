import { beforeEach, describe, expect, it, vi } from "vitest";

const jobStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

const applicationStore = vi.hoisted(() => ({
  upsert: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    job: jobStore,
    application: applicationStore,
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
      linkedinUrl: "https://linkedin.com/in/jane",
      linkedinText: "linkedin.com/in/jane",
    },
    summary: "Base summary",
    skills: [],
    experiences: [],
    projects: [],
    education: [],
  })),
}));

vi.mock("@/lib/server/latex/renderResume", () => ({
  renderResumeTex: vi.fn(() => "\\documentclass{article}"),
}));

vi.mock("@/lib/server/latex/renderCoverLetter", () => ({
  renderCoverLetterTex: vi.fn(() => "\\documentclass{article}"),
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

vi.mock("@/lib/server/promptRuleTemplates", () => ({
  getActivePromptSkillRulesForUser: vi.fn(async () => ({
    id: "rules-1",
    locale: "en-AU",
    cvRules: ["cv-rule"],
    coverRules: ["cover-rule"],
    hardConstraints: ["json-only"],
  })),
}));

import { getServerSession } from "next-auth/next";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { POST } from "@/app/api/applications/manual-generate/route";

const VALID_JOB_ID = "550e8400-e29b-41d4-a716-446655440000";
const VALID_OUTPUT = JSON.stringify({
  cvSummary: "Tailored summary",
  cover: {
    paragraphOne: "One",
    paragraphTwo: "Two",
    paragraphThree: "Three",
  },
});

describe("applications manual generate api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockReset();
    jobStore.findFirst.mockReset();
    applicationStore.upsert.mockReset();
  });

  it("returns parse error for invalid model output", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    jobStore.findFirst.mockResolvedValueOnce({
      id: VALID_JOB_ID,
      title: "Software Engineer",
      company: "Example Co",
      description: "Build product features",
    });
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: "rp-1" });

    const res = await POST(
      new Request("http://localhost/api/applications/manual-generate", {
        method: "POST",
        body: JSON.stringify({
          jobId: VALID_JOB_ID,
          target: "resume",
          modelOutput: "invalid-output-invalid-output",
        }),
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.code).toBe("PARSE_FAILED");
  });

  it("generates resume pdf from imported JSON", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    jobStore.findFirst.mockResolvedValueOnce({
      id: VALID_JOB_ID,
      title: "Software Engineer",
      company: "Example Co",
      description: "Build product features",
    });
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "rp-1",
      updatedAt: new Date("2026-02-06T00:00:00.000Z"),
    });
    applicationStore.upsert.mockResolvedValueOnce({ id: "app-1" });

    const res = await POST(
      new Request("http://localhost/api/applications/manual-generate", {
        method: "POST",
        body: JSON.stringify({
          jobId: VALID_JOB_ID,
          target: "resume",
          modelOutput: VALID_OUTPUT,
          promptMeta: {
            ruleSetId: "rules-1",
            resumeSnapshotUpdatedAt: "2026-02-06T00:00:00.000Z",
          },
        }),
      }),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("x-tailor-cv-source")).toBe("manual_import");
  });

  it("returns 409 when prompt meta is stale", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    jobStore.findFirst.mockResolvedValueOnce({
      id: VALID_JOB_ID,
      title: "Software Engineer",
      company: "Example Co",
      description: "Build product features",
    });
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "rp-1",
      updatedAt: new Date("2026-02-07T00:00:00.000Z"),
    });

    const res = await POST(
      new Request("http://localhost/api/applications/manual-generate", {
        method: "POST",
        body: JSON.stringify({
          jobId: VALID_JOB_ID,
          target: "resume",
          modelOutput: VALID_OUTPUT,
          promptMeta: {
            ruleSetId: "rules-1",
            resumeSnapshotUpdatedAt: "2026-02-06T00:00:00.000Z",
          },
        }),
      }),
    );
    const json = await res.json();
    expect(res.status).toBe(409);
    expect(json.error.code).toBe("PROMPT_META_MISMATCH");
  });
});
