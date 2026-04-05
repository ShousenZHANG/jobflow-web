export type ExperienceRequirementSignal = {
  key: string;
  label: string;
  evidence: string;
  minYears: number;
  isRequired: boolean;
};

const EXPERIENCE_SOFT_RE = /\b(preferred|nice to have|nice-to-have|bonus|desired|a plus)\b/i;
const EXPERIENCE_HARD_RE =
  /\b(require|required|requirements|qualification|qualifications|minimum|at least|must have|must-have|must be)\b/i;
const EXPERIENCE_CONTEXT_RE =
  /\b(experience|exp|in (software|engineering|frontend|backend|full stack|development|devops|data|product|role|position|industry|field))\b/i;
const COMPANY_TENURE_RE =
  /\b(for|over|more than|around|about|nearly|almost|since)\b.*\b(company|startup|business|organisation|organization|team|firm|history|founded)\b/i;

export function parseExperienceGate(description: string): ExperienceRequirementSignal[] {
  if (!description) return [];
  const normalized = description.replace(/\u2013|\u2014/g, "-").replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const segments = normalized
    .split(/[\n.;]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const output: ExperienceRequirementSignal[] = [];
  const seen = new Set<string>();

  const emit = (
    label: string,
    minYears: number,
    segment: string,
    isRequired: boolean,
  ) => {
    const key = `${label.toLowerCase()}|${isRequired ? "required" : "preferred"}`;
    if (seen.has(key)) return;
    seen.add(key);
    output.push({
      key,
      label: `${isRequired ? "Required" : "Preferred"}: ${label}`,
      evidence: segment,
      minYears,
      isRequired,
    });
  };

  for (const segment of segments) {
    const lower = segment.toLowerCase();
    if (COMPANY_TENURE_RE.test(lower) && !EXPERIENCE_CONTEXT_RE.test(lower)) continue;

    const soft = EXPERIENCE_SOFT_RE.test(lower);
    const hard = EXPERIENCE_HARD_RE.test(lower);
    const hasExperienceContext = EXPERIENCE_CONTEXT_RE.test(lower);
    if (!hasExperienceContext && !hard && !soft) continue;

    let matched = false;

    const rangeMatch = segment.match(/\b(\d{1,2})\s*(?:-|to)\s*(\d{1,2})\s*(?:years?|yrs?)\b/i);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (Number.isFinite(start) && Number.isFinite(end)) {
        const minYears = Math.min(start, end);
        const maxYears = Math.max(start, end);
        emit(`${minYears}-${maxYears} years`, minYears, segment, hard && !soft);
        matched = true;
      }
    }

    const plusMatch = segment.match(/\b(\d{1,2})\s*\+\s*(?:years?|yrs?)\b/i);
    if (plusMatch) {
      const years = Number(plusMatch[1]);
      if (Number.isFinite(years)) {
        emit(`${years}+ years`, years, segment, hard && !soft);
        matched = true;
      }
    }

    if (!matched) {
      const plainMatch = segment.match(
        /\b(\d{1,2})\s*(?:years?|yrs?)\b(?:\s*(?:of|in))?\s*(?:\w+\s+){0,3}(?:experience|exp|role|position|industry|field)\b/i,
      );
      if (plainMatch) {
        const years = Number(plainMatch[1]);
        if (Number.isFinite(years)) {
          emit(`${years}+ years`, years, segment, hard && !soft);
        }
      }
    }
  }

  return output
    .sort((a, b) => {
      if (a.isRequired !== b.isRequired) return a.isRequired ? -1 : 1;
      return b.minYears - a.minYears;
    })
    .slice(0, 4);
}
