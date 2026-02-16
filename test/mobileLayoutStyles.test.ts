import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("mobile layout style contracts", () => {
  it("does not use fixed viewport subtraction heights for app-shell", () => {
    const cssPath = join(process.cwd(), "app", "globals.css");
    const css = readFileSync(cssPath, "utf8");

    expect(css.includes("height: calc(100vh - 104px);")).toBe(false);
    expect(css.includes("height: calc(100dvh - 104px);")).toBe(false);
    expect(css.includes("height: calc(100vh - 112px);")).toBe(false);
    expect(css.includes("height: calc(100dvh - 112px);")).toBe(false);
  });
});
