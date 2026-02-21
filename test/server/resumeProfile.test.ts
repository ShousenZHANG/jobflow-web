import { beforeEach, describe, expect, it, vi } from "vitest";

const resumeProfileStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
  findMany: vi.fn(),
  update: vi.fn(),
  create: vi.fn(),
}));

const activeResumeProfileStore = vi.hoisted(() => ({
  findUnique: vi.fn(),
  upsert: vi.fn(),
}));

const transactionStore = vi.hoisted(() => ({
  run: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    resumeProfile: resumeProfileStore,
    activeResumeProfile: activeResumeProfileStore,
    $transaction: transactionStore.run,
  },
}));

import {
  createResumeProfile,
  getResumeProfile,
  listResumeProfiles,
  setActiveResumeProfile,
  upsertResumeProfile,
} from "@/lib/server/resumeProfile";

describe("resumeProfile data access", () => {
  beforeEach(() => {
    resumeProfileStore.findFirst.mockReset();
    resumeProfileStore.findMany.mockReset();
    resumeProfileStore.update.mockReset();
    resumeProfileStore.create.mockReset();
    activeResumeProfileStore.findUnique.mockReset();
    activeResumeProfileStore.upsert.mockReset();
    transactionStore.run.mockReset();
    transactionStore.run.mockImplementation(async (ops: unknown[]) => Promise.all(ops as Promise<unknown>[]));
  });

  it("returns active profile when pointer exists", async () => {
    activeResumeProfileStore.findUnique.mockResolvedValueOnce({ resumeProfileId: "rp-1" });
    resumeProfileStore.findFirst.mockResolvedValueOnce({
      id: "rp-1",
      userId: "user-1",
      name: "Custom Blank",
    });

    const profile = await getResumeProfile("user-1");

    expect(activeResumeProfileStore.findUnique).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      select: { resumeProfileId: true },
    });
    expect(profile?.id).toBe("rp-1");
  });

  it("falls back to latest profile and backfills active pointer", async () => {
    activeResumeProfileStore.findUnique.mockResolvedValueOnce(null);
    resumeProfileStore.findFirst.mockResolvedValueOnce({
      id: "rp-2",
      userId: "user-1",
      name: "Custom Blank",
    });

    const profile = await getResumeProfile("user-1");

    expect(profile?.id).toBe("rp-2");
    expect(activeResumeProfileStore.upsert).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      update: { resumeProfileId: "rp-2" },
      create: { userId: "user-1", resumeProfileId: "rp-2" },
    });
  });

  it("upserts selected profile and bumps revision", async () => {
    resumeProfileStore.findFirst.mockResolvedValueOnce({
      id: "rp-5",
      userId: "user-1",
      name: "Custom Blank 2",
    });
    resumeProfileStore.update.mockResolvedValueOnce({
      id: "rp-5",
      userId: "user-1",
      name: "Graduate CV",
      summary: "Updated",
    });

    const profile = await upsertResumeProfile(
      "user-1",
      {
        summary: "Updated",
      },
      {
        profileId: "rp-5",
        name: "Graduate CV",
        setActive: true,
      },
    );

    expect(resumeProfileStore.update).toHaveBeenCalledWith({
      where: { id: "rp-5" },
      data: {
        summary: "Updated",
        basics: undefined,
        links: undefined,
        skills: undefined,
        experiences: undefined,
        projects: undefined,
        education: undefined,
        name: "Graduate CV",
        revision: { increment: 1 },
      },
    });
    expect(activeResumeProfileStore.upsert).toHaveBeenCalled();
    expect(profile.name).toBe("Graduate CV");
  });

  it("returns null when explicit profileId does not belong to user", async () => {
    resumeProfileStore.findFirst.mockResolvedValueOnce(null);

    const result = await upsertResumeProfile(
      "user-1",
      { summary: "Updated" },
      { profileId: "rp-missing" },
    );

    expect(result).toBeNull();
    expect(resumeProfileStore.create).not.toHaveBeenCalled();
  });

  it("creates a new profile and marks it active", async () => {
    resumeProfileStore.findMany.mockResolvedValueOnce([{ name: "Custom Blank" }]);
    resumeProfileStore.create.mockResolvedValueOnce({
      id: "rp-new",
      userId: "user-1",
      name: "Custom Blank 2",
    });

    const profile = await createResumeProfile("user-1");

    expect(profile.id).toBe("rp-new");
    expect(activeResumeProfileStore.upsert).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      update: { resumeProfileId: "rp-new" },
      create: { userId: "user-1", resumeProfileId: "rp-new" },
    });
  });

  it("lists profiles and flags active profile", async () => {
    resumeProfileStore.findMany.mockResolvedValueOnce([
      {
        id: "rp-1",
        name: "Custom Blank",
        createdAt: new Date("2026-02-21T01:00:00.000Z"),
        updatedAt: new Date("2026-02-21T02:00:00.000Z"),
        revision: 1,
      },
      {
        id: "rp-2",
        name: "Custom Blank 2",
        createdAt: new Date("2026-02-21T00:00:00.000Z"),
        updatedAt: new Date("2026-02-21T01:00:00.000Z"),
        revision: 1,
      },
    ]);
    activeResumeProfileStore.findUnique.mockResolvedValueOnce({ resumeProfileId: "rp-2" });

    const result = await listResumeProfiles("user-1");

    expect(result.activeProfileId).toBe("rp-2");
    expect(result.profiles[1]?.isActive).toBe(true);
  });

  it("sets active profile only when profile belongs to user", async () => {
    resumeProfileStore.findFirst.mockResolvedValueOnce({ id: "rp-9", userId: "user-1" });

    const target = await setActiveResumeProfile("user-1", "rp-9");

    expect(target?.id).toBe("rp-9");
    expect(activeResumeProfileStore.upsert).toHaveBeenCalled();
  });
});
