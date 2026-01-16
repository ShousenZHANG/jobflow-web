import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { JobsClient } from "./JobsClient";

export default async function JobsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/jobs");

  return (
    <main className="flex flex-col gap-6">
      <JobsClient />
    </main>
  );
}

