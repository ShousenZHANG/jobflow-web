import { classifyField, buildSelector, getInputType } from "../fieldClassifier";
import type { AtsAdapter } from "./types";
import type { DetectedField } from "@ext/shared/types";

const URL_PATTERN = /ashbyhq\.com/i;

export const ashbyAdapter: AtsAdapter = {
  name: "ashby",
  canHandle(url: string): boolean {
    return URL_PATTERN.test(url);
  },
  detectFields(doc: Document): DetectedField[] {
    const container =
      doc.querySelector('[data-testid="application-form"]') ??
      doc.querySelector(".ashby-application-form") ??
      doc.querySelector("form");
    if (!container) return [];

    const elements = container.querySelectorAll<HTMLElement>(
      "input, textarea, select, [contenteditable='true']"
    );
    const fields: DetectedField[] = [];
    for (const el of elements) {
      if (el instanceof HTMLInputElement && ["hidden", "submit", "button", "reset", "image"].includes(el.type)) continue;
      const { category, confidence, labelText } = classifyField(el);
      fields.push({
        element: el,
        selector: buildSelector(el),
        inputType: getInputType(el),
        category,
        confidence,
        labelText,
        name: (el as HTMLInputElement).name ?? "",
        id: el.id ?? "",
        placeholder: (el as HTMLInputElement).placeholder ?? "",
      });
    }
    return fields;
  },
};
