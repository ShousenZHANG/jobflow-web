import { NextResponse } from "next/server";
import { LatexRenderError } from "@/lib/server/latex/compilePdf";

export function handleLatexError(err: unknown, requestId: string): NextResponse | null {
  if (err instanceof LatexRenderError) {
    return NextResponse.json(
      {
        error: {
          code: err.code,
          message: err.message,
          details: err.details,
        },
        requestId,
      },
      { status: err.status },
    );
  }
  return null;
}
