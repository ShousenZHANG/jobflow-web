import { escapeLatex, escapeLatexWithBold } from "./escapeLatex";

type NullableRecord = Record<string, unknown> | null | undefined;

type ResumeProfileLike = {
  summary?: string | null;
  basics?: NullableRecord;
  links?: unknown;
  skills?: unknown;
  experiences?: unknown;
  projects?: unknown;
  education?: unknown;
};

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function toStringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function formatSchoolDegree(schoolRaw: unknown, degreeRaw: unknown) {
  const school = escapeLatex(toStringValue(schoolRaw)).trim();
  const degree = escapeLatex(toStringValue(degreeRaw)).trim();
  if (school && degree) return `${school} -- ${degree}`;
  return school || degree || "";
}

function formatEduLocationDates(locationRaw: unknown, datesRaw: unknown) {
  const location = escapeLatex(toStringValue(locationRaw)).trim();
  const dates = escapeLatex(toStringValue(datesRaw)).trim();
  return {
    location: location || "~",
    dates,
  };
}

export function mapResumeProfile(profile: ResumeProfileLike) {
  const basics = asRecord(profile.basics as NullableRecord);
  const links = asArray(profile.links) as Record<string, unknown>[];
  const skills = asArray(profile.skills) as Record<string, unknown>[];
  const experiences = asArray(profile.experiences) as Record<string, unknown>[];
  const projects = asArray(profile.projects) as Record<string, unknown>[];
  const education = asArray(profile.education) as Record<string, unknown>[];

  const findLink = (label: string) =>
    links.find((item) =>
      toStringValue(item.label).toLowerCase().includes(label),
    );

  const linkedin = findLink("linkedin");
  const github = findLink("github");
  const website = findLink("portfolio") || findLink("website") || links[0];

  const edu1 = education[0] ?? {};
  const edu2 = education[1] ?? {};
  const edu1LocationDates = formatEduLocationDates(
    (edu1 as Record<string, unknown>).location,
    (edu1 as Record<string, unknown>).dates,
  );
  const edu2LocationDates = formatEduLocationDates(
    (edu2 as Record<string, unknown>).location,
    (edu2 as Record<string, unknown>).dates,
  );

  const projectBlocks = projects
    .map((proj) => {
      const name = escapeLatex(toStringValue(proj.name));
      const dates = escapeLatex(toStringValue(proj.dates));
      const line = `\\begin{twocolentry}{${escapeLatex("")}}\n  \\textbf{${name}} \\ ${dates}\n\\end{twocolentry}`;
      return line;
    })
    .join("\n\n\\vspace{0.2 cm}\n");

  return {
    candidate: {
      name: escapeLatex(toStringValue(basics.fullName)),
      title: escapeLatex(toStringValue(basics.title)),
      email: escapeLatex(toStringValue(basics.email)),
      phone: escapeLatex(toStringValue(basics.phone)),
      linkedinUrl: linkedin?.url ? escapeLatex(toStringValue(linkedin.url)) : undefined,
      linkedinText: linkedin?.label ? escapeLatex(toStringValue(linkedin.label)) : undefined,
      githubUrl: github?.url ? escapeLatex(toStringValue(github.url)) : undefined,
      githubText: github?.label ? escapeLatex(toStringValue(github.label)) : undefined,
      websiteUrl: website?.url ? escapeLatex(toStringValue(website.url)) : undefined,
      websiteText: website?.label ? escapeLatex(toStringValue(website.label)) : undefined,
    },
    summary: escapeLatexWithBold(toStringValue(profile.summary)),
    skills: skills.map((group) => ({
      label: escapeLatex(toStringValue((group as Record<string, unknown>).category) || toStringValue((group as Record<string, unknown>).label)),
      items: asArray(group.items).map((item) => escapeLatex(toStringValue(item))),
    })),
    experiences: experiences.map((entry) => ({
      location: escapeLatex(toStringValue(entry.location)),
      dates: escapeLatex(toStringValue(entry.dates)),
      title: escapeLatex(toStringValue(entry.title)),
      company: escapeLatex(toStringValue(entry.company)),
      bullets: asArray(entry.bullets).map((item) => escapeLatexWithBold(toStringValue(item))),
    })),
    education: {
      edu1Location: edu1LocationDates.location,
      edu1Dates: edu1LocationDates.dates,
      edu1SchoolDegree: formatSchoolDegree(
        (edu1 as Record<string, unknown>).school,
        (edu1 as Record<string, unknown>).degree,
      ),
      edu1Detail: escapeLatex(toStringValue((edu1 as Record<string, unknown>).details)),
      edu2Location: edu2LocationDates.location,
      edu2Dates: edu2LocationDates.dates,
      edu2SchoolDegree: formatSchoolDegree(
        (edu2 as Record<string, unknown>).school,
        (edu2 as Record<string, unknown>).degree,
      ),
    },
    openSourceProjects: projectBlocks || "",
  };
}





