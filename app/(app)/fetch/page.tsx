import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { FetchClient } from "./FetchClient";
import { Card, CardContent } from "@/components/ui/card";

export default async function FetchPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/fetch");

  return (
    <main className="flex flex-col gap-6">
      <Card>
        <CardContent className="space-y-2 p-4">
          <h1 className="text-2xl font-semibold">Fetch jobs (JobSpy)</h1>
          <p className="text-sm text-muted-foreground">
          Provide your criteria and trigger a fetch run. Results will be imported into your dashboard.
          </p>
        </CardContent>
      </Card>
      <FetchClient />
    </main>
  );
}

