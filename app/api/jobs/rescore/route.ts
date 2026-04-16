import { NextResponse } from "next/server";
import { requireSession, UnauthorizedError } from "@/lib/server/auth/requireSession";
import { unauthorizedError } from "@/lib/server/api/errorResponse";
import { rescoreUserJobs } from "@/lib/server/jobs/scoreJobs";

export const runtime = "nodejs";

/**
 * POST /api/jobs/rescore
 *
 * Body (optional JSON): { force?: boolean }
 *   - force: true → rescore every job even if scoredProfileVersion matches
 *                   current profile revision. Default false (onlyStale).
 *
 * Callers:
 *   - Jobs page "Rescore all" button
 *   - ResumeContext.handleSave (after user updates active resume)
 *
 * Never scores jobs belonging to other users — rescoreUserJobs filters
 * everything by the session's userId.
 */
export async function POST(req: Request) {
  let session;
  try {
    session = await requireSession();
  } catch (err) {
    if (err instanceof UnauthorizedError) return unauthorizedError();
    throw err;
  }

  let force = false;
  try {
    const body = (await req.json().catch(() => null)) as
      | { force?: unknown }
      | null;
    if (body && typeof body.force === "boolean") force = body.force;
  } catch {
    // Empty body is fine — stick with defaults.
  }

  const result = await rescoreUserJobs(session.userId, {
    onlyStale: !force,
  });
  return NextResponse.json({ ok: true, ...result });
}
