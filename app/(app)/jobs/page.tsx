import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { JobsClient } from "./JobsClient";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JobsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/jobs");
  const userId = session.user.id;

  const itemsRaw = await prisma.job.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 10,
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
    <main className="jobs-theme relative min-h-screen">
      <div className="jobs-bg" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <JobsClient initialItems={items} initialCursor={nextCursor} />
      </div>
    </main>
  );
}

