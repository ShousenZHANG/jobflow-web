import { describe, expect, it } from "vitest";
import { getCursorPage } from "./pagination";

describe("getCursorPage", () => {
  it("returns null cursor when items do not exceed limit", () => {
    const items = Array.from({ length: 3 }, (_, idx) => ({ id: `id-${idx}` }));

    const result = getCursorPage(items, 3);

    expect(result.items).toHaveLength(3);
    expect(result.nextCursor).toBeNull();
  });

  it("trims extra item and returns next cursor when more items exist", () => {
    const items = Array.from({ length: 4 }, (_, idx) => ({ id: `id-${idx}` }));

    const result = getCursorPage(items, 3);

    expect(result.items).toHaveLength(3);
    expect(result.nextCursor).toBe("id-2");
  });

  it("handles empty lists", () => {
    const result = getCursorPage([], 5);

    expect(result.items).toHaveLength(0);
    expect(result.nextCursor).toBeNull();
  });
});
