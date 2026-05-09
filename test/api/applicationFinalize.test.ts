import { beforeEach, describe, expect, it, vi } from "vitest";

const prisma = vi.hoisted(() => ({
  application: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
}));
const renderer = vi.hoisted(() => ({
  renderFinalApplication: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({ prisma }));
vi.mock("@/lib/server/applications/finalizeApplication", () => renderer);
vi.mock("@/auth", () => ({ authOptions: {} }));
vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));

import { getServerSession } from "next-auth/next";
import { POST } from "@/app/api/applications/[id]/finalize/route";
import {
  AI_CONTENT_SCHEMA_VERSION,
  hashAiContent,
  type AiContent,
} from "@/lib/shared/schemas/aiContent";

const APP_ID = "22222222-2222-4222-9222-222222222222";
const USER_ID = "user-1";

function makeAiContent(): AiContent {
  return {
    schemaVersion: AI_CONTENT_SCHEMA_VERSION,
    generatedAt: "2026-05-09T00:00:00.000Z",
    promptMetaHash: "p1",
    cv: {
      summary: { aiText: "ai", originalText: "orig", accepted: true },
      latestExperience: { experienceIndex: 0, addedBullets: [] },
      skillsAdditions: [],
    },
    cover: {
      paragraphOne: { aiText: "", accepted: false },
      paragraphTwo: { aiText: "", accepted: false },
      paragraphThree: { aiText: "", accepted: false },
    },
  };
}

function makeRequest(body: unknown) {
  return new Request(`http://localhost/api/applications/${APP_ID}/finalize`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

const params = Promise.resolve({ id: APP_ID });

describe("POST /api/applications/[id]/finalize", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    prisma.application.findFirst.mockReset();
    prisma.application.update.mockReset();
    renderer.renderFinalApplication.mockReset();
  });

  it("renders PDF, flips status to FINAL, returns the new resumePdfUrl", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: USER_ID },
    });
    const ai = makeAiContent();
    const hash = hashAiContent(ai);
    prisma.application.findFirst.mockResolvedValueOnce({
      id: APP_ID,
      userId: USER_ID,
      aiContent: ai,
      aiContentHash: hash,
    });
    renderer.renderFinalApplication.mockResolvedValueOnce({
      resumePdfUrl: "https://blob/r.pdf",
      resumePdfName: "r.pdf",
    });
    prisma.application.update.mockResolvedValueOnce({});

    const res = await POST(makeRequest({ expectedHash: hash }), { params });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe("FINAL");
    expect(json.resumePdfUrl).toBe("https://blob/r.pdf");
    expect(prisma.application.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: APP_ID },
        data: expect.objectContaining({
          status: "FINAL",
          resumePdfUrl: "https://blob/r.pdf",
        }),
      }),
    );
  });

  it("returns 409 on stale expectedHash", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: USER_ID },
    });
    prisma.application.findFirst.mockResolvedValueOnce({
      id: APP_ID,
      userId: USER_ID,
      aiContent: makeAiContent(),
      aiContentHash: "actual",
    });

    const res = await POST(makeRequest({ expectedHash: "stale" }), { params });

    expect(res.status).toBe(409);
    expect(renderer.renderFinalApplication).not.toHaveBeenCalled();
    expect(prisma.application.update).not.toHaveBeenCalled();
  });

  it("returns 400 when the Application has no aiContent (legacy row)", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: USER_ID },
    });
    prisma.application.findFirst.mockResolvedValueOnce({
      id: APP_ID,
      userId: USER_ID,
      aiContent: null,
      aiContentHash: null,
    });

    const res = await POST(makeRequest({ expectedHash: null }), { params });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.code).toBe("NO_AI_CONTENT");
  });

  it("returns 404 when the Application belongs to another user", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: USER_ID },
    });
    prisma.application.findFirst.mockResolvedValueOnce(null);

    const res = await POST(makeRequest({ expectedHash: null }), { params });
    expect(res.status).toBe(404);
  });

  it("returns 401 when unauthenticated", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const res = await POST(makeRequest({ expectedHash: null }), { params });
    expect(res.status).toBe(401);
  });
});
