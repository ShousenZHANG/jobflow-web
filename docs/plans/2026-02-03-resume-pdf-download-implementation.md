# Resume PDF Download Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a ¡°Generate PDF¡± button on the Master Resume preview that downloads a PDF rendered from the saved resume profile via an external LaTeX compile service.

**Architecture:** The API route reads the saved ResumeProfile, maps it to the LaTeX template input, generates `.tex`, calls the external compile service, and returns `application/pdf` for download. The UI triggers the API call and downloads the file with loading + toast feedback.

**Tech Stack:** Next.js (App Router), Vercel Serverless API routes, Prisma, Vitest, LaTeX templates in `latexTemp/Resume`.

---

### Task 1: Add API contract tests for resume PDF

**Files:**
- Create: `test/api/resumePdf.test.ts`

**Step 1: Write the failing test**

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const resumeProfileStore = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

vi.mock("@/lib/server/prisma", () => ({
  prisma: {
    resumeProfile: resumeProfileStore,
  },
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/server/latex/renderResume", () => ({
  renderResumeTex: vi.fn(() => "\\documentclass{article}"),
}));

import { getServerSession } from "next-auth/next";
import { POST } from "@/app/api/resume-pdf/route";

const mockPdf = new Uint8Array([37, 80, 68, 70]);

describe("resume pdf api", () => {
  beforeEach(() => {
    resumeProfileStore.findFirst.mockReset();
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns 404 when profile is missing", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    resumeProfileStore.findFirst.mockResolvedValueOnce(null);

    const res = await POST(new Request("http://localhost/api/resume-pdf"));
    expect(res.status).toBe(404);
  });

  it("returns a pdf download when profile exists", async () => {
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    resumeProfileStore.findFirst.mockResolvedValueOnce({
      id: "rp-1",
      userId: "user-1",
      summary: "Hi",
      basics: {
        fullName: "Jane Doe",
        title: "Software Engineer",
        email: "jane@example.com",
        phone: "+1 555 0100",
        location: "Sydney",
      },
      links: [{ label: "LinkedIn", url: "https://linkedin.com/in/jane" }],
      experiences: [
        {
          location: "Sydney",
          dates: "2023-2025",
          title: "Engineer",
          company: "Example Co",
          bullets: ["Built"],
        },
      ],
      projects: [],
      education: [],
      skills: [{ category: "Languages", items: ["TypeScript"] }],
    });

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => mockPdf.buffer,
      headers: new Headers({ "content-type": "application/pdf" }),
    });

    const res = await POST(new Request("http://localhost/api/resume-pdf"));

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toMatch(/attachment/);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- "test/api/resumePdf.test.ts"`

Expected: FAIL (route missing).

**Step 3: Commit the failing test**

```bash
git add test/api/resumePdf.test.ts
git commit -m "test: add resume pdf api contract"
```

---

### Task 2: Add LaTeX mapping + compile helper + API route

**Files:**
- Create: `lib/server/latex/escapeLatex.ts`
- Create: `lib/server/latex/mapResumeProfile.ts`
- Create: `lib/server/latex/compilePdf.ts`
- Create: `app/api/resume-pdf/route.ts`

**Step 1: Implement LaTeX escaping helper**

```ts
export function escapeLatex(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}
```

**Step 2: Implement mapping helper**

```ts
import { escapeLatex } from "./escapeLatex";
import type { ResumeProfile } from "@/lib/generated/prisma";

export function mapResumeProfile(profile: ResumeProfile) {
  const basics = (profile.basics as any) || {};
  const links = (profile.links as any[]) || [];
  const skills = (profile.skills as any[]) || [];
  const experiences = (profile.experiences as any[]) || [];
  const projects = (profile.projects as any[]) || [];
  const education = (profile.education as any[]) || [];

  const findLink = (label: string) =>
    links.find((item) => String(item.label || "").toLowerCase().includes(label));

  const linkedin = findLink("linkedin");
  const github = findLink("github");
  const website = findLink("portfolio") || findLink("website") || links[0];

  const edu1 = education[0] || {};
  const edu2 = education[1] || {};

  const projectBlocks = projects
    .map((proj: any) => {
      const name = escapeLatex(String(proj.name || ""));
      const dates = escapeLatex(String(proj.dates || ""));
      const line = `\\begin{twocolentry}{${escapeLatex("")}}\n  \\textbf{${name}} \\ ${dates}\n\\end{twocolentry}`;
      return line;
    })
    .join("\n\n\\vspace{0.2 cm}\n");

  return {
    candidate: {
      name: escapeLatex(String(basics.fullName || "")),
      title: escapeLatex(String(basics.title || "")),
      email: escapeLatex(String(basics.email || "")),
      phone: escapeLatex(String(basics.phone || "")),
      linkedinUrl: linkedin?.url ? escapeLatex(String(linkedin.url)) : undefined,
      linkedinText: linkedin?.label ? escapeLatex(String(linkedin.label)) : undefined,
      githubUrl: github?.url ? escapeLatex(String(github.url)) : undefined,
      githubText: github?.label ? escapeLatex(String(github.label)) : undefined,
      websiteUrl: website?.url ? escapeLatex(String(website.url)) : undefined,
      websiteText: website?.label ? escapeLatex(String(website.label)) : undefined,
    },
    summary: escapeLatex(String(profile.summary || "")),
    skills: skills.map((group: any) => ({
      label: escapeLatex(String(group.category || "")),
      items: (group.items || []).map((item: string) => escapeLatex(String(item))),
    })),
    experiences: experiences.map((entry: any) => ({
      location: escapeLatex(String(entry.location || "")),
      dates: escapeLatex(String(entry.dates || "")),
      title: escapeLatex(String(entry.title || "")),
      company: escapeLatex(String(entry.company || "")),
      bullets: (entry.bullets || []).map((item: string) => escapeLatex(String(item))),
    })),
    education: {
      edu1Location: escapeLatex(String(edu1.location || "")),
      edu1Dates: escapeLatex(String(edu1.dates || "")),
      edu1SchoolDegree: escapeLatex(String(edu1.school || "")) + " ¡ª " + escapeLatex(String(edu1.degree || "")),
      edu1Detail: escapeLatex(String(edu1.details || "")),
      edu2Location: escapeLatex(String(edu2.location || "")),
      edu2Dates: escapeLatex(String(edu2.dates || "")),
      edu2SchoolDegree: escapeLatex(String(edu2.school || "")) + " ¡ª " + escapeLatex(String(edu2.degree || "")),
    },
    openSourceProjects: projectBlocks || "",
  };
}
```

**Step 3: Implement compile helper**

```ts
export async function compileLatexToPdf(tex: string) {
  const url = process.env.LATEX_RENDER_URL;
  const token = process.env.LATEX_RENDER_TOKEN;
  if (!url || !token) {
    throw new Error("LATEX_RENDER_URL or LATEX_RENDER_TOKEN missing");
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": token,
    },
    body: JSON.stringify({ tex }),
  });
  if (!res.ok) {
    throw new Error(`LATEX_RENDER_FAILED_${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer());
}
```

**Step 4: Implement API route**

```ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getResumeProfile } from "@/lib/server/resumeProfile";
import { renderResumeTex } from "@/lib/server/latex/renderResume";
import { compileLatexToPdf } from "@/lib/server/latex/compilePdf";
import { mapResumeProfile } from "@/lib/server/latex/mapResumeProfile";

export const runtime = "nodejs";

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const profile = await getResumeProfile(userId);
  if (!profile) return NextResponse.json({ error: "NO_PROFILE" }, { status: 404 });

  const input = mapResumeProfile(profile);
  const tex = renderResumeTex(input);
  const pdf = await compileLatexToPdf(tex);

  const today = new Date().toISOString().slice(0, 10);
  const safeName = input.candidate.name.replace(/\s+/g, "-").toLowerCase();
  const filename = `resume-${safeName}-${today}.pdf`;

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename=\"${filename}\"`,
    },
  });
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- "test/api/resumePdf.test.ts"`

Expected: PASS

**Step 6: Commit**

```bash
git add lib/server/latex app/api/resume-pdf/route.ts test/api/resumePdf.test.ts
git commit -m "feat: add resume pdf download api"
```

---

### Task 3: Add ¡°Generate PDF¡± button to Master Resume preview

**Files:**
- Modify: `components/resume/ResumeForm.tsx`
- Modify: `app/(app)/resume/ResumeForm.test.tsx`

**Step 1: Write the failing test**

```ts
it("disables generate pdf when no saved profile", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify({ profile: null }), { status: 200 })),
  );

  render(<ResumeForm />);

  const button = await screen.findByRole("button", { name: "Generate PDF" });
  expect(button).toBeDisabled();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- "app/(app)/resume/ResumeForm.test.tsx"`

Expected: FAIL (button missing).

**Step 3: Implement UI + download handler**

- Add state: `downloading`, `hasSavedProfile`.
- Set `hasSavedProfile` to true when GET `/api/resume-profile` returns profile.
- Set `hasSavedProfile` to true when save succeeds.
- Add Preview button:

```tsx
<Button
  type="button"
  onClick={handleDownload}
  disabled={!hasSavedProfile || downloading}
