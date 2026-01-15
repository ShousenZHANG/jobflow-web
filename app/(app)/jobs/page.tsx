import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { JobsClient } from "./JobsClient";

export default async function JobsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/jobs");

  return (
    <main className="flex flex-col gap-6">
      <section className="rounded border bg-white p-4">
        <div className="text-sm text-zinc-600">Signed in as</div>
        <div className="font-medium">
          {(session.user as any).email ?? "unknown"}
        </div>
      </section>
      <JobsClient />
    </main>
  );
}

