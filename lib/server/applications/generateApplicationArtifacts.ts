import { prisma } from "@/lib/server/prisma";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { buildResumePdfForJob } from "@/lib/server/applications/buildResumePdf";
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";
import { renderCoverLetterTex } from "@/lib/server/latex/renderCoverLetter";
import { compileLatexToPdf } from "@/lib/server/latex/compilePdf";
import { tailorApplicationContent } from "@/lib/server/ai/tailorApplication";

type GenerateArtifactsInput = {
  userId: string;
  jobId: string;
};

export async function generateApplicationArtifactsForJob(input: GenerateArtifactsInput) {
  const job = await prisma.job.findFirst({
    where: {
      id: input.jobId,
      userId: input.userId,
    },
    select: {
      id: true,
      title: true,
      company: true,
      description: true,
    },
  });
  if (!job) {
    throw new Error("JOB_NOT_FOUND");
  }

  const profile = await getResumeProfile(input.userId);
  if (!profile) {
    throw new Error("NO_PROFILE");
  }

  await buildResumePdfForJob({
    userId: input.userId,
    profile,
    job,
  });

  const renderInput = mapResumeProfile(profile);
  const tailored = await tailorApplicationContent(
    {
      baseSummary: renderInput.summary,
      jobTitle: job.title,
      company: job.company || "the company",
      description: job.description || "",
      resumeSnapshot: profile,
      userId: input.userId,
    },
    {
      strictCoverQuality: true,
      maxCoverRewritePasses: 2,
      localeProfile: "en-AU",
      targetWordRange: { min: 280, max: 360 },
    },
  );

  const coverTex = renderCoverLetterTex({
    candidate: {
      name: renderInput.candidate.name,
      title: renderInput.candidate.title,
      phone: renderInput.candidate.phone,
      email: renderInput.candidate.email,
      linkedinUrl: renderInput.candidate.linkedinUrl,
      linkedinText: renderInput.candidate.linkedinText,
    },
    company: job.company || "the company",
    role: job.title,
    candidateTitle: tailored.cover.candidateTitle,
    subject: tailored.cover.subject,
    date: tailored.cover.date,
    salutation: tailored.cover.salutation,
    paragraphOne: tailored.cover.paragraphOne,
    paragraphTwo: tailored.cover.paragraphTwo,
    paragraphThree: tailored.cover.paragraphThree,
    closing: tailored.cover.closing,
    signatureName: tailored.cover.signatureName,
  });
  await compileLatexToPdf(coverTex);

  const application = await prisma.application.upsert({
    where: {
      userId_jobId: {
        userId: input.userId,
        jobId: job.id,
      },
    },
    create: {
      userId: input.userId,
      jobId: job.id,
      resumeProfileId: profile.id,
      company: job.company,
      role: job.title,
    },
    update: {
      resumeProfileId: profile.id,
      company: job.company,
      role: job.title,
    },
    select: {
      id: true,
    },
  });

  return {
    applicationId: application.id,
    jobId: job.id,
  };
}
