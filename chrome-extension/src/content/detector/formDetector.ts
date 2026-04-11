import type { DetectedField, FormDetectionResult } from "@ext/shared/types";
import { classifyField, buildSelector, getInputType } from "./fieldClassifier";
import type { AtsAdapter } from "./atsAdapters/types";
import { getAdapter } from "./atsAdapters";

/** Input types that should be skipped. */
const SKIP_TYPES = new Set(["hidden", "submit", "button", "reset", "image"]);

/** Selectors for form input elements. */
const INPUT_SELECTOR = "input, textarea, select, [contenteditable='true']";

/** Check if an element is visible and interactive. */
function isVisible(el: HTMLElement): boolean {
  if (el.getAttribute("aria-hidden") === "true") return false;
  if (el instanceof HTMLInputElement && el.type === "hidden") return false;

  // In jsdom (test environment), getComputedStyle returns empty strings and
  // offsetParent is always null. Fall back to inline style checks there.
  const hasGetComputedStyle = typeof getComputedStyle === "function";
  const style = hasGetComputedStyle ? getComputedStyle(el) : el.style;

  if (style.display === "none" || style.visibility === "hidden") return false;
  if (hasGetComputedStyle && parseFloat(style.opacity) === 0) return false;

  // offsetParent is null in jsdom for all elements — skip layout check in tests
  if (
    typeof el.offsetParent !== "undefined" &&
    el.offsetParent === null &&
    style.position !== "fixed" &&
    style.position !== "sticky" &&
    style.display !== "" // In jsdom, computed display is "" — skip the check
  ) {
    return false;
  }

  return true;
}

/** Detect all fillable fields in a document. */
export function detectFields(doc: Document, adapter: AtsAdapter): DetectedField[] {
  // Try ATS-specific detection first; fall through to generic if no fields found
  const atsFields = adapter.detectFields(doc);
  if (atsFields.length > 0) return atsFields;

  // Fallback: generic detection (also used when ATS adapter returns 0 fields)
  const elements = doc.querySelectorAll<HTMLElement>(INPUT_SELECTOR);
  const fields: DetectedField[] = [];

  for (const el of elements) {
    const inputType = getInputType(el);
    if (SKIP_TYPES.has(inputType)) continue;
    if (!isVisible(el)) continue;
    if (
      (el as HTMLInputElement).disabled ||
      (el as HTMLInputElement).readOnly ||
      el.getAttribute("aria-disabled") === "true"
    ) continue;

    const { category, confidence, labelText } = classifyField(el);

    fields.push({
      element: el,
      selector: buildSelector(el),
      inputType,
      category,
      confidence,
      labelText,
      name: el.getAttribute("name") ?? "",
      id: el.id ?? "",
      placeholder: (el as HTMLInputElement).placeholder ?? "",
    });
  }

  return fields;
}

/** Run full form detection on the current page. */
export function detectForms(doc: Document): FormDetectionResult {
  const adapter = getAdapter(doc);
  const fields = detectFields(doc, adapter);
  const forms = Array.from(doc.querySelectorAll("form"));

  return {
    atsProvider: adapter.name,
    fields,
    forms,
  };
}
