export const CHUNK_RELOAD_STORAGE_KEY = "joblit_chunk_reload_attempted";

const CHUNK_LOAD_PATTERNS = [
  /ChunkLoadError/i,
  /Loading chunk [^\s]+ failed/i,
  /Loading CSS chunk [^\s]+ failed/i,
  /Failed to load chunk\b/i,
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
];

function stringifyError(error: unknown) {
  if (error instanceof Error) {
    return [error.name, error.message].filter(Boolean).join("\n");
  }
  return typeof error === "string" ? error : "";
}

export function isChunkLoadError(error: unknown) {
  const text = stringifyError(error);
  if (!text) return false;
  return CHUNK_LOAD_PATTERNS.some((pattern) => pattern.test(text));
}
