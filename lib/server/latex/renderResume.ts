import fs from "node:fs";
import path from "node:path";

type CandidateInfo = {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  linkedinText?: string;
  githubUrl?: string;
  githubText?: string;
  websiteUrl?: string;
  websiteText?: string;
};

type SkillsGroup = {
  label: string;
  items: string[];
};

type ExperienceEntry = {
  location: string;
  dates: string;
  title: string;
  company: string;
  bullets: string[];
};

type EducationEntry = {
  location: string;
  dates: string;
  schoolDegree: string;
  detail?: string;
};

type RenderResumeInput = {
  candidate: CandidateInfo;
  summary: string;
  skills: SkillsGroup[];
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  openSourceProjects: string;
  lastUpdated?: string;
};

const TEMPLATE_ROOT = path.join(process.cwd(), "latexTemp", "Resume");

function readTemplate(relPath: string) {
  return fs.readFileSync(path.join(TEMPLATE_ROOT, relPath), "utf-8");
}

function replaceAll(text: string, map: Record<string, string>) {
  let out = text;
  for (const [key, value] of Object.entries(map)) {
    const token = `{{${key}}}`;
    out = out.split(token).join(value);
  }
  return out;
}

function renderSkills(groups: SkillsGroup[]) {
  return groups
    .map((group) => {
      const items = group.items.join(", ");
      return `\\\\textbf{${group.label}:} ${items} \\\\`;
    })
    .join("\n");
}

function renderBullets(items: string[]) {
  return items.map((item) => `\\\\item ${item}`).join("\n");
}

function formatExperienceMeta(location: string, dates: string) {
  const loc = location.trim();
  const when = dates.trim();
  if (loc && when) {
    return `${loc} \\\\ ${when}`;
  }
  return loc || when || "~";
}

function renderExperienceBlock(entry: ExperienceEntry) {
  const meta = formatExperienceMeta(entry.location, entry.dates);
  const header = `\\\\begin{twocolentry}{\n    ${meta}\n}\n  \\\\textbf{${entry.title}} \\\\\n  ${entry.company}\n\\\\end{twocolentry}`;

  if (entry.bullets.length === 0) {
    return header;
  }

  return `${header}\n\n\\\\vspace{0.10 cm}\n\\\\begin{onecolentry}\n\\\\begin{highlights}\n${renderBullets(entry.bullets)}\n\\\\end{highlights}\n\\\\end{onecolentry}`;
}

function renderExperiences(entries: ExperienceEntry[]) {
  return entries
    .map((entry, index) => {
      const spacer = index < entries.length - 1 ? "\n\n\\\\vspace{0.25 cm}\n" : "";
      return `${renderExperienceBlock(entry)}${spacer}`;
    })
    .join("\n");
}

function formatEducationMeta(location: string, dates: string) {
  const loc = location.trim();
  const when = dates.trim();
  if (loc && when) {
    return `${loc} \\\\ ${when}`;
  }
  return loc || when || "~";
}

function renderEducationBlock(entry: EducationEntry) {
  const meta = formatEducationMeta(entry.location, entry.dates);
  const hasDetail = entry.detail?.trim().length;
  const detailLine = hasDetail ? `\n  \\\\textit{${entry.detail}}` : "";
  const detailBreak = hasDetail ? " \\\\" : "";

  return `\\\\begin{twocolentry}{\n    ${meta}\n}\n  \\\\textbf{${entry.schoolDegree}}${detailBreak}${detailLine}\n\\\\end{twocolentry}`;
}

function renderEducation(entries: EducationEntry[]) {
  return entries
    .map((entry, index) => {
      const spacer = index < entries.length - 1 ? "\n\n\\\\vspace{0.1cm}\n" : "";
      return `${renderEducationBlock(entry)}${spacer}`;
    })
    .join("\n");
}

function renderEducationSection(entries: EducationEntry[]) {
  if (entries.length === 0) return "";
  return `\\\\section{Education}\n\\\\vspace{0.1cm}\n\n${renderEducation(entries)}`;
}

function sanitizeRendered(tex: string) {
  return tex
    .replace(/[\uD800-\uDFFF]/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/[\u{1F000}-\u{10FFFF}]/gu, "");
}

export function renderResumeTex(input: RenderResumeInput) {
  const main = readTemplate("main.tex");
  const summary = readTemplate(path.join("sections", "summary.tex"));
  const skills = readTemplate(path.join("sections", "skills.tex"));
  const experience = readTemplate(path.join("sections", "experience.tex"));

  const summaryRendered = replaceAll(summary, {
    SUMMARY: input.summary,
  });

  const skillsRendered = replaceAll(skills, {
    SKILLS: renderSkills(input.skills),
  });

  const experienceRendered = replaceAll(experience, {
    EXPERIENCE_SECTION: renderExperiences(input.experiences),
  });

  const educationRendered = renderEducationSection(input.education);

  const rendered = replaceAll(main, {
    CANDIDATE_NAME: input.candidate.name,
    CANDIDATE_TITLE: input.candidate.title,
    CANDIDATE_EMAIL: input.candidate.email,
    CANDIDATE_PHONE: input.candidate.phone,
    CANDIDATE_LINKEDIN_URL: input.candidate.linkedinUrl ?? "",
    CANDIDATE_LINKEDIN_TEXT: input.candidate.linkedinText ?? "",
    CANDIDATE_GITHUB_URL: input.candidate.githubUrl ?? "",
    CANDIDATE_GITHUB_TEXT: input.candidate.githubText ?? "",
    CANDIDATE_WEBSITE_URL: input.candidate.websiteUrl ?? "",
    CANDIDATE_WEBSITE_TEXT: input.candidate.websiteText ?? "",
    OPEN_SOURCE_PROJECTS: input.openSourceProjects,
    LAST_UPDATED: input.lastUpdated ?? "",
    EDUCATION_SECTION: educationRendered,
  })
    .replace("\\input{sections/summary.tex}", summaryRendered)
    .replace("\\input{sections/skills.tex}", skillsRendered)
    .replace("\\input{sections/experience.tex}", experienceRendered);

  return sanitizeRendered(rendered);
}
