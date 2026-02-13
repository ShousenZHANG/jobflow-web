type RolePackDefinition = {
  aliases: string[];
  roles: string[];
};

const ROLE_PACKS: RolePackDefinition[] = [
  {
    aliases: [
      "software engineer",
      "software developer",
      "swe",
      "application developer",
    ],
    roles: [
      "Software Engineer",
      "Software Developer",
      "Full Stack Engineer",
      "Full Stack Developer",
      "Backend Engineer",
      "Backend Developer",
      "Frontend Engineer",
      "Frontend Developer",
    ],
  },
  {
    aliases: ["frontend engineer", "frontend developer", "react developer", "ui engineer"],
    roles: [
      "Frontend Engineer",
      "Frontend Developer",
      "React Developer",
      "UI Engineer",
      "Software Engineer",
    ],
  },
  {
    aliases: ["backend engineer", "backend developer", "api engineer", "platform engineer"],
    roles: [
      "Backend Engineer",
      "Backend Developer",
      "API Engineer",
      "Platform Engineer",
      "Software Engineer",
    ],
  },
  {
    aliases: ["full stack engineer", "full stack developer", "fullstack engineer", "fullstack developer"],
    roles: [
      "Full Stack Engineer",
      "Full Stack Developer",
      "Software Engineer",
      "Backend Engineer",
      "Frontend Engineer",
    ],
  },
  {
    aliases: ["data engineer", "analytics engineer", "data platform engineer"],
    roles: [
      "Data Engineer",
      "Analytics Engineer",
      "Data Platform Engineer",
      "Software Engineer",
    ],
  },
];

function normalizeRole(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function resolvePackRoles(role: string): string[] {
  const normalized = normalizeRole(role);
  const matched = ROLE_PACKS.find((pack) =>
    pack.aliases.some((alias) => normalized === normalizeRole(alias)),
  );
  return matched ? matched.roles : [role.trim()];
}

export function expandRoleQueries(queries: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const source of queries) {
    const value = source.trim();
    if (!value) continue;

    for (const role of resolvePackRoles(value)) {
      const key = normalizeRole(role);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(role);
    }
  }

  return out;
}

