import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResumePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/resume");

  return (
    <main className="flex h-full min-h-0 flex-1 flex-col gap-6">
      <section className="rounded-3xl border-2 border-slate-900/10 bg-white/80 p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.3)] backdrop-blur">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Master resumes</h1>
            <p className="text-sm text-muted-foreground">
              Maintain multiple base resume versions and choose which one drives your CV and CL generation.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/resume/rules">Manage prompt rules</Link>
          </Button>
        </div>
        <ResumeForm />
      </section>
    </main>
  );
}
