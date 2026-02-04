import fs from "node:fs";
import path from "node:path";
import { escapeLatex, escapeLatexWithBold } from "./escapeLatex";

type CoverCandidate = {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedinUrl?: string;
  linkedinText?: string;
};

type RenderCoverLetterInput = {
  candidate: CoverCandidate;
  company: string;
  role: string;
  paragraphOne: string;
  paragraphTwo: string;
  paragraphThree: string;
};

const TEMPLATE_ROOT = path.join(process.cwd(), "latexTemp", "Cover_letter");

function readTemplate(relPath: string) {
  return fs.readFileSync(path.join(TEMPLATE_ROOT, relPath), "utf-8");
}

function replaceAll(text: string, map: Record<string, string>) {
  let out = text;
  for (const [key, value] of Object.entries(map)) {
    const token = `{${key}}`;
    out = out.split(token).join(value);
  }
  return out;
}

function normalizeLine(value: string, fallback = "-") {
  const text = value.trim();
  return text ? text : fallback;
}

export function renderCoverLetterTex(input: RenderCoverLetterInput) {
  const main = readTemplate("resume.tex");
  const content = readTemplate("content.tex");

  const renderedContent = replaceAll(content, {
    CANDIDATE_NAME: normalizeLine(escapeLatex(input.candidate.name)),
    CANDIDATE_TITLE: normalizeLine(escapeLatex(input.candidate.title)),
    CANDIDATE_PHONE: normalizeLine(escapeLatex(input.candidate.phone)),
    CANDIDATE_EMAIL: normalizeLine(escapeLatex(input.candidate.email)),
    CANDIDATE_LINKEDIN_URL: normalizeLine(escapeLatex(input.candidate.linkedinUrl || "#"), "#"),
    CANDIDATE_LINKEDIN_TEXT: normalizeLine(
      escapeLatex(input.candidate.linkedinText || "LinkedIn"),
      "LinkedIn",
    ),
    COVER_COMPANY: normalizeLine(escapeLatex(input.company)),
    COVER_ROLE: normalizeLine(escapeLatex(input.role)),
    COVER_BODY: escapeLatexWithBold(input.paragraphOne),
    COVER_P2: escapeLatexWithBold(input.paragraphTwo),
    COVER_P3: escapeLatexWithBold(input.paragraphThree),
  });

  return main.replace("\\input{content}", renderedContent);
}
