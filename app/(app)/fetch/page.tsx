import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { FetchClient } from "./FetchClient";

export default async function FetchPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/fetch");

  return (
    <main className="flex flex-col gap-6">
      <section className="rounded border bg-white p-4">
        <h1 className="text-2xl font-semibold">Fetch jobs (JobSpy)</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Provide your criteria and trigger a fetch run. Results will be imported into your dashboard.
        </p>
      </section>
      <FetchClient />
    </main>
  );
}

