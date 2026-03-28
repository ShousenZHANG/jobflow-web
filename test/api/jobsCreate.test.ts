import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaStore = vi.hoisted(() => ({
  job: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: prismaStore,
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { POST } from "@/app/api/jobs/route";

const USER_ID = "user-1";
const validBody = {
  jobUrl: "https://www.seek.com.au/job/123",
  title: "Software Engineer",
};

describe("POST /api/jobs", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    prismaStore.job.findUnique.mockReset();
    prismaStore.job.create.mockReset();

    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: USER_ID },
    });
    prismaStore.job.findUnique.mockResolvedValue(null);
    prismaStore.job.create.mockResolvedValue({ id: "new-job-id" });
  });

  it("returns 401 when not authenticated", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const res = await POST(
      new Request("http://localhost/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      }),
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toEqual({ code: "UNAUTHORIZED", message: "Unauthorized" });
    expect(prismaStore.job.findUnique).not.toHaveBeenCalled();
  });

  it("returns 400 when jobUrl is missing", async () => {
    const res = await POST(
      new Request("http://localhost/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Engineer" }),
      }),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("INVALID_BODY");
    expect(prismaStore.job.findUnique).not.toHaveBeenCalled();
  });

  it("returns 400 when title is empty", async () => {
    const res = await POST(
      new Request("http://localhost/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobUrl: validBody.jobUrl, title: "" }),
      }),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("INVALID_BODY");
    expect(prismaStore.job.findUnique).not.toHaveBeenCalled();
  });

  it("returns 409 when jobUrl already exists for user", async () => {
    prismaStore.job.findUnique.mockResolvedValue({ id: "existing-job-id" });

    const res = await POST(
      new Request("http://localhost/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      }),
    );

    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toBe("JOB_URL_EXISTS");
    expect(prismaStore.job.create).not.toHaveBeenCalled();
  });

  it("returns 201 and creates job when jobUrl is new", async () => {
    const res = await POST(
      new Request("http://localhost/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      }),
    );

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.id).toBe("new-job-id");
    expect(prismaStore.job.findUnique).toHaveBeenCalledWith({
      where: { userId_jobUrl: { userId: USER_ID, jobUrl: expect.any(String) } },
      select: { id: true },
    });
    expect(prismaStore.job.create).toHaveBeenCalledTimes(1);
    const createData = prismaStore.job.create.mock.calls[0]?.[0]?.data;
    expect(createData?.userId).toBe(USER_ID);
    expect(createData?.title).toBe("Software Engineer");
  });
});