>
  {downloading ? "Generating..." : "Generate PDF"}
</Button>
```

- Add handler:

```ts
const handleDownload = async () => {
  try {
    setDownloading(true);
    const res = await fetch("/api/resume-pdf", { method: "POST" });
    if (!res.ok) throw new Error("PDF_FAILED");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `resume-${basics.fullName || "resume"}-${new Date().toISOString().slice(0, 10)}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast({ title: "Resume ready", description: "Your PDF has been downloaded." });
  } catch {
    toast({ title: "Download failed", description: "Please try again.", variant: "destructive" });
  } finally {
    setDownloading(false);
  }
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- "app/(app)/resume/ResumeForm.test.tsx"`

Expected: PASS

**Step 5: Commit**

```bash
git add components/resume/ResumeForm.tsx app/(app)/resume/ResumeForm.test.tsx
git commit -m "feat: add generate pdf action"
```

---

### Task 4: Full verification

**Files:**
- None

**Step 1: Run tests**

Run: `npm test`

Expected: PASS

**Step 2: Run lint**

Run: `npm run lint`

Expected: PASS

**Step 3: Run build**

Run: `npm run build`

Expected: PASS

---

## Required Environment Variables
- `LATEX_RENDER_URL` (compile service endpoint)
- `LATEX_RENDER_TOKEN` (API key)

