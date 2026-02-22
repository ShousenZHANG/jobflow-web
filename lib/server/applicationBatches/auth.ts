export function requireApplicationBatchWorkerSecret(req: Request) {
  const expected = process.env.APPLICATION_BATCH_SECRET;
  if (!expected) throw new Error("APPLICATION_BATCH_SECRET is not set");
  const got = req.headers.get("x-application-batch-secret");
  return got === expected;
}
