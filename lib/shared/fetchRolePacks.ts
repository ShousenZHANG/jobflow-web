import rolePackConfig from "@/lib/shared/fetchRolePacks.config.json";

type RolePackDefinition = {
  aliases: string[];
  roles: string[];
};

function normalizeRole(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function tokenizeRole(value: string) {
  const normalized = normalizeRole(value);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function normalizeRolePacks(raw: unknown): RolePackDefinition[] {
  if (!Array.isArray(raw)) return [];
  const out: RolePackDefinition[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const aliases = toStringArray((item as { aliases?: unknown }).aliases);
    const roles = toStringArray((item as { roles?: unknown }).roles);
    if (!aliases.length || !roles.length) continue;
    out.push({ aliases, roles });
  }
  return out;
}

const ROLE_PACKS = normalizeRolePacks((rolePackConfig as { rolePacks?: unknown }).rolePacks);
const GENERIC_TOKENS = new Set(
  toStringArray((rolePackConfig as { genericTokens?: unknown }).genericTokens).map(normalizeRole),
);

function packTokenIndex(pack: RolePackDefinition) {
  const tokens = new Set<string>();
  for (const alias of pack.aliases) {
    for (const token of tokenizeRole(alias)) {
      tokens.add(token);
    }
  }
  return tokens;
}

function resolvePackRoles(role: string): string[] {
  const normalized = normalizeRole(role);
  const trimmed = role.trim();
  const matched = ROLE_PACKS.find((pack) =>
    pack.aliases.some((alias) => normalized === normalizeRole(alias)),
  );
  if (matched) return matched.roles;

  // L2: relaxed alias matching ("software engineer java" should still match software pack).
  const partialMatches = ROLE_PACKS.filter((pack) =>
    pack.aliases.some((alias) => {
      const normalizedAlias = normalizeRole(alias);
      return normalized.includes(normalizedAlias) || normalizedAlias.includes(normalized);
    }),
  );
  if (partialMatches.length) {
    return [
      trimmed,
      ...partialMatches.flatMap((pack) => pack.roles),
    ];
  }

  // L3: token overlap fallback for long-tail variants ("java engineer", "react typescript engineer").
  const queryTokens = new Set(tokenizeRole(normalized));
  const querySignalTokens = [...queryTokens].filter((token) => !GENERIC_TOKENS.has(token));
  if (!querySignalTokens.length) return [trimmed];

  const scored = ROLE_PACKS.map((pack) => {
    const packTokens = packTokenIndex(pack);
    const overlap = querySignalTokens.filter((token) => packTokens.has(token)).length;
    return { pack, overlap };
  })
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap);

  if (!scored.length) return [trimmed];

  const bestOverlap = scored[0]?.overlap ?? 0;
  const selected = scored
    .filter((entry) => entry.overlap === bestOverlap)
    .slice(0, 2)
    .map((entry) => entry.pack);

  return [trimmed, ...selected.flatMap((pack) => pack.roles)];
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
