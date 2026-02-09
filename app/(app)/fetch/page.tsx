import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { FetchClient } from "./FetchClient";

export default async function FetchPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/fetch");

  return (
    <main className="flex h-full min-h-0 flex-1 flex-col gap-6">
      <FetchClient />
    </main>
  );
}

