import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { put, del } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function buildPhotoBlobPath(userId: string) {
  return `resume-photos/${userId}/photo`;
}

export async function POST(req: Request) {
  const requestId = randomUUID();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Unauthorized" }, requestId },
      { status: 401 },
    );
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: { code: "BLOB_NOT_CONFIGURED", message: "Blob storage not configured" }, requestId },
      { status: 503 },
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: { code: "INVALID_TYPE", message: "Only JPEG, PNG, and WebP are allowed" }, requestId },
      { status: 400 },
    );
  }

  const body = await req.arrayBuffer();
  if (body.byteLength > MAX_SIZE) {
    return NextResponse.json(
      { error: { code: "TOO_LARGE", message: "Photo must be under 2 MB" }, requestId },
      { status: 400 },
    );
  }

  const ext = contentType === "image/png" ? ".png" : contentType === "image/webp" ? ".webp" : ".jpg";
  const blobPath = `${buildPhotoBlobPath(userId)}${ext}`;

  const blob = await put(blobPath, Buffer.from(body), {
    access: "public",
    contentType,
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return NextResponse.json({ url: blob.url, requestId });
}

export async function DELETE(req: Request) {
  const requestId = randomUUID();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Unauthorized" }, requestId },
      { status: 401 },
    );
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: { code: "BLOB_NOT_CONFIGURED", message: "Blob storage not configured" }, requestId },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(req.url);
  const photoUrl = searchParams.get("url");
  if (photoUrl) {
    await del(photoUrl, { token }).catch(() => {});
  }

  return NextResponse.json({ ok: true, requestId });
}
