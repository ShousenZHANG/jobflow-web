/**
 * Split an array into contiguous chunks of at most `size` items. The
 * final chunk may be shorter when `items.length` is not divisible by
 * `size`. The input array is not mutated.
 *
 * Used by client-side bulk operations (delete, status update) so a single
 * user gesture is broken into multiple smaller HTTP requests, keeping
 * each request inside the serverless function timeout and the
 * Postgres / Neon connection budget.
 */
export function chunkArray<T>(items: readonly T[], size: number): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error(`chunkArray: size must be a positive integer (got ${size})`);
  }
  if (items.length === 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
