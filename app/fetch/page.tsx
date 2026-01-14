import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { FetchClient } from "./FetchClient";

export default async function FetchPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/fetch");

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <h1 className="text-2xl font-semibold">Fetch jobs (JobSpy)</h1>
        <FetchClient />
      </div>
    </main>
  );
}

