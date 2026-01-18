import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const timeZone = req.headers.get("x-user-timezone") ?? null;
  if (!session?.user) {
    return NextResponse.json({ user: null, timeZone }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      id: session.user.id ?? null,
      email: session.user.email ?? null,
      name: session.user.name ?? null,
    },
    timeZone,
  });
}

