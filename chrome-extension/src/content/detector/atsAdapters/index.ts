import type { AtsAdapter } from "./types";
import { greenhouseAdapter } from "./greenhouse";
import { leverAdapter } from "./lever";
import { workdayAdapter } from "./workday";
import { icimsAdapter } from "./icims";
import { successFactorsAdapter } from "./successFactors";
import { taleoAdapter } from "./taleo";
import { smartRecruitersAdapter } from "./smartRecruiters";
import { bamboohrAdapter } from "./bamboohr";
import { jobviteAdapter } from "./jobvite";
import { ashbyAdapter } from "./ashby";
import { ripplingAdapter } from "./rippling";
import { genericAdapter } from "./generic";

/** Ordered list of ATS adapters. First match wins. */
const adapters: AtsAdapter[] = [
  greenhouseAdapter,
  leverAdapter,
  workdayAdapter,
  icimsAdapter,
  successFactorsAdapter,
  taleoAdapter,
  smartRecruitersAdapter,
  bamboohrAdapter,
  jobviteAdapter,
  ashbyAdapter,
  ripplingAdapter,
  genericAdapter, // Must be last (catch-all)
];

/** Select the appropriate ATS adapter for the current page. */
export function getAdapter(doc: Document): AtsAdapter {
  const url = doc.location?.href ?? "";
  for (const adapter of adapters) {
    if (adapter.canHandle(url, doc)) return adapter;
  }
  return genericAdapter;
}
