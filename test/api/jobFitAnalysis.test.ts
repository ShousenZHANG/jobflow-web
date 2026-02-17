import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaStore = vi.hoisted(() => ({
  job: {
    findFirst: vi.fn(),
  },
  promptRuleTemplate: {
    findFirst: vi.fn(),
  },
  jobFitAnalysis: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: prismaStore,
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

import { getServerSession } from "next-auth/next";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { GET, POST } from "@/app/api/jobs/[id]/fit-analysis/route";

const VALID_JOB_ID = "550e8400-e29b-41d4-a716-446655440000";
const VALID_JOB_UPDATED_AT = new Date("2026-02-16T00:00:00.000Z");
const VALID_PROFILE_UPDATED_AT = new Date("2026-02-15T00:00:00.000Z");

describe("job fit analysis api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockReset();
    prismaStore.job.findFirst.mockReset();
    prismaStore.promptRuleTemplate.findFirst.mockReset();
    prismaStore.jobFitAnalysis.findFirst.mockReset();
    prismaStore.jobFitAnalysis.create.mockReset();
    prismaStore.jobFitAnalysis.update.mockReset();
  });

  it("returns 401 when user is not authenticated", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const res = await GET(new Request("http://localhost/api/jobs/x/fit-analysis"), {
      params: Promise.resolve({ id: VALID_JOB_ID }),
    });

    expect(res.status).toBe(401);
  });

  it("returns pending from GET when no cached analysis exists", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    prismaStore.job.findFirst.mockResolvedValueOnce({
      id: VALID_JOB_ID,
      title: "Software Engineer",
      company: "Nine Mile",
      description: "Build backend services using Java and Spring Boot.",
      updatedAt: VALID_JOB_UPDATED_AT,
    });
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "rp-1",
      updatedAt: VALID_PROFILE_UPDATED_AT,
      summary: "Backend engineer with Java and Spring Boot background.",
      skills: [{ category: "Backend", items: ["Java", "Spring Boot", "SQL"] }],
      experiences: [
        {
          title: "Software Engineer",
          company: "Acme",
          bullets: ["Built REST APIs with Java and Spring Boot."],
          dates: "2022-2025",
        },
      ],
    });
    prismaStore.promptRuleTemplate.findFirst.mockResolvedValueOnce({ id: "rules-1", version: 4 });
    prismaStore.jobFitAnalysis.findFirst.mockResolvedValueOnce(null);

    const res = await GET(new Request("http://localhost/api/jobs/x/fit-analysis"), {
      params: Promise.resolve({ id: VALID_JOB_ID }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe("PENDING");
    expect(json.analysis).toBeUndefined();
    expect(json.source).toBe("heuristic");
    expect(json.aiEnhanced).toBe(false);
    expect(json.aiReason).toBe("NOT_COMPUTED");
  });

  it("creates and returns READY analysis from POST when cache miss", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    prismaStore.job.findFirst.mockResolvedValueOnce({
      id: VALID_JOB_ID,
      title: "Software Engineer",
      company: "Nine Mile",
      description:
        "Requirements: 4+ years experience in backend engineering. Must have work rights in Australia. Build APIs with Java, Spring Boot, SQL.",
      updatedAt: VALID_JOB_UPDATED_AT,
    });
    (getResumeProfile as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "rp-1",
      updatedAt: VALID_PROFILE_UPDATED_AT,
      summary: "Backend engineer with Java and Spring Boot.",
      skills: [{ category: "Backend", items: ["Java", "Spring Boot", "SQL"] }],
      experiences: [
        {
          title: "Software Engineer",
          company: "Acme",
          bullets: ["Built backend services with Java and Spring Boot."],
          dates: "2022-2025",
        },
      ],
    });
    prismaStore.promptRuleTemplate.findFirst.mockResolvedValueOnce({ id: "rules-1", version: 4 });
    prismaStore.jobFitAnalysis.findFirst.mockResolvedValueOnce(null);
    prismaStore.jobFitAnalysis.create.mockImplementationOnce(async ({ data }: { data: unknown }) => ({
      id: "fit-1",
      ...((data as Record<string, unknown>) ?? {}),
      createdAt: new Date("2026-02-17T00:00:00.000Z"),
      updatedAt: new Date("2026-02-17T00:00:00.000Z"),
    }));

    const res = await POST(new Request("http://localhost/api/jobs/x/fit-analysis", { method: "POST" }), {
      params: Promise.resolve({ id: VALID_JOB_ID }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe("READY");
    expect(typeof json.analysis.score).toBe("number");
    expect(["PASS", "RISK", "BLOCK"]).toContain(json.analysis.gateStatus);
    expect(Array.isArray(json.analysis.topGaps)).toBe(true);
    expect(["heuristic", "heuristic+gemini"]).toContain(json.source);
    expect(typeof json.aiEnhanced).toBe("boolean");
    expect(prismaStore.jobFitAnalysis.create).toHaveBeenCalledTimes(1);
  });
});
