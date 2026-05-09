import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { aiContentSchema } from "@/lib/shared/schemas/aiContent";
import { TailorClient } from "./TailorClient";
import { LegacyApplicationBanner } from "./LegacyApplicationBanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface TailorPageProps {
  params: Promise<{ id: string }>;
}

export default async function TailorPage({ params }: TailorPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/jobs");
  }
  const userId = session.user.id;
  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: { id, userId },
    select: {
      id: true,
      status: true,
      aiContent: true,
      aiContentHash: true,
      resumePdfUrl: true,
      resumePdfName: true,
      coverPdfUrl: true,
      role: true,
      company: true,
      jobId: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          market: true,
        },
      },
    },
  });

  if (!application) {
    redirect("/jobs");
  }

  // Legacy migration path: rows that pre-date the edit workflow have
  // no aiContent. Force the user to re-generate before editing.
  if (!application.aiContent) {
    return (
      <LegacyApplicationBanner
        applicationId={application.id}
        jobId={application.jobId}
        jobTitle={application.job?.title ?? application.role ?? "Untitled"}
        company={application.job?.company ?? application.company ?? ""}
        resumePdfUrl={application.resumePdfUrl}
      />
    );
  }

  const parsed = aiContentSchema.safeParse(application.aiContent);
  if (!parsed.success) {
    return (
      <LegacyApplicationBanner
        applicationId={application.id}
        jobId={application.jobId}
        jobTitle={application.job?.title ?? application.role ?? "Untitled"}
        company={application.job?.company ?? application.company ?? ""}
        resumePdfUrl={application.resumePdfUrl}
        invalidShape
      />
    );
  }

  return (
    <TailorClient
      applicationId={application.id}
      initialStatus={application.status}
      initialAiContent={parsed.data}
      initialAiContentHash={application.aiContentHash}
      resumePdfUrl={application.resumePdfUrl}
      coverPdfUrl={application.coverPdfUrl}
      job={{
        id: application.job?.id ?? null,
        title: application.job?.title ?? application.role ?? "Untitled",
        company: application.job?.company ?? application.company ?? null,
        location: application.job?.location ?? null,
        market: application.job?.market ?? "AU",
      }}
    />
  );
}
