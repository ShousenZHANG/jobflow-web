import { beforeEach, describe, expect, it, vi } from "vitest";

const prisma = vi.hoisted(() => ({
  application: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/server/prisma", () => ({ prisma }));
vi.mock("@/auth", () => ({ authOptions: {} }));
vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));

import { getServerSession } from "next-auth/next";
import { POST } from "@/app/api/applications/[id]/discard/route";
import {
  AI_CONTENT_SCHEMA_VERSION,
  type AiContent,
} from "@/lib/shared/schemas/aiContent";

const APP_ID = "33333333-3333-4333-9333-333333333333";
const USER_ID = "user-1";

function makeEditedAiContent(): AiContent {
  return {
    schemaVersion: AI_CONTENT_SCHEMA_VERSION,
    generatedAt: "2026-05-09T00:00:00.000Z",
    promptMetaHash: "p1",
    cv: {
      summary: {
        aiText: "ai",
        originalText: "orig",
        userEdit: "user override",
        accepted: false,
      },
      latestExperience: {
        experienceIndex: 0,
        addedBullets: [
          {
            text: "passed bullet",
            userEdit: "edited user text",
            accepted: false,
            qualityGate: { passed: true },
          },
          {
            text: "rejected bullet",
            accepted: true,
            qualityGate: { passed: false, reason: "ungrounded: no JD evidence" },
          },
        ],
      },
      skillsAdditions: [
        { label: "Backend", items: ["Spring"], accepted: false },
      ],
    },
    cover: {
      paragraphOne: { aiText: "p1", userEdit: "edited", accepted: false },
      paragraphTwo: { aiText: "p2", accepted: true },
      paragraphThree: { aiText: "p3", accepted: true },
    },
  };
}

const params = Promise.resolve({ id: APP_ID });
const request = () =>
  new Request(`http://localhost/api/applications/${APP_ID}/discard`, {
    method: "POST",
  });

describe("POST /api/applications/[id]/discard", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    prisma.application.findFirst.mockReset();
    prisma.application.update.mockReset();
  });

  it("clears userEdits and resets bullet accepted to qualityGate.passed", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: USER_ID },
    });
    prisma.application.findFirst.mockResolvedValueOnce({
      id: APP_ID,
      userId: USER_ID,
      aiContent: makeEditedAiContent(),
    });
    prisma.application.update.mockImplementationOnce((args) => Promise.resolve(args));

    const res = await POST(request(), { params });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe("DRAFT");

    const updateCall = prisma.application.update.mock.calls[0]?.[0];
    const persisted = updateCall.data.aiContent as AiContent;

    // Summary: userEdit cleared, accepted back to true
    expect(persisted.cv.summary.userEdit).toBeUndefined();
    expect(persisted.cv.summary.accepted).toBe(true);

    // Bullet 1 (passed gate): userEdit cleared, accepted=true
    expect(persisted.cv.latestExperience.addedBullets[0]?.userEdit).toBeUndefined();
    expect(persisted.cv.latestExperience.addedBullets[0]?.accepted).toBe(true);

    // Bullet 2 (failed gate): accepted=false (matches gate verdict)
    expect(persisted.cv.latestExperience.addedBullets[1]?.accepted).toBe(false);

    // Skills: accepted reset to true
    expect(persisted.cv.skillsAdditions[0]?.accepted).toBe(true);

    // Cover paragraphs: userEdit cleared, accepted=true
    expect(persisted.cover.paragraphOne.userEdit).toBeUndefined();
    expect(persisted.cover.paragraphOne.accepted).toBe(true);

    expect(updateCall.data.status).toBe("DRAFT");
  });

  it("returns 400 when there is no aiContent to discard", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: USER_ID },
    });
    prisma.application.findFirst.mockResolvedValueOnce({
      id: APP_ID,
      userId: USER_ID,
      aiContent: null,
    });

    const res = await POST(request(), { params });
    expect(res.status).toBe(400);
  });

  it("returns 404 when the Application is not found", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: USER_ID },
    });
    prisma.application.findFirst.mockResolvedValueOnce(null);

    const res = await POST(request(), { params });
    expect(res.status).toBe(404);
  });

  it("returns 401 when unauthenticated", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const res = await POST(request(), { params });
    expect(res.status).toBe(401);
  });
});
