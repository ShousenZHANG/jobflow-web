import { describe, it, expect } from "vitest";
import {
  ResumeBasicsSchema,
  ResumeLinkSchema,
  ResumeExperienceSchema,
  ResumeProjectSchema,
  ResumeEducationSchema,
  ResumeSkillSchema,
  ResumeProfileSchema,
} from "./resumeProfile";

/* ---------- ResumeBasicsSchema ---------- */

const minimalBasics = {
  fullName: "Jane Doe",
  title: "Software Engineer",
  email: "jane@example.com",
  phone: "+61400000000",
};

const fullBasics = {
  ...minimalBasics,
  location: "Sydney, Australia",
  photoUrl: "https://example.com/photo.jpg",
  gender: "Female",
  age: "28",
  identity: "3 years experience",
  availabilityMonth: "2026-03",
  wechat: "jane_wx",
  qq: "123456789",
};

describe("ResumeBasicsSchema", () => {
  it("accepts minimal basics (required fields only)", () => {
    const result = ResumeBasicsSchema.safeParse(minimalBasics);
    expect(result.success).toBe(true);
  });

  it("accepts full basics with all optional CN fields", () => {
    const result = ResumeBasicsSchema.safeParse(fullBasics);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.wechat).toBe("jane_wx");
      expect(result.data.qq).toBe("123456789");
      expect(result.data.availabilityMonth).toBe("2026-03");
    }
  });

  it("accepts empty string for photoUrl", () => {
    const result = ResumeBasicsSchema.safeParse({ ...minimalBasics, photoUrl: "" });
    expect(result.success).toBe(true);
  });

  it("accepts valid URL for photoUrl", () => {
    const result = ResumeBasicsSchema.safeParse({
      ...minimalBasics,
      photoUrl: "https://cdn.example.com/avatar.png",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid photoUrl (not a URL and not empty)", () => {
    const result = ResumeBasicsSchema.safeParse({
      ...minimalBasics,
      photoUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fullName", () => {
    const { fullName, ...rest } = minimalBasics;
    expect(ResumeBasicsSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects missing email", () => {
    const { email, ...rest } = minimalBasics;
    expect(ResumeBasicsSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(
      ResumeBasicsSchema.safeParse({ ...minimalBasics, email: "bad" }).success,
    ).toBe(false);
  });

  it("accepts null/undefined for optional fields", () => {
    const result = ResumeBasicsSchema.safeParse({
      ...minimalBasics,
      location: null,
      photoUrl: null,
      gender: null,
      age: null,
      identity: null,
      wechat: null,
      qq: null,
      availabilityMonth: null,
    });
    expect(result.success).toBe(true);
  });
});

/* ---------- ResumeLinkSchema ---------- */

describe("ResumeLinkSchema", () => {
  it("accepts valid link", () => {
    const result = ResumeLinkSchema.safeParse({
      label: "GitHub",
      url: "https://github.com/jane",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing label", () => {
    expect(
      ResumeLinkSchema.safeParse({ url: "https://github.com" }).success,
    ).toBe(false);
  });

  it("rejects invalid url", () => {
    expect(
      ResumeLinkSchema.safeParse({ label: "GitHub", url: "not-a-url" }).success,
    ).toBe(false);
  });
});

/* ---------- ResumeExperienceSchema ---------- */

describe("ResumeExperienceSchema", () => {
  it("accepts valid experience entry", () => {
    const result = ResumeExperienceSchema.safeParse({
      dates: "Jan 2023 - Present",
      title: "Senior Engineer",
      company: "Acme Corp",
      bullets: ["Built microservices", "Led team of 5"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts experience with links", () => {
    const result = ResumeExperienceSchema.safeParse({
      dates: "Jan 2023 - Present",
      title: "Senior Engineer",
      company: "Acme Corp",
      links: [{ label: "Site", url: "https://acme.com" }],
      bullets: ["Built APIs"],
    });
    expect(result.success).toBe(true);
  });
});

/* ---------- ResumeProjectSchema ---------- */

describe("ResumeProjectSchema", () => {
  it("accepts valid project entry", () => {
    const result = ResumeProjectSchema.safeParse({
      name: "Open Source Tool",
      dates: "2022",
      bullets: ["Created CLI tool"],
    });
    expect(result.success).toBe(true);
  });
});

/* ---------- ResumeEducationSchema ---------- */

describe("ResumeEducationSchema", () => {
  it("accepts valid education entry", () => {
    const result = ResumeEducationSchema.safeParse({
      school: "MIT",
      degree: "B.S. Computer Science",
      dates: "2015 - 2019",
    });
    expect(result.success).toBe(true);
  });
});

/* ---------- ResumeSkillSchema ---------- */

describe("ResumeSkillSchema", () => {
  it("accepts valid skill group", () => {
    const result = ResumeSkillSchema.safeParse({
      category: "Languages",
      items: ["TypeScript", "Python", "Go"],
    });
    expect(result.success).toBe(true);
  });
});

/* ---------- ResumeProfileSchema ---------- */

describe("ResumeProfileSchema", () => {
  it("accepts a full profile with locale", () => {
    const result = ResumeProfileSchema.safeParse({
      locale: "zh-CN",
      summary: "Experienced engineer",
      basics: fullBasics,
      links: [{ label: "GitHub", url: "https://github.com/jane" }],
      skills: [{ category: "Languages", items: ["TypeScript"] }],
      experiences: [
        {
          dates: "2023 - Present",
          title: "Engineer",
          company: "Acme",
          bullets: ["Shipped features"],
        },
      ],
      projects: [
        {
          name: "Tool",
          dates: "2022",
          bullets: ["Built it"],
        },
      ],
      education: [
        {
          school: "MIT",
          degree: "BS CS",
          dates: "2015-2019",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts profile without locale (optional)", () => {
    const result = ResumeProfileSchema.safeParse({
      summary: "A summary",
    });
    expect(result.success).toBe(true);
  });

  it("accepts completely empty profile (all optional)", () => {
    const result = ResumeProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
