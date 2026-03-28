/** Safely cast unknown to Record<string, unknown> */
export function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  return value as Record<string, unknown>;
}

/** Safely cast unknown to array */
export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** Safely extract string from unknown */
export function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Check if string has non-whitespace content */
export function hasText(value: string): boolean {
  return value.trim().length > 0;
}

/** Truncate text to max length with ellipsis */
export function truncate(text: string, max = 1600): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}
