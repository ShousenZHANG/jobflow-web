import { describe, it, expect } from "vitest";
import { computeMatchScore, scoreToTier, type ScoreInput } from "./matchScore";

const emptyProfile: ScoreInput["profile"] = {
  skills: [],
  experiences: [],
  projects: [],
};

const strongProfile: ScoreInput["profile"] = {
  skills: [
    { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
    { category: "Backend", items: ["Node.js", "PostgreSQL", "Redis"] },
    { category: "DevOps", items: ["Docker", "Kubernetes", "AWS"] },
  ],
  experiences: [
    {
      title: "Senior Software Engineer",
      dates: "2020.01 - Present",
      bullets: [
        "Built microservices using Node.js and PostgreSQL",
        "Deployed to Kubernetes on AWS",
      ],
    },
    {
      title: "Software Engineer",
      dates: "2017.06 - 2019.12",
      bullets: ["Worked on React applications"],
    },
  ],
  projects: [
    {
      name: "Platform",
      stack: "React, Node.js, Docker",
      bullets: ["Led full-stack delivery"],
    },
  ],
};

describe("scoreToTier", () => {
  it("maps >= 80 to strong", () => {
    expect(scoreToTier(100)).toBe("strong");
    expect(scoreToTier(80)).toBe("strong");
  });
  it("maps 65-79 to good", () => {
    expect(scoreToTier(79)).toBe("good");
    expect(scoreToTier(65)).toBe("good");
  });
  it("maps 45-64 to fair", () => {
    expect(scoreToTier(64)).toBe("fair");
    expect(scoreToTier(45)).toBe("fair");
  });
  it("maps < 45 to weak", () => {
    expect(scoreToTier(44)).toBe("weak");
    expect(scoreToTier(0)).toBe("weak");
  });
});

describe("computeMatchScore — edge cases", () => {
  it("returns 0 for empty profile against any JD", () => {
    const result = computeMatchScore({
      title: "Senior React Engineer",
      description: "React TypeScript Node.js",
      profile: emptyProfile,
    });
    expect(result.score).toBe(0);
    expect(result.tier).toBe("weak");
    expect(result.matchedSkills).toEqual([]);
  });

  it("handles null / undefined description gracefully", () => {
    const result = computeMatchScore({
      title: "Engineer",
      description: undefined,
      profile: strongProfile,
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(Number.isFinite(result.score)).toBe(true);
  });

  it("handles empty title gracefully", () => {
    const result = computeMatchScore({
      title: "",
      description: "React developer needed",
      profile: strongProfile,
    });
    expect(Number.isFinite(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it("returns integer score (0-100 inclusive)", () => {
    const result = computeMatchScore({
      title: "Frontend Engineer",
      description: "React, TypeScript, CSS, HTML",
      profile: strongProfile,
    });
    expect(Number.isInteger(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});

describe("computeMatchScore — skills matching", () => {
  it("awards high skills score when profile has all JD skills", () => {
    const result = computeMatchScore({
      title: "Frontend Engineer",
      description: "We need React, TypeScript, and Next.js expertise.",
      profile: strongProfile,
    });
    expect(result.breakdown.skillsScore).toBe(100);
    expect(result.matchedSkills).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Next.js"]),
    );
    expect(result.missingSkills).toEqual([]);
  });

  it("reports missing skills when profile is weak on JD requirements", () => {
    const result = computeMatchScore({
      title: "ML Engineer",
      description:
        "Requirements: PyTorch, TensorFlow, Ray, MLflow, Kubernetes experience",
      profile: strongProfile, // has Kubernetes but not ML stack
    });
    expect(result.matchedSkills).toContain("Kubernetes");
    expect(result.missingSkills).toEqual(
      expect.arrayContaining(["PyTorch", "TensorFlow", "Ray", "MLflow"]),
    );
  });

  it("normalizes aliases so React.js in JD matches 'React' in profile", () => {
    const profile: ScoreInput["profile"] = {
      skills: [{ category: "Frontend", items: ["React"] }],
      experiences: [],
      projects: [],
    };
    const result = computeMatchScore({
      title: "Engineer",
      description: "Strong React.js and ReactJS experience required",
      profile,
    });
    expect(result.matchedSkills).toContain("React");
    expect(result.missingSkills.filter((s) => s === "React")).toEqual([]);
  });
});

describe("computeMatchScore — title matching", () => {
  it("full title overlap gives max title score", () => {
    const result = computeMatchScore({
      title: "Senior Software Engineer",
      description: "",
      profile: strongProfile, // has exact title in experiences
    });
    expect(result.breakdown.titleScore).toBeGreaterThanOrEqual(80);
  });

  it("unrelated title yields low title score", () => {
    const result = computeMatchScore({
      title: "Marketing Manager",
      description: "",
      profile: strongProfile, // engineer titles only
    });
    expect(result.breakdown.titleScore).toBeLessThanOrEqual(30);
  });
});

describe("computeMatchScore — level matching", () => {
  it("same level gives high score", () => {
    const result = computeMatchScore({
      title: "Senior Engineer",
      description: "",
      profile: {
        ...strongProfile,
        experiences: [
          { title: "Senior Engineer", dates: "2021-Present", bullets: [] },
        ],
      },
    });
    expect(result.breakdown.levelScore).toBe(100);
  });

  it("junior applying to staff role penalized", () => {
    const juniorProfile: ScoreInput["profile"] = {
      skills: [],
      experiences: [
        { title: "Junior Developer", dates: "2023-Present", bullets: [] },
      ],
      projects: [],
    };
    const result = computeMatchScore({
      title: "Staff Software Engineer",
      description: "",
      profile: juniorProfile,
    });
    expect(result.breakdown.levelScore).toBeLessThan(50);
  });
});

describe("computeMatchScore — experience years", () => {
  it("meeting required years yields full experience score", () => {
    const profile: ScoreInput["profile"] = {
      skills: [],
      experiences: [
        { title: "Engineer", dates: "2018.01 - 2024.12", bullets: [] },
      ],
      projects: [],
    };
    const result = computeMatchScore({
      title: "Engineer",
      description: "Requires 5+ years of experience",
      profile,
    });
    expect(result.breakdown.experienceScore).toBe(100);
  });

  it("far below required years heavily penalized", () => {
    const profile: ScoreInput["profile"] = {
      skills: [],
      experiences: [
        { title: "Engineer", dates: "2024.01 - Present", bullets: [] },
      ],
      projects: [],
    };
    const result = computeMatchScore({
      title: "Senior Engineer",
      description: "Requires 8+ years of experience",
      profile,
    });
    expect(result.breakdown.experienceScore).toBeLessThan(50);
  });

  it("no years requirement in JD gives neutral score", () => {
    const profile: ScoreInput["profile"] = {
      skills: [],
      experiences: [
        { title: "Engineer", dates: "2020 - Present", bullets: [] },
      ],
      projects: [],
    };
    const result = computeMatchScore({
      title: "Engineer",
      description: "Join our team!",
      profile,
    });
    // Neutral around 70-100 range
    expect(result.breakdown.experienceScore).toBeGreaterThanOrEqual(70);
  });
});

describe("computeMatchScore — aggregate", () => {
  it("strong profile vs matching JD yields strong tier (>= 80)", () => {
    const result = computeMatchScore({
      title: "Senior Software Engineer",
      description: `
        We need a Senior Software Engineer with 5+ years of experience.
        Must have React, TypeScript, Node.js, PostgreSQL, Docker,
        Kubernetes, and AWS.
      `,
      profile: strongProfile,
    });
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.tier).toBe("strong");
  });

  it("weak profile vs mismatched JD yields weak tier (< 45)", () => {
    const result = computeMatchScore({
      title: "Principal Cryptography Researcher",
      description: `
        PhD required. 15+ years in cryptography, Haskell, Coq,
        formal verification, zero-knowledge proofs.
      `,
      profile: {
        skills: [{ category: "Web", items: ["HTML", "CSS"] }],
        experiences: [
          { title: "Intern", dates: "2024.01 - Present", bullets: [] },
        ],
        projects: [],
      },
    });
    expect(result.tier).toBe("weak");
  });

  it("result object is pure (same input → same output)", () => {
    const input: ScoreInput = {
      title: "Engineer",
      description: "React developer",
      profile: strongProfile,
    };
    const a = computeMatchScore(input);
    const b = computeMatchScore(input);
    expect(a).toEqual(b);
  });
});
