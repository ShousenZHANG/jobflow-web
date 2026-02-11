import { createHash } from "node:crypto";

type EtagJobItem = {
  id: string;
  status: string;
  updatedAt: Date | string;
  resumePdfUrl?: string | null;
  resumePdfName?: string | null;
};

type BuildJobsListEtagInput = {
  userId: string;
  cursor: string | null;
  nextCursor: string | null;
  filtersSignature: string;
  jobLevels: string[];
  items: EtagJobItem[];
};

function toIso(value: Date | string): string {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
}

export function buildJobsListEtag(input: BuildJobsListEtagInput): string {
  const itemsSignature = input.items
    .map((item) =>
      [
        item.id,
        item.status,
        toIso(item.updatedAt),
        item.resumePdfUrl ?? "",
        item.resumePdfName ?? "",
      ].join(":"),
    )
    .join("|");
  const levelsSignature = input.jobLevels.join("|");
  const payload = [
    input.userId,
    input.cursor ?? "start",
    input.nextCursor ?? "end",
    input.filtersSignature,
    levelsSignature,
    itemsSignature,
  ].join("::");
  const digest = createHash("sha1").update(payload).digest("base64url");
  return `W/"jobs:${digest}"`;
}

