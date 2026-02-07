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
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";
import { renderResumeTex } from "@/lib/server/latex/renderResume";
import { POST } from "@/app/api/applications/manual-generate/route";

const VALID_JOB_ID = "550e8400-e29b-41d4-a716-446655440000";
const VALID_OUTPUT = JSON.stringify({
  cvSummary: "Tailored summary",
  latestExperience: {
    bullets: ["base bullet one"],
  },
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
    (mapResumeProfile as unknown as ReturnType<typeof vi.fn>).mockReset();
    (renderResumeTex as unknown as ReturnType<typeof vi.fn>).mockReset();
    (mapResumeProfile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
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
    });
    (renderResumeTex as unknown as ReturnType<typeof vi.fn>).mockReturnValue("\\documentclass{article}");
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

  it("applies latest experience bullets and full skillsFinal for resume target", async () => {
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

    (mapResumeProfile as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      candidate: {
        name: "Jane Doe",
        title: "Software Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
      },
      summary: "Base summary",
      skills: [{ label: "Backend", items: ["Java"] }],
      experiences: [
        {
          location: "Sydney, AU",
          dates: "2022-2023",
          title: "Engineer",
          company: "Example",
          bullets: ["old-1", "old-2"],
        },
      ],
      projects: [],
      education: [],
    });

    const resumePatch = JSON.stringify({
      cvSummary: "Tailored summary",
      latestExperience: {
        bullets: ["old-2", "old-1", "new-1"],
      },
      skillsFinal: [
        { label: "Backend", items: ["Java", "Spring Boot"] },
        { label: "Cloud", items: ["GCP"] },
      ],
    });

    const res = await POST(
      new Request("http://localhost/api/applications/manual-generate", {
        method: "POST",
        body: JSON.stringify({
          jobId: VALID_JOB_ID,
          target: "resume",
          modelOutput: resumePatch,
          promptMeta: {
            ruleSetId: "rules-1",
            resumeSnapshotUpdatedAt: "2026-02-06T00:00:00.000Z",
          },
        }),
      }),
    );

    expect(res.status).toBe(200);
    const renderCallArg = (renderResumeTex as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(renderCallArg.summary).toBe("Tailored summary");
    expect(renderCallArg.experiences[0].bullets).toEqual(["old-2", "old-1", "new-1"]);
    expect(renderCallArg.skills).toEqual([
      { label: "Backend", items: ["Java", "Spring Boot"] },
      { label: "Cloud", items: ["GCP"] },
    ]);
  });

  it("allows resume import even when top responsibilities are not fully covered", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    jobStore.findFirst.mockResolvedValueOnce({
      id: VALID_JOB_ID,
      title: "Software Engineer",
      company: "Example Co",
      description: "Design and build scalable backend services and CI/CD pipelines for cloud platform delivery.",
    });
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "rp-1",
      updatedAt: new Date("2026-02-06T00:00:00.000Z"),
    });

    (mapResumeProfile as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      candidate: {
        name: "Jane Doe",
        title: "Software Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
      },
      summary: "Base summary",
      skills: [],
      experiences: [
        {
          location: "Sydney, AU",
          dates: "2022-2023",
          title: "Engineer",
          company: "Example",
          bullets: ["old-1", "old-2"],
        },
      ],
      projects: [],
      education: [],
    });

    const importedPatch = JSON.stringify({
      cvSummary: "Tailored summary",
      latestExperience: {
        bullets: ["old-1 rewritten", "old-2"],
      },
    });

    const res = await POST(
      new Request("http://localhost/api/applications/manual-generate", {
        method: "POST",
        body: JSON.stringify({
          jobId: VALID_JOB_ID,
          target: "resume",
          modelOutput: importedPatch,
          promptMeta: {
            ruleSetId: "rules-1",
            resumeSnapshotUpdatedAt: "2026-02-06T00:00:00.000Z",
          },
        }),
      }),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
  });

  it("accepts markdown-only formatting differences in existing bullets", async () => {
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

    (mapResumeProfile as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      candidate: {
        name: "Jane Doe",
        title: "Software Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
      },
      summary: "Base summary",
      skills: [],
      experiences: [
        {
          location: "Sydney, AU",
          dates: "2022-2023",
          title: "Engineer",
          company: "Example",
          bullets: ["Delivered repeatable releases with Docker and Linux CI/CD pipelines."],
        },
      ],
      projects: [],
      education: [],
    });

    const formattingOnlyPatch = JSON.stringify({
      cvSummary: "Tailored summary",
      latestExperience: {
        bullets: ["Delivered repeatable releases with **Docker **and **Linux** CI/CD pipelines."],
      },
    });

    const res = await POST(
      new Request("http://localhost/api/applications/manual-generate", {
        method: "POST",
        body: JSON.stringify({
          jobId: VALID_JOB_ID,
          target: "resume",
          modelOutput: formattingOnlyPatch,
          promptMeta: {
            ruleSetId: "rules-1",
            resumeSnapshotUpdatedAt: "2026-02-06T00:00:00.000Z",
          },
        }),
      }),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
  });

  it("uses AI-provided markdown bold in summary and new bullets for latex rendering", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    jobStore.findFirst.mockResolvedValueOnce({
      id: VALID_JOB_ID,
      title: "Software Engineer",
      company: "Example Co",
      description: "Build Java services with CI/CD and Docker",
    });
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "rp-1",
      updatedAt: new Date("2026-02-06T00:00:00.000Z"),
    });
    applicationStore.upsert.mockResolvedValueOnce({ id: "app-1" });

    (mapResumeProfile as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      candidate: {
        name: "Jane Doe",
        title: "Software Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
      },
      summary: "Base summary",
      skills: [],
      experiences: [
        {
          location: "Sydney, AU",
          dates: "2022-2023",
          title: "Engineer",
          company: "Example",
          bullets: ["base bullet"],
        },
      ],
      projects: [],
      education: [],
    });

    const patch = JSON.stringify({
      cvSummary: "Focused on **Java** delivery with reliable pipelines.",
      latestExperience: {
        bullets: ["base bullet", "Built **Docker** deployment pipeline."],
      },
    });

    const res = await POST(
      new Request("http://localhost/api/applications/manual-generate", {
        method: "POST",
        body: JSON.stringify({
          jobId: VALID_JOB_ID,
          target: "resume",
          modelOutput: patch,
          promptMeta: {
            ruleSetId: "rules-1",
            resumeSnapshotUpdatedAt: "2026-02-06T00:00:00.000Z",
          },
        }),
      }),
    );

    expect(res.status).toBe(200);
    const renderCallArg = (renderResumeTex as unknown as ReturnType<typeof vi.fn>).mock.calls.at(-1)?.[0];
    expect(renderCallArg.summary).toContain("\\textbf{Java}");
    expect(renderCallArg.experiences[0].bullets[1]).toContain("\\textbf{Docker}");
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
