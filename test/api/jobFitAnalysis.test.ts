import { describe, expect, it } from "vitest";

import { GET, POST } from "@/app/api/jobs/[id]/fit-analysis/route";

describe("job fit analysis api", () => {
  it("returns 404 after feature removal", async () => {
    const getRes = await GET();
    const postRes = await POST();

    expect(getRes.status).toBe(404);
    expect(postRes.status).toBe(404);
  });
});
