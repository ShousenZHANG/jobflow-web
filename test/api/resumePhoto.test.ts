import { beforeEach, describe, expect, it, vi } from "vitest";

const blobStore = vi.hoisted(() => ({
  put: vi.fn(),
  del: vi.fn(),
}));

vi.mock("@vercel/blob", () => ({
  put: blobStore.put,
  del: blobStore.del,
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import { DELETE, POST } from "@/app/api/resume-photo/route";

describe("resume photo api", () => {
  beforeEach(() => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    blobStore.put.mockReset();
    blobStore.del.mockReset();
    process.env.BLOB_READ_WRITE_TOKEN = "blob-token";
  });

  it("uploads photos into the authenticated user's deterministic blob path", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    blobStore.put.mockResolvedValueOnce({
      url: "https://store.public.blob.vercel-storage.com/resume-photos/user-1/photo.png",
    });

    const res = await POST(
      new Request("http://localhost/api/resume-photo", {
        method: "POST",
        headers: { "content-type": "image/png" },
        body: new Uint8Array([1, 2, 3]),
      }),
    );

    expect(res.status).toBe(200);
    expect(blobStore.put).toHaveBeenCalledWith(
      "resume-photos/user-1/photo.png",
      expect.any(Buffer),
      expect.objectContaining({
        access: "public",
        allowOverwrite: true,
        addRandomSuffix: false,
        contentType: "image/png",
        token: "blob-token",
      }),
    );
  });

  it("rejects deletion of a blob URL outside the authenticated user's photo path", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });

    const res = await DELETE(
      new Request(
        "http://localhost/api/resume-photo?url=https%3A%2F%2Fstore.public.blob.vercel-storage.com%2Fresume-photos%2Fuser-2%2Fphoto.png",
      ),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error.code).toBe("INVALID_PHOTO_URL");
    expect(blobStore.del).not.toHaveBeenCalled();
  });

  it("deletes only trusted current-user photo blob URLs", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });

    const photoUrl =
      "https://store.public.blob.vercel-storage.com/resume-photos/user-1/photo.webp";
    const res = await DELETE(
      new Request(`http://localhost/api/resume-photo?url=${encodeURIComponent(photoUrl)}`),
    );

    expect(res.status).toBe(200);
    expect(blobStore.del).toHaveBeenCalledWith(photoUrl, { token: "blob-token" });
  });
});
