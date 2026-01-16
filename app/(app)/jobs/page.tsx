import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { JobsClient } from "./JobsClient";
import { prisma } from "@/lib/server/prisma";

export default async function JobsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/jobs");
  const userId = (session.user as any).id as string;

  const itemsRaw = await prisma.job.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 20,
    select: {
      id: true,
      jobUrl: true,
      title: true,
      company: true,
      location: true,
      jobType: true,
      jobLevel: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const items = itemsRaw.map((it) => ({
    ...it,
    createdAt: it.createdAt.toISOString(),
    updatedAt: it.updatedAt.toISOString(),
  }));
  const nextCursor = items.length ? items[items.length - 1].id : null;

  return (
    <main className="flex flex-col gap-6">
      <JobsClient initialItems={items} initialCursor={nextCursor} />
    </main>
  );
}

