export type JobFitStatus = "PENDING" | "READY" | "FAILED";
export type JobFitGateStatus = "PASS" | "RISK" | "BLOCK";
export type JobFitRecommendation = "Worth Applying" | "Apply with Tailored CV" | "Low Priority";
export type JobFitSource = "heuristic" | "heuristic+gemini";

export const JOB_FIT_ANALYZER_VERSION = "jobfit-v1";

export type JobFitGate = {
  key: string;
  label: string;
  status: JobFitGateStatus;
  evidence?: string;
};

export type JobFitEvidence = {
  label: string;
  jd: string;
  resume?: string | null;
};

export type JobFitAnalysisPayload = {
  score: number;
  gateStatus: JobFitGateStatus;
  recommendation: JobFitRecommendation;
  stackMatch: {
    matched: number;
    total: number;
  };
  topGaps: string[];
  gates: JobFitGate[];
  evidence: JobFitEvidence[];
  generatedAt: string;
};

export type JobFitApiResponse = {
  status: JobFitStatus;
  analysis?: JobFitAnalysisPayload;
  source?: JobFitSource;
  aiEnhanced?: boolean;
  provider?: string | null;
  model?: string | null;
  aiReason?: string | null;
  message?: string;
};
