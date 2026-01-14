import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export default async function JobsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/jobs");

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <Link className="underline" href="/">
            Home
          </Link>
        </header>

        <section className="rounded border p-4">
          <div className="text-sm text-zinc-600">Signed in as</div>
          <div className="font-medium">
            {(session.user as any).email ?? "unknown"}
          </div>
        </section>

        <section className="rounded border p-4">
          <div className="text-sm text-zinc-600 mb-2">Next steps</div>
          <ul className="list-disc pl-5">
            <li>Open <code>/api/me</code> to verify session/userId</li>
            <li>Open <code>/api/jobs</code> to see your isolated job list</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

