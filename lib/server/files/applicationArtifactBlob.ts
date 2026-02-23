export type ApplicationArtifactTarget = "resume" | "cover";

export function buildApplicationArtifactBlobPath(input: {
  userId: string;
  jobId: string;
  target: ApplicationArtifactTarget;
}) {
  return `applications/${input.userId}/${input.jobId}/${input.target}.latest.pdf`;
}

export const APPLICATION_ARTIFACT_OVERWRITE_OPTIONS = {
  addRandomSuffix: false,
  allowOverwrite: true,
} as const;

