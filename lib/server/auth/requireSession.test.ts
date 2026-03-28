import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

import { getServerSession } from "next-auth/next";
import { requireSession, UnauthorizedError } from "./requireSession";

const mockGetServerSession = vi.mocked(getServerSession);

describe("requireSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns userId and requestId when session is valid", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-123" },
      expires: "",
    });
    const ctx = await requireSession();
    expect(ctx.userId).toBe("user-123");
    expect(typeof ctx.requestId).toBe("string");
    expect(ctx.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("throws UnauthorizedError when session is null", async () => {
    mockGetServerSession.mockResolvedValue(null);
    await expect(requireSession()).rejects.toThrow(UnauthorizedError);
  });

  it("throws UnauthorizedError when user has no id", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: undefined },
      expires: "",
    });
    await expect(requireSession()).rejects.toThrow(UnauthorizedError);
  });
});

describe("UnauthorizedError", () => {
  it("has correct name and message", () => {
    const err = new UnauthorizedError();
    expect(err.name).toBe("UnauthorizedError");
    expect(err.message).toBe("Unauthorized");
    expect(err instanceof Error).toBe(true);
  });
});
