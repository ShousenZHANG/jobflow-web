import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { AiProviderForm } from "@/components/resume/AiProviderForm";
import { AiRulesForm } from "@/components/resume/AiRulesForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AiRulesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/resume/ai-rules");

  return (
    <main className="flex h-full min-h-0 flex-1 flex-col gap-6">
      <section className="rounded-3xl border-2 border-slate-900/10 bg-white/80 p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.3)] backdrop-blur">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">AI rules</h1>
          <p className="text-sm text-muted-foreground">
            Customize the default CV and cover letter rules applied by the AI generator.
          </p>
        </div>
        <div className="space-y-6">
          <AiProviderForm />
          <AiRulesForm />
        </div>
      </section>
    </main>
  );
}
