import { describe, expect, it } from "vitest";
import {
  buildResumePhotoCompileFile,
  buildResumePhotoBlobPath,
  MAX_RESUME_PHOTO_BYTES,
  parseTrustedResumePhotoUrl,
  toResumePhotoContentType,
} from "./resumePhotoBlob";

describe("resumePhotoBlob", () => {
  it("normalizes and validates supported image content types", () => {
    expect(toResumePhotoContentType("image/jpeg; charset=utf-8")).toBe("image/jpeg");
    expect(toResumePhotoContentType("image/png")).toBe("image/png");
    expect(toResumePhotoContentType("image/svg+xml")).toBeNull();
  });

  it("builds deterministic per-user blob paths", () => {
    expect(buildResumePhotoBlobPath("user-1", "image/webp")).toBe(
      "resume-photos/user-1/photo.webp",
    );
  });

  it("accepts only Vercel Blob URLs under the current user's photo path", () => {
    expect(
      parseTrustedResumePhotoUrl(
        "https://store.public.blob.vercel-storage.com/resume-photos/user-1/photo.png",
        "user-1",
      )?.toString(),
    ).toBe("https://store.public.blob.vercel-storage.com/resume-photos/user-1/photo.png");

    expect(
      parseTrustedResumePhotoUrl("https://example.com/resume-photos/user-1/photo.png", "user-1"),
    ).toBeNull();
    expect(
      parseTrustedResumePhotoUrl(
        "https://store.public.blob.vercel-storage.com/resume-photos/user-2/photo.png",
        "user-1",
      ),
    ).toBeNull();
    expect(
      parseTrustedResumePhotoUrl(
        "https://store.public.blob.vercel-storage.com/resume-photos/user-1/anything.png",
        "user-1",
      ),
    ).toBeNull();
  });

  it("creates compile files only for bounded supported images", async () => {
    const ok = await buildResumePhotoCompileFile(
      new Response(new Uint8Array([1, 2, 3]), {
        headers: {
          "content-type": "image/png",
          "content-length": "3",
        },
      }),
    );
    expect(ok).toEqual({ name: "photo.png", base64: "AQID" });

    const invalidType = await buildResumePhotoCompileFile(
      new Response(new Uint8Array([1, 2, 3]), {
        headers: { "content-type": "image/svg+xml", "content-length": "3" },
      }),
    );
    expect(invalidType).toBeNull();

    const tooLarge = await buildResumePhotoCompileFile(
      new Response(new Uint8Array([1]), {
        headers: {
          "content-type": "image/jpeg",
          "content-length": String(MAX_RESUME_PHOTO_BYTES + 1),
        },
      }),
    );
    expect(tooLarge).toBeNull();
  });
});
