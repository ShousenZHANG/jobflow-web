import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaStore = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
  },
  deletedJobUrl: {
    findMany: vi.fn(),
  },
  job: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: prismaStore,
}));

import { POST } from "@/app/api/admin/import/route";

describe("admin import api", () => {
  beforeEach(() => {
    process.env.IMPORT_SECRET = "import-secret";
    prismaStore.user.findUnique.mockReset();
    prismaStore.deletedJobUrl.findMany.mockReset();
    prismaStore.job.findUnique.mockReset();
    prismaStore.job.create.mockReset();

    prismaStore.user.findUnique.mockResolvedValue({ id: "user-1" });
    prismaStore.deletedJobUrl.findMany.mockResolvedValue([]);
    prismaStore.job.findUnique.mockResolvedValue(null);
    prismaStore.job.create.mockResolvedValue({ id: "job-1" });
  });

  it("canonicalizes tracking variants and imports only one record", async () => {
    const res = await POST(
      new Request("http://localhost/api/admin/import", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-import-secret": "import-secret",
        },
        body: JSON.stringify({
          userEmail: "user@example.com",
          items: [
            {
              jobUrl: "https://www.linkedin.com/jobs/view/123/?trk=abc",
              title: "Software Engineer",
            },
            {
              jobUrl: "https://linkedin.com/jobs/view/123?tracking=def#fragment",
              title: "Software Engineer",
            },
          ],
        }),
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.imported).toBe(1);
    expect(prismaStore.job.create).toHaveBeenCalledTimes(1);
    const created = prismaStore.job.create.mock.calls[0]?.[0]?.data;
    expect(created.jobUrl).toBe("https://linkedin.com/jobs/view/123");
  });

  it("filters out entries that match deleted URLs after canonicalization", async () => {
    prismaStore.deletedJobUrl.findMany.mockResolvedValueOnce([
      { jobUrl: "https://linkedin.com/jobs/view/777" },
    ]);

    const res = await POST(
      new Request("http://localhost/api/admin/import", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-import-secret": "import-secret",
        },
        body: JSON.stringify({
          userEmail: "user@example.com",
          items: [
            {
              jobUrl: "https://linkedin.com/jobs/view/777/?refId=abc",
              title: "Backend Engineer",
            },
          ],
        }),
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.imported).toBe(0);
    expect(prismaStore.job.create).not.toHaveBeenCalled();
  });
});

