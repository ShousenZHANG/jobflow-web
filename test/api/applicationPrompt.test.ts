import { beforeEach, describe, expect, it, vi } from "vitest";

const jobStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    job: jobStore,
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

vi.mock("@/lib/server/promptRuleTemplates", () => ({
  getActivePromptSkillRulesForUser: vi.fn(() => ({
    id: "rules-1",
    locale: "en-AU",
    cvRules: ["cv-rule"],
    coverRules: ["cover-rule"],
    hardConstraints: ["json-only"],
  })),
}));

import { getServerSession } from "next-auth/next";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { POST } from "@/app/api/applications/prompt/route";

const VALID_JOB_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("applications prompt api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockReset();
    jobStore.findFirst.mockReset();
  });

  it("returns 404 when job does not exist", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    jobStore.findFirst.mockResolvedValueOnce(null);

    const res = await POST(
      new Request("http://localhost/api/applications/prompt", {
        method: "POST",
        body: JSON.stringify({ jobId: VALID_JOB_ID, target: "resume" }),
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error.code).toBe("JOB_NOT_FOUND");
  });

  it("returns resume-target prompt payload", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    jobStore.findFirst.mockResolvedValueOnce({
      title: "Software Engineer",
      company: "Example Co",
      description: "Build product features",
    });
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "rp-1",
      updatedAt: new Date("2026-02-06T00:00:00.000Z"),
    });

    const res = await POST(
      new Request("http://localhost/api/applications/prompt", {
        method: "POST",
        body: JSON.stringify({ jobId: VALID_JOB_ID, target: "resume" }),
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(typeof json.prompt.systemPrompt).toBe("string");
    expect(typeof json.prompt.userPrompt).toBe("string");
    expect(json.expectedJsonShape.cvSummary).toBe("string");
    expect(json.expectedJsonShape.cover).toBeUndefined();
    expect(json.promptMeta.ruleSetId).toBe("rules-1");
    expect(json.promptMeta.resumeSnapshotUpdatedAt).toBe("2026-02-06T00:00:00.000Z");
    expect(json.prompt.userPrompt).not.toContain("Base summary");
  });

  it("returns cover-target prompt payload", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    jobStore.findFirst.mockResolvedValueOnce({
      title: "Software Engineer",
      company: "Example Co",
      description: "Build product features",
    });
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "rp-1",
      updatedAt: new Date("2026-02-06T00:00:00.000Z"),
    });

    const res = await POST(
      new Request("http://localhost/api/applications/prompt", {
        method: "POST",
        body: JSON.stringify({ jobId: VALID_JOB_ID, target: "cover" }),
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.expectedJsonShape.cvSummary).toBeUndefined();
    expect(json.expectedJsonShape.cover.paragraphOne).toBe("string");
  });
});
