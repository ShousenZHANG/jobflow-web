import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";
import { renderResumeTex } from "@/lib/server/latex/renderResume";
import { compileLatexToPdf } from "@/lib/server/latex/compilePdf";
import { tailorApplicationContent } from "@/lib/server/ai/tailorApplication";

type ResumeJobContext = {
  title: string;
  company: string | null;
  description: string | null;
};

type ResumeProfileRecord = NonNullable<
  Awaited<ReturnType<typeof import("@/lib/server/resumeProfile").getResumeProfile>>
>;

export type ResumePdfResult = {
  pdf: Buffer;
  tex: string;
  cvSource: "ai" | "base";
  coverSource: "ai" | "fallback";
  renderInput: ReturnType<typeof mapResumeProfile>;
};

export async function buildResumePdfForJob(input: {
  userId: string;
  profile: ResumeProfileRecord;
  job: ResumeJobContext;
}): Promise<ResumePdfResult> {
  const renderInput = mapResumeProfile(input.profile);
  const tailored = await tailorApplicationContent({
    baseSummary: renderInput.summary,
    jobTitle: input.job.title,
    company: input.job.company || "the company",
    description: input.job.description || "",
    userId: input.userId,
  });

  const cvInput = {
    ...renderInput,
    summary: tailored.cvSummary || renderInput.summary,
  };

  const tex = renderResumeTex(cvInput);
  const pdf = await compileLatexToPdf(tex);

  return {
    pdf,
    tex,
    cvSource: tailored.source.cv,
    coverSource: tailored.source.cover,
    renderInput,
  };
}
