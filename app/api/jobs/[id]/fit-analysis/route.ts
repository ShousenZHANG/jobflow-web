import { NextResponse } from "next/server";

export const runtime = "nodejs";

function removedResponse() {
  return NextResponse.json(
    { error: "FEATURE_REMOVED", message: "Job fit analysis has been removed." },
    { status: 404 },
  );
}

export async function GET() {
  return removedResponse();
}

export async function POST() {
  return removedResponse();
}
