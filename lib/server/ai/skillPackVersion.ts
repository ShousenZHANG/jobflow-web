export const CURRENT_PACK_VERSION = "2.0.0";

export type ChangelogEntry = {
  version: string;
  date: string;
  changes: string[];
};

export const PACK_CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.0.0",
    date: "2026-03-31",
    changes: [
      "Redesigned skill pack with categorized rules and XML-tagged prompts",
      "Added self-validation quality gates (9 resume + 9 cover checks)",
      "Added zh-CN locale support with Chinese tone rules",
      "Switched default format from tar.gz to ZIP",
      "Added realistic full examples with annotated walkthroughs",
      "Added platform-specific import notes (Claude Projects, Custom GPTs, Gemini)",
      "Structured rules by category (grounding, structure, content, style, ats, coverage, locale) with priority levels",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-02-06",
    changes: [
      "Initial skill pack release with flat rule arrays",
      "tar.gz format with SKILL.md, rules, prompts, schemas",
      "en-AU locale only",
    ],
  },
];

/**
 * Compare two semantic version strings.
 * Returns: negative if a < b, 0 if equal, positive if a > b.
 */
export function compareVersions(a: string, b: string): number {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const a_i = partsA[i] ?? 0;
    const b_i = partsB[i] ?? 0;
    if (Number.isNaN(a_i) || Number.isNaN(b_i)) return 0;
    const diff = a_i - b_i;
    if (diff !== 0) return diff;
  }
  return 0;
}

/**
 * Check if a pack version is outdated compared to the current version.
 */
export function isPackOutdated(packVersion: string): boolean {
  return compareVersions(packVersion, CURRENT_PACK_VERSION) < 0;
}
