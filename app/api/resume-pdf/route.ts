import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { renderResumeTex } from "@/lib/server/latex/renderResume";
import { compileLatexToPdf } from "@/lib/server/latex/compilePdf";
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";

export const runtime = "nodejs";

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const profile = await getResumeProfile(userId);
  if (!profile) {
    return NextResponse.json({ error: "NO_PROFILE" }, { status: 404 });
  }

  const input = mapResumeProfile(profile);
  const tex = renderResumeTex(input);
  const pdf = await compileLatexToPdf(tex);

  const today = new Date().toISOString().slice(0, 10);
  const safeName = input.candidate.name.replace(/\s+/g, "-").toLowerCase() || "resume";
  const filename = `resume-${safeName}-${today}.pdf`;

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename=\"${filename}\"`,
    },
  });
}
