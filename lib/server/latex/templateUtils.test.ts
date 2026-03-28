import { describe, it, expect } from "vitest";
import {
  replaceTokens,
  sanitizeRendered,
  renderBullets,
  renderLinks,
} from "./templateUtils";

describe("replaceTokens", () => {
  it("replaces {{KEY}} tokens with values", () => {
    const template = "Hello {{NAME}}, welcome to {{PLACE}}.";
    const result = replaceTokens(template, {
      NAME: "Alice",
      PLACE: "Wonderland",
    });
    expect(result).toBe("Hello Alice, welcome to Wonderland.");
  });

  it("replaces multiple occurrences of same token", () => {
    const template = "{{X}} and {{X}}";
    expect(replaceTokens(template, { X: "yes" })).toBe("yes and yes");
  });

  it("leaves unmatched tokens untouched", () => {
    const template = "{{A}} and {{B}}";
    expect(replaceTokens(template, { A: "1" })).toBe("1 and {{B}}");
  });

  it("handles empty map", () => {
    const template = "{{A}}";
    expect(replaceTokens(template, {})).toBe("{{A}}");
  });
});

describe("sanitizeRendered", () => {
  it("removes surrogate pairs", () => {
    expect(sanitizeRendered("abc\uD800\uDFFFdef")).toBe("abcdef");
  });

  it("removes replacement character", () => {
    expect(sanitizeRendered("abc\uFFFDdef")).toBe("abcdef");
  });

  it("removes emoji from supplementary planes", () => {
    // U+1F600 is a grinning face emoji
    expect(sanitizeRendered("hello \u{1F600} world")).toBe("hello  world");
  });

  it("passes through normal text unchanged", () => {
    const text = "Hello, World! This is normal text.";
    expect(sanitizeRendered(text)).toBe(text);
  });
});

describe("renderBullets", () => {
  it("renders array of items as LaTeX \\item entries", () => {
    const result = renderBullets(["First point", "Second point"]);
    expect(result).toBe("\\item First point\n\\item Second point");
  });

  it("returns empty string for empty array", () => {
    expect(renderBullets([])).toBe("");
  });

  it("handles single item", () => {
    expect(renderBullets(["Only one"])).toBe("\\item Only one");
  });
});

describe("renderLinks", () => {
  it("renders links as LaTeX \\href entries", () => {
    const links = [
      { label: "GitHub", url: "https://github.com" },
      { label: "Site", url: "https://example.com" },
    ];
    const result = renderLinks(links);
    expect(result).toBe(
      "\\href{https://github.com}{GitHub} \\;|\\; \\href{https://example.com}{Site}",
    );
  });

  it("returns empty string for empty array", () => {
    expect(renderLinks([])).toBe("");
  });

  it("renders single link without separator", () => {
    const result = renderLinks([{ label: "Link", url: "https://a.com" }]);
    expect(result).toBe("\\href{https://a.com}{Link}");
  });

  it("supports custom separator", () => {
    const links = [
      { label: "A", url: "https://a.com" },
      { label: "B", url: "https://b.com" },
    ];
    const result = renderLinks(links, " | ");
    expect(result).toBe("\\href{https://a.com}{A} | \\href{https://b.com}{B}");
  });
});
