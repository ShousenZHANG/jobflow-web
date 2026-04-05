import { describe, it, expect } from "vitest";
import { FieldCategory } from "@ext/shared/fieldTaxonomy";
import type { DetectedField } from "@ext/shared/types";
import {
  generateFormSignature,
  signatureSimilarity,
  matchFieldsFromHistory,
  type SubmissionRecord,
  type MappingRule,
} from "./similarity";

function makeField(overrides: Partial<DetectedField>): DetectedField {
  return {
    element: null as unknown as HTMLElement,
    selector: "#test",
    inputType: "text",
    category: FieldCategory.UNKNOWN,
    confidence: 0.5,
    labelText: "",
    name: "",
    id: "",
    placeholder: "",
    ...overrides,
  };
}

describe("generateFormSignature", () => {
  it("produces consistent signature for same fields", () => {
    const fields = [
      makeField({ category: FieldCategory.EMAIL, labelText: "Email", inputType: "email" }),
      makeField({ category: FieldCategory.FULL_NAME, labelText: "Name", inputType: "text" }),
    ];
    const sig1 = generateFormSignature(fields);
    const sig2 = generateFormSignature(fields);
    expect(sig1).toBe(sig2);
  });

  it("is order-independent", () => {
    const f1 = makeField({ category: FieldCategory.EMAIL, labelText: "Email", inputType: "email" });
    const f2 = makeField({ category: FieldCategory.PHONE, labelText: "Phone", inputType: "tel" });
    const sig1 = generateFormSignature([f1, f2]);
    const sig2 = generateFormSignature([f2, f1]);
    expect(sig1).toBe(sig2);
  });

  it("produces different signatures for different fields", () => {
    const a = [makeField({ category: FieldCategory.EMAIL, labelText: "Email", inputType: "email" })];
    const b = [makeField({ category: FieldCategory.PHONE, labelText: "Phone", inputType: "tel" })];
    expect(generateFormSignature(a)).not.toBe(generateFormSignature(b));
  });

  it("returns 8-char hex string", () => {
    const sig = generateFormSignature([
      makeField({ category: FieldCategory.EMAIL, labelText: "Email", inputType: "email" }),
    ]);
    expect(sig).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe("signatureSimilarity", () => {
  it("returns 1.0 for identical signatures", () => {
    expect(signatureSimilarity("abc123", "abc123")).toBe(1.0);
  });

  it("returns 0.0 for different signatures", () => {
    expect(signatureSimilarity("abc123", "xyz789")).toBe(0.0);
  });
});

describe("matchFieldsFromHistory", () => {
  const fields: DetectedField[] = [
    makeField({ selector: "#email", name: "email", category: FieldCategory.EMAIL, labelText: "Email" }),
    makeField({ selector: "#name", name: "name", category: FieldCategory.FULL_NAME, labelText: "Full Name" }),
    makeField({ selector: "#phone", name: "phone", category: FieldCategory.PHONE, labelText: "Phone" }),
  ];

  it("matches from exact signature submissions", () => {
    const submissions: SubmissionRecord[] = [{
      formSignature: "sig-abc",
      pageDomain: "boards.greenhouse.io",
      atsProvider: "greenhouse",
      fieldValues: { email: "john@ex.com", name: "John Doe" },
      fieldMappings: {},
    }];

    const matches = matchFieldsFromHistory(
      fields, "sig-abc", "boards.greenhouse.io", "greenhouse", submissions, [],
    );

    expect(matches.get("#email")?.value).toBe("john@ex.com");
    expect(matches.get("#email")?.source).toBe("exact");
    expect(matches.get("#email")?.confidence).toBe(0.95);
    expect(matches.get("#name")?.value).toBe("John Doe");
  });

  it("prioritizes user rules over history", () => {
    const submissions: SubmissionRecord[] = [{
      formSignature: "sig-abc",
      pageDomain: "boards.greenhouse.io",
      atsProvider: "greenhouse",
      fieldValues: { email: "old@ex.com" },
      fieldMappings: {},
    }];
    const rules: MappingRule[] = [{
      fieldSelector: "#email",
      fieldLabel: "Email",
      atsProvider: "greenhouse",
      pageDomain: null,
      profilePath: "email",
      staticValue: "override@ex.com",
      source: "user",
      confidence: 1.0,
      useCount: 5,
    }];

    const matches = matchFieldsFromHistory(
      fields, "sig-abc", "boards.greenhouse.io", "greenhouse", submissions, rules,
    );

    expect(matches.get("#email")?.value).toBe("override@ex.com");
    expect(matches.get("#email")?.source).toBe("user_rule");
  });

  it("falls back to same ATS+domain with lower confidence", () => {
    const submissions: SubmissionRecord[] = [{
      formSignature: "sig-different",
      pageDomain: "boards.greenhouse.io",
      atsProvider: "greenhouse",
      fieldValues: { phone: "+61 400 000 000" },
      fieldMappings: {},
    }];

    const matches = matchFieldsFromHistory(
      fields, "sig-new", "boards.greenhouse.io", "greenhouse", submissions, [],
    );

    expect(matches.get("#phone")?.value).toBe("+61 400 000 000");
    expect(matches.get("#phone")?.source).toBe("same_ats_domain");
    expect(matches.get("#phone")?.confidence).toBe(0.8);
  });

  it("falls back to same ATS cross-domain", () => {
    const submissions: SubmissionRecord[] = [{
      formSignature: "sig-other",
      pageDomain: "other.greenhouse.io",
      atsProvider: "greenhouse",
      fieldValues: { email: "cross@ex.com" },
      fieldMappings: {},
    }];

    const matches = matchFieldsFromHistory(
      fields, "sig-new", "boards.greenhouse.io", "greenhouse", submissions, [],
    );

    expect(matches.get("#email")?.value).toBe("cross@ex.com");
    expect(matches.get("#email")?.source).toBe("same_ats");
    expect(matches.get("#email")?.confidence).toBe(0.6);
  });

  it("returns empty map when no matches", () => {
    const matches = matchFieldsFromHistory(
      fields, "sig-new", "example.com", "generic", [], [],
    );
    expect(matches.size).toBe(0);
  });

  // ── Knowledge base rule matching (label + category + profile resolution) ──

  it("matches rules by label when selector doesn't match", () => {
    const rules: MappingRule[] = [{
      fieldSelector: "#old-email-field",
      fieldLabel: "Email",
      atsProvider: "greenhouse",
      pageDomain: null,
      profilePath: "email",
      staticValue: "label-match@ex.com",
      source: "user",
      confidence: 1.0,
      useCount: 3,
    }];

    const matches = matchFieldsFromHistory(
      fields, "sig-new", "example.com", "greenhouse", [], rules,
    );

    expect(matches.get("#email")?.value).toBe("label-match@ex.com");
    expect(matches.get("#email")?.source).toBe("user_rule");
  });

  it("matches rules by category as last resort", () => {
    const categoryField = makeField({
      selector: "#completely-new",
      name: "my-phone",
      category: FieldCategory.PHONE,
      labelText: "Enter your phone number please",
    });

    const rules: MappingRule[] = [{
      fieldSelector: "#other-selector",
      fieldLabel: "Telephone",
      atsProvider: "lever",
      pageDomain: null,
      profilePath: FieldCategory.PHONE,
      staticValue: "+1 555 1234",
      source: "user",
      confidence: 0.9,
      useCount: 2,
    }];

    const matches = matchFieldsFromHistory(
      [categoryField], "sig-x", "example.com", "lever", [], rules,
    );

    expect(matches.get("#completely-new")?.value).toBe("+1 555 1234");
  });

  it("resolves profilePath from profile when no staticValue", () => {
    const profile = { email: "from-profile@ex.com", fullName: "Jane Smith" };
    const rules: MappingRule[] = [{
      fieldSelector: "#email",
      fieldLabel: "Email",
      atsProvider: "greenhouse",
      pageDomain: null,
      profilePath: "email",
      staticValue: null,
      source: "user",
      confidence: 1.0,
      useCount: 1,
    }];

    const matches = matchFieldsFromHistory(
      fields, "sig-new", "example.com", "greenhouse", [], rules, profile,
    );

    expect(matches.get("#email")?.value).toBe("from-profile@ex.com");
  });

  it("prefers staticValue over profilePath resolution", () => {
    const profile = { email: "profile@ex.com" };
    const rules: MappingRule[] = [{
      fieldSelector: "#email",
      fieldLabel: "Email",
      atsProvider: "greenhouse",
      pageDomain: null,
      profilePath: "email",
      staticValue: "static@ex.com",
      source: "user",
      confidence: 1.0,
      useCount: 1,
    }];

    const matches = matchFieldsFromHistory(
      fields, "sig-new", "example.com", "greenhouse", [], rules, profile,
    );

    expect(matches.get("#email")?.value).toBe("static@ex.com");
  });

  it("skips rule when no staticValue and profilePath not in profile", () => {
    const profile = { fullName: "Jane" };
    const rules: MappingRule[] = [{
      fieldSelector: "#email",
      fieldLabel: "Email",
      atsProvider: "greenhouse",
      pageDomain: null,
      profilePath: "email",
      staticValue: null,
      source: "user",
      confidence: 1.0,
      useCount: 1,
    }];

    const matches = matchFieldsFromHistory(
      fields, "sig-new", "example.com", "greenhouse", [], rules, profile,
    );

    // No value resolved, should not create a match
    expect(matches.has("#email")).toBe(false);
  });

  it("works without profile parameter (backward compat)", () => {
    const rules: MappingRule[] = [{
      fieldSelector: "#email",
      fieldLabel: "Email",
      atsProvider: "greenhouse",
      pageDomain: null,
      profilePath: "email",
      staticValue: "direct@ex.com",
      source: "user",
      confidence: 1.0,
      useCount: 1,
    }];

    const matches = matchFieldsFromHistory(
      fields, "sig-new", "example.com", "greenhouse", [], rules,
    );

    expect(matches.get("#email")?.value).toBe("direct@ex.com");
  });
});
