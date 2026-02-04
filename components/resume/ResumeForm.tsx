
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type ResumeBasics = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
};

type ResumeLink = {
  label: string;
  url: string;
};

type ResumeExperience = {
  location: string;
  dates: string;
  title: string;
  company: string;
  bullets: string[];
};

type ResumeProject = {
  name: string;
  location: string;
  stack: string;
  dates: string;
  githubUrl: string;
  demoUrl: string;
  links?: { label: string; url: string }[];
  bullets: string[];
};

type ResumeEducation = {
  school: string;
  degree: string;
  location: string;
  dates: string;
  details?: string;
};

type ResumeSkillGroup = {
  category: string;
  label?: string;
  items: string[];
};

type ResumeProfilePayload = {
  basics?: ResumeBasics | null;
  links?: ResumeLink[] | null;
  summary?: string | null;
  experiences?: ResumeExperience[] | null;
  projects?: ResumeProject[] | null;
  education?: ResumeEducation[] | null;
  skills?: ResumeSkillGroup[] | null;
};

const steps = ["Personal info", "Summary", "Experience", "Projects", "Education", "Skills"] as const;

const emptyBasics: ResumeBasics = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
};

const emptyExperience = (): ResumeExperience => ({
  title: "",
  company: "",
  location: "",
  dates: "",
  bullets: [""],
});

const emptyProject = (): ResumeProject => ({
  name: "",
  location: "",
  stack: "",
  dates: "",
  githubUrl: "",
  demoUrl: "",
  bullets: [""],
});

const emptyEducation = (): ResumeEducation => ({
  school: "",
  degree: "",
  location: "",
  dates: "",
  details: "",
});

const emptySkillGroup = (): ResumeSkillGroup => ({
  category: "",
  items: [""],
});

const defaultLinks: ResumeLink[] = [
  { label: "LinkedIn", url: "" },
  { label: "GitHub", url: "" },
  { label: "Portfolio", url: "" },
];

function hasContent(value: string) {
  return value.trim().length > 0;
}

function hasBullets(items: string[]) {
  return items.some((item) => hasContent(item));
}

function normalizeBullets(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

export function ResumeForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewStatus, setPreviewStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewAbortRef = useRef<AbortController | null>(null);

  const [basics, setBasics] = useState<ResumeBasics>(emptyBasics);
  const [links, setLinks] = useState<ResumeLink[]>(defaultLinks);
  const [summary, setSummary] = useState("");
  const [experiences, setExperiences] = useState<ResumeExperience[]>([emptyExperience()]);
  const [projects, setProjects] = useState<ResumeProject[]>([emptyProject()]);
  const [education, setEducation] = useState<ResumeEducation[]>([emptyEducation()]);
  const [skills, setSkills] = useState<ResumeSkillGroup[]>([emptySkillGroup()]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const res = await fetch("/api/resume-profile");
      if (!res.ok) return;
      const json = await res.json();
      if (!active) return;
      const profile = json.profile as ResumeProfilePayload | null;
      if (!profile) return;

      setBasics(profile.basics ?? emptyBasics);

      if (Array.isArray(profile.links) && profile.links.length > 0) {
        setLinks(profile.links);
      } else {
        setLinks(defaultLinks);
      }

      setSummary(profile.summary ?? "");

      if (Array.isArray(profile.experiences) && profile.experiences.length > 0) {
        setExperiences(
          profile.experiences.map((entry) => ({
            title: entry.title ?? "",
            company: entry.company ?? "",
            location: entry.location ?? "",
            dates: entry.dates ?? "",
            bullets:
              Array.isArray(entry.bullets) && entry.bullets.length > 0
                ? entry.bullets
                : [""],
          })),
        );
      }

      if (Array.isArray(profile.projects) && profile.projects.length > 0) {
        setProjects(
          profile.projects.map((entry) => ({
            name: entry.name ?? "",
            location: entry.location ?? "",
            stack: entry.stack ?? (("role" in entry ? (entry as { role?: string }).role : "") ?? ""),
            dates: entry.dates ?? "",
            githubUrl:
              Array.isArray(entry.links)
                ? entry.links.find((link) => link.label?.toLowerCase() === "github")?.url ?? ""
                : "",
            demoUrl:
              Array.isArray(entry.links)
                ? entry.links.find((link) =>
                    ["demo", "live demo"].includes(link.label?.toLowerCase() ?? ""),
                  )?.url ?? ""
                : (("link" in entry ? (entry as { link?: string }).link : "") ?? ""),
            bullets:
              Array.isArray(entry.bullets) && entry.bullets.length > 0
                ? entry.bullets
                : [""],
          })),
        );
      }

      if (Array.isArray(profile.education) && profile.education.length > 0) {
        setEducation(
          profile.education.map((entry) => ({
            school: entry.school ?? "",
            degree: entry.degree ?? "",
            location: entry.location ?? "",
            dates: entry.dates ?? "",
            details: entry.details ?? "",
          })),
        );
      }

      if (Array.isArray(profile.skills) && profile.skills.length > 0) {
        const skillGroups = profile.skills.map((group) => ({
          category: group.category ?? group.label ?? "",
          items:
            Array.isArray(group.items) && group.items.length > 0 ? group.items : [""],
        }));
        setSkills(skillGroups);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
      previewAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const isStepValid = useCallback(
    (stepIndex: number) => {
      if (stepIndex === 0) {
        return (
          hasContent(basics.fullName) &&
          hasContent(basics.title) &&
          hasContent(basics.email) &&
          hasContent(basics.phone)
        );
      }
      if (stepIndex === 1) {
        return hasContent(summary);
      }
      if (stepIndex === 2) {
        return (
          experiences.length > 0 &&
          experiences.every(
            (entry) =>
              hasContent(entry.company) &&
              hasContent(entry.title) &&
              hasContent(entry.location) &&
              hasContent(entry.dates) &&
              hasBullets(entry.bullets),
          )
        );
      }
      if (stepIndex === 3) {
        return (
          projects.length > 0 &&
          projects.every(
            (entry) =>
              hasContent(entry.name) &&
              hasContent(entry.dates) &&
              hasBullets(entry.bullets),
          )
        );
      }
      if (stepIndex === 4) {
        return (
          education.length > 0 &&
          education.every(
            (entry) =>
              hasContent(entry.school) &&
              hasContent(entry.degree) &&
              hasContent(entry.dates),
          )
        );
      }
      if (stepIndex === 5) {
        return (
          skills.length > 0 &&
          skills.every((group) => hasContent(group.category) && hasBullets(group.items))
        );
      }
      return false;
    },
    [basics, summary, experiences, projects, education, skills],
  );

  const maxStep = useMemo(() => {
    let allowed = 0;
    while (allowed < steps.length && isStepValid(allowed)) {
      allowed += 1;
    }
    return allowed;
  }, [isStepValid]);

  const canContinue = isStepValid(currentStep);

  const updateBasics = (field: keyof ResumeBasics, value: string) => {
    setBasics((prev) => ({ ...prev, [field]: value }));
  };

  const updateLink = (index: number, field: keyof ResumeLink, value: string) => {
    setLinks((prev) => prev.map((link, idx) => (idx === index ? { ...link, [field]: value } : link)));
  };

  const addLink = () => {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  };

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateExperience = (
    index: number,
    field: keyof ResumeExperience,
    value: string,
  ) => {
    setExperiences((prev) =>
      prev.map((entry, idx) => (idx === index ? { ...entry, [field]: value } : entry)),
    );
  };

  const addExperience = () => {
    setExperiences((prev) => [...prev, emptyExperience()]);
  };

  const removeExperience = (index: number) => {
    setExperiences((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== index) : prev));
  };

  const updateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
    setExperiences((prev) =>
      prev.map((entry, idx) => {
        if (idx !== expIndex) return entry;
        const bullets = entry.bullets.map((bullet, bIdx) => (bIdx === bulletIndex ? value : bullet));
        return { ...entry, bullets };
      }),
    );
  };

  const addExperienceBullet = (expIndex: number) => {
    setExperiences((prev) =>
      prev.map((entry, idx) =>
        idx === expIndex ? { ...entry, bullets: [...entry.bullets, ""] } : entry,
      ),
    );
  };

  const removeExperienceBullet = (expIndex: number, bulletIndex: number) => {
    setExperiences((prev) =>
      prev.map((entry, idx) => {
        if (idx !== expIndex) return entry;
        const nextBullets = entry.bullets.filter((_, bIdx) => bIdx !== bulletIndex);
        return { ...entry, bullets: nextBullets.length > 0 ? nextBullets : [""] };
      }),
    );
  };

  const updateProject = (index: number, field: keyof ResumeProject, value: string) => {
    setProjects((prev) =>
      prev.map((entry, idx) => (idx === index ? { ...entry, [field]: value } : entry)),
    );
  };

  const addProject = () => {
    setProjects((prev) => [...prev, emptyProject()]);
  };

  const removeProject = (index: number) => {
    setProjects((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== index) : prev));
  };

  const updateProjectBullet = (projIndex: number, bulletIndex: number, value: string) => {
    setProjects((prev) =>
      prev.map((entry, idx) => {
        if (idx !== projIndex) return entry;
        const bullets = entry.bullets.map((bullet, bIdx) => (bIdx === bulletIndex ? value : bullet));
        return { ...entry, bullets };
      }),
    );
  };

  const addProjectBullet = (projIndex: number) => {
    setProjects((prev) =>
      prev.map((entry, idx) =>
        idx === projIndex ? { ...entry, bullets: [...entry.bullets, ""] } : entry,
      ),
    );
  };

  const removeProjectBullet = (projIndex: number, bulletIndex: number) => {
    setProjects((prev) =>
      prev.map((entry, idx) => {
        if (idx !== projIndex) return entry;
        const nextBullets = entry.bullets.filter((_, bIdx) => bIdx !== bulletIndex);
        return { ...entry, bullets: nextBullets.length > 0 ? nextBullets : [""] };
      }),
    );
  };

  const updateEducation = (index: number, field: keyof ResumeEducation, value: string) => {
    setEducation((prev) =>
      prev.map((entry, idx) => (idx === index ? { ...entry, [field]: value } : entry)),
    );
  };

  const addEducation = () => {
    setEducation((prev) => [...prev, emptyEducation()]);
  };

  const removeEducation = (index: number) => {
    setEducation((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== index) : prev));
  };

  const updateSkillGroup = (index: number, field: keyof ResumeSkillGroup, value: string) => {
    setSkills((prev) =>
      prev.map((entry, idx) => (idx === index ? { ...entry, [field]: value } : entry)),
    );
  };

  const updateSkillItem = (groupIndex: number, itemIndex: number, value: string) => {
    setSkills((prev) =>
      prev.map((entry, idx) => {
        if (idx !== groupIndex) return entry;
        const items = entry.items.map((item, iIdx) => (iIdx === itemIndex ? value : item));
        return { ...entry, items };
      }),
    );
  };

  const addSkillGroup = () => {
    setSkills((prev) => [...prev, emptySkillGroup()]);
  };

  const removeSkillGroup = (index: number) => {
    setSkills((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== index) : prev));
  };

  const addSkillItem = (groupIndex: number) => {
    setSkills((prev) =>
      prev.map((entry, idx) =>
        idx === groupIndex ? { ...entry, items: [...entry.items, ""] } : entry,
      ),
    );
  };

  const removeSkillItem = (groupIndex: number, itemIndex: number) => {
    setSkills((prev) =>
      prev.map((entry, idx) => {
        if (idx !== groupIndex) return entry;
        const nextItems = entry.items.filter((_, iIdx) => iIdx !== itemIndex);
        return { ...entry, items: nextItems.length > 0 ? nextItems : [""] };
      }),
    );
  };

  const buildPayload = useCallback(
    (mode: "preview" | "save"): ResumeProfilePayload => {
      const cleanedLinks = links
        .map((link) => ({ label: link.label.trim(), url: link.url.trim() }))
        .filter((link) => link.label || link.url);

      const cleanedExperiences = experiences.map((entry) => ({
        ...entry,
        bullets: normalizeBullets(entry.bullets),
      }));

      const cleanedProjects = projects.map((entry) => {
        const github = entry.githubUrl.trim();
        const demo = entry.demoUrl.trim();
        return {
          ...entry,
          githubUrl: github,
          demoUrl: demo,
          links: [
            github ? { label: "GitHub", url: github } : null,
            demo ? { label: "Live Demo", url: demo } : null,
          ].filter(Boolean) as { label: string; url: string }[],
          bullets: normalizeBullets(entry.bullets),
        };
      });

      const cleanedEducation = education.map((entry) => ({
        ...entry,
        details: entry.details?.trim() ?? "",
      }));

      const cleanedSkills = skills.map((group) => ({
        category: group.category.trim(),
        items: normalizeBullets(group.items),
      }));

      const previewExperiences =
        mode === "preview"
          ? cleanedExperiences.filter(
              (entry) =>
                hasContent(entry.company) &&
                hasContent(entry.title) &&
                hasContent(entry.location) &&
                hasContent(entry.dates),
            )
          : cleanedExperiences;

        const previewProjects =
          mode === "preview"
            ? cleanedProjects.filter((entry) => hasContent(entry.name) && hasContent(entry.dates))
            : cleanedProjects;

      const previewEducation =
        mode === "preview"
          ? cleanedEducation.filter(
              (entry) =>
                hasContent(entry.school) &&
                hasContent(entry.degree) &&
                hasContent(entry.dates),
            )
          : cleanedEducation;

      const previewSkills =
        mode === "preview"
          ? cleanedSkills.filter(
              (group) => hasContent(group.category) && hasBullets(group.items),
            )
          : cleanedSkills;

      return {
        basics,
        links: cleanedLinks.length > 0 ? cleanedLinks : null,
        summary: summary.trim() || null,
        experiences: previewExperiences,
        projects: previewProjects,
        education: previewEducation,
        skills: previewSkills,
      };
    },
    [basics, links, summary, experiences, projects, education, skills],
  );

  const hasAnyContent = useMemo(() => {
    const basicsFilled =
      hasContent(basics.fullName) ||
      hasContent(basics.title) ||
      hasContent(basics.email) ||
      hasContent(basics.phone);
    const linksFilled = links.some((link) => hasContent(link.url));
    const experienceFilled = experiences.some(
      (entry) =>
        hasContent(entry.title) ||
        hasContent(entry.company) ||
        hasContent(entry.location) ||
        hasContent(entry.dates) ||
        hasBullets(entry.bullets),
    );
    const projectsFilled = projects.some(
      (entry) =>
        hasContent(entry.name) ||
        hasContent(entry.stack) ||
        hasContent(entry.location) ||
        hasContent(entry.dates) ||
        hasContent(entry.githubUrl) ||
        hasContent(entry.demoUrl) ||
        hasBullets(entry.bullets),
    );
    const educationFilled = education.some(
      (entry) =>
        hasContent(entry.school) ||
        hasContent(entry.degree) ||
        hasContent(entry.location) ||
        hasContent(entry.dates),
    );
    const skillsFilled = skills.some(
      (group) => hasContent(group.category) || hasBullets(group.items),
    );

    return (
      basicsFilled ||
      linksFilled ||
      hasContent(summary) ||
      experienceFilled ||
      projectsFilled ||
      educationFilled ||
      skillsFilled
    );
  }, [basics, links, summary, experiences, projects, education, skills]);

  const schedulePreview = useCallback(
    (delayMs = 800, openDialog = false) => {
      if (!hasAnyContent) {
        if (openDialog) {
          toast({
            title: "Add details first",
            description: "Fill in at least one section before previewing.",
            variant: "destructive",
          });
        }
        return;
      }
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
      previewAbortRef.current?.abort();

      const payload = buildPayload("preview");
      setPreviewStatus("loading");
      setPreviewError(null);
      if (openDialog) {
        setPreviewOpen(true);
      }

      const runPreview = async (attempt: number) => {
        const controller = new AbortController();
        previewAbortRef.current = controller;
        try {
          const res = await fetch("/api/resume-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });

          if (!res.ok) {
            let message = "Preview failed. Try again.";
            let code: string | undefined;
            if (res.headers.get("content-type")?.includes("application/json")) {
              const json = await res.json().catch(() => null);
              code = json?.error?.code;
              if (code === "LATEX_RENDER_CONFIG_MISSING") {
                message = "Preview service is not configured.";
              } else if (code === "LATEX_RENDER_TIMEOUT") {
                message = "Preview timed out. Retrying...";
              } else if (code === "LATEX_RENDER_UNREACHABLE") {
                message = "Preview service is unavailable.";
              } else if (code === "LATEX_RENDER_FAILED") {
                message = "Preview failed to compile.";
              } else if (code === "NO_PROFILE") {
                message = "Save your resume first to generate a preview.";
              }
            }

            if (attempt === 0 && [502, 503, 504].includes(res.status)) {
              await new Promise((resolve) => setTimeout(resolve, 1200));
              return runPreview(1);
            }

            setPreviewError(message);
            setPreviewStatus("error");
            return;
          }

          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setPdfUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
          setPreviewStatus("ready");
        } catch (err) {
          if ((err as Error).name === "AbortError") return;
          setPreviewError("Preview failed. Try again.");
          setPreviewStatus("error");
        } finally {
          previewAbortRef.current = null;
        }
      };

      previewTimerRef.current = setTimeout(() => {
        runPreview(0);
      }, delayMs);
    },
    [buildPayload, hasAnyContent, toast],
  );

  const handleNext = () => {
    if (!canContinue) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    schedulePreview(0, true);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSave = async () => {
    if (!canContinue) return;
    setSaving(true);

    const payload = buildPayload("save");

    const res = await fetch("/api/resume-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      toast({
        title: "Save failed",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Saved",
      description: "Your master resume has been updated.",
    });
    schedulePreview(0, true);
  };

  const handleOpenPreview = () => {
    schedulePreview(0, true);
    if (hasAnyContent) {
      setPreviewOpen(true);
    }
  };

  const previewUrl = useMemo(() => pdfUrl, [pdfUrl]);

  const renderPreviewFrame = (heightClass: string, framed = true) => (
    <div
      className={
        framed
          ? "relative rounded-lg border border-slate-900/10 bg-white/60 p-2"
          : "relative h-full w-full overflow-hidden rounded-none bg-white"
      }
    >
      {previewUrl ? (
        <iframe
          title="Resume preview"
          src={previewUrl}
          className={
            framed
              ? `${heightClass} w-full rounded-md border border-slate-900/10 bg-white`
              : `${heightClass} w-full`
          }
        />
      ) : (
        <div className={`flex ${heightClass} items-center justify-center text-xs text-muted-foreground`}>
          Click Next or Save to generate a preview.
        </div>
      )}
      {previewStatus === "loading" ? (
        <div
          className={
            framed
              ? "absolute inset-0 flex items-center justify-center rounded-lg bg-white/70 text-xs text-slate-500"
              : "absolute inset-0 flex items-center justify-center bg-white/70 text-xs text-slate-500"
          }
        >
          Generating preview…
        </div>
      ) : null}
      {previewStatus === "error" ? (
        <div
          className={
            framed
              ? "absolute inset-x-2 bottom-2 flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
              : "absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
          }
        >
          <span>{previewError ?? "Preview failed. Try again."}</span>
          <Button type="button" size="sm" variant="outline" onClick={() => schedulePreview(0, true)}>
            Retry
          </Button>
        </div>
          ) : null}
        </div>
      );

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Personal info</h2>
            <p className="text-xs text-muted-foreground">
              Add the core details used across all applications.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resume-full-name">Full name</Label>
              <Input
                id="resume-full-name"
                value={basics.fullName}
                onChange={(event) => updateBasics("fullName", event.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume-title">Title</Label>
              <Input
                id="resume-title"
                value={basics.title}
                onChange={(event) => updateBasics("title", event.target.value)}
                placeholder="Full Stack Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume-email">Email</Label>
              <Input
                id="resume-email"
                value={basics.email}
                onChange={(event) => updateBasics("email", event.target.value)}
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume-phone">Phone</Label>
              <Input
                id="resume-phone"
                value={basics.phone}
                onChange={(event) => updateBasics("phone", event.target.value)}
                placeholder="+61 400 000 000"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Links</h3>
                <p className="text-xs text-muted-foreground">
                  Add LinkedIn, GitHub, or portfolio URLs.
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={addLink}>
                Add link
              </Button>
            </div>
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={`link-${index}`} className="grid gap-3 md:grid-cols-[180px,1fr,auto]">
                  <div className="space-y-2">
                    <Label htmlFor={`link-label-${index}`}>Label</Label>
                    <Input
                      id={`link-label-${index}`}
                      value={link.label}
                      onChange={(event) => updateLink(index, "label", event.target.value)}
                      placeholder="LinkedIn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`link-url-${index}`}>URL</Label>
                    <Input
                      id={`link-url-${index}`}
                      value={link.url}
                      onChange={(event) => updateLink(index, "url", event.target.value)}
                      placeholder="https://"
                    />
                  </div>
                  {links.length > 1 ? (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs text-red-600 hover:text-red-600"
                        onClick={() => removeLink(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Summary</h2>
            <p className="text-xs text-muted-foreground">
              Share a concise summary of your strengths.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-summary">Summary</Label>
            <Textarea
              id="resume-summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Write a concise summary that highlights your strengths."
              rows={5}
            />
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Professional experience</h2>
              <p className="text-xs text-muted-foreground">Add your most recent roles.</p>
            </div>
            <Button type="button" variant="secondary" onClick={addExperience}>
              Add experience
            </Button>
          </div>
          <div className="space-y-5">
            {experiences.map((entry, index) => (
              <div
                key={`exp-${index}`}
                className="space-y-3 rounded-2xl border border-slate-900/10 bg-white/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">Experience {index + 1}</p>
                  {experiences.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs text-red-600 hover:text-red-600"
                      onClick={() => removeExperience(index)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`experience-title-${index}`}>Experience title</Label>
                    <Input
                      id={`experience-title-${index}`}
                      value={entry.title}
                      onChange={(event) => updateExperience(index, "title", event.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`experience-company-${index}`}>Experience company</Label>
                    <Input
                      id={`experience-company-${index}`}
                      value={entry.company}
                      onChange={(event) => updateExperience(index, "company", event.target.value)}
                      placeholder="Example Co"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`experience-location-${index}`}>Experience location</Label>
                    <Input
                      id={`experience-location-${index}`}
                      value={entry.location}
                      onChange={(event) => updateExperience(index, "location", event.target.value)}
                      placeholder="Sydney, Australia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`experience-dates-${index}`}>Experience dates</Label>
                    <Input
                      id={`experience-dates-${index}`}
                      value={entry.dates}
                      onChange={(event) => updateExperience(index, "dates", event.target.value)}
                      placeholder="2023 - 2025"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Experience bullets</Label>
                    <Button type="button" variant="secondary" onClick={() => addExperienceBullet(index)}>
                      Add bullet
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {entry.bullets.map((bullet, bulletIndex) => (
                      <div key={`exp-${index}-bullet-${bulletIndex}`} className="flex gap-2">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`experience-bullet-${index}-${bulletIndex}`}>Experience bullet</Label>
                          <Input
                            id={`experience-bullet-${index}-${bulletIndex}`}
                            value={bullet}
                            onChange={(event) =>
                              updateExperienceBullet(index, bulletIndex, event.target.value)
                            }
                            placeholder="Improved API latency by 35%"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-xs text-slate-500 hover:text-slate-900"
                            onClick={() => removeExperienceBullet(index, bulletIndex)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Projects</h2>
              <p className="text-xs text-muted-foreground">Highlight the most relevant projects.</p>
            </div>
            <Button type="button" variant="secondary" onClick={addProject}>
              Add project
            </Button>
          </div>
          <div className="space-y-5">
            {projects.map((entry, index) => (
              <div
                key={`project-${index}`}
                className="space-y-3 rounded-2xl border border-slate-900/10 bg-white/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">Project {index + 1}</p>
                  {projects.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs text-red-600 hover:text-red-600"
                      onClick={() => removeProject(index)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`project-name-${index}`}>Project name</Label>
                    <Input
                      id={`project-name-${index}`}
                      value={entry.name}
                      onChange={(event) => updateProject(index, "name", event.target.value)}
                      placeholder="Jobflow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`project-location-${index}`}>Project location</Label>
                    <Input
                      id={`project-location-${index}`}
                      value={entry.location}
                      onChange={(event) => updateProject(index, "location", event.target.value)}
                      placeholder="Sydney, Australia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`project-dates-${index}`}>Project dates</Label>
                    <Input
                      id={`project-dates-${index}`}
                      value={entry.dates}
                      onChange={(event) => updateProject(index, "dates", event.target.value)}
                      placeholder="2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`project-stack-${index}`}>Tech stack</Label>
                    <Input
                      id={`project-stack-${index}`}
                      value={entry.stack}
                      onChange={(event) => updateProject(index, "stack", event.target.value)}
                      placeholder="Next.js, TypeScript, Prisma, PostgreSQL"
                    />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`project-github-${index}`}>GitHub URL</Label>
                    <Input
                      id={`project-github-${index}`}
                      value={entry.githubUrl}
                      onChange={(event) => updateProject(index, "githubUrl", event.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`project-demo-${index}`}>Live demo URL</Label>
                    <Input
                      id={`project-demo-${index}`}
                      value={entry.demoUrl}
                      onChange={(event) => updateProject(index, "demoUrl", event.target.value)}
                      placeholder="https://"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Project bullets</Label>
                    <Button type="button" variant="secondary" onClick={() => addProjectBullet(index)}>
                      Add bullet
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {entry.bullets.map((bullet, bulletIndex) => (
                      <div key={`project-${index}-bullet-${bulletIndex}`} className="flex gap-2">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`project-bullet-${index}-${bulletIndex}`}>Project bullet</Label>
                          <Input
                            id={`project-bullet-${index}-${bulletIndex}`}
                            value={bullet}
                            onChange={(event) =>
                              updateProjectBullet(index, bulletIndex, event.target.value)
                            }
                            placeholder="Launched a new workflow"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-xs text-slate-500 hover:text-slate-900"
                            onClick={() => removeProjectBullet(index, bulletIndex)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Education</h2>
              <p className="text-xs text-muted-foreground">List your most relevant education.</p>
            </div>
            <Button type="button" variant="secondary" onClick={addEducation}>
              Add education
            </Button>
          </div>
          <div className="space-y-5">
            {education.map((entry, index) => (
              <div
                key={`education-${index}`}
                className="space-y-3 rounded-2xl border border-slate-900/10 bg-white/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">Education {index + 1}</p>
                  {education.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs text-red-600 hover:text-red-600"
                      onClick={() => removeEducation(index)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`education-school-${index}`}>School</Label>
                    <Input
                      id={`education-school-${index}`}
                      value={entry.school}
                      onChange={(event) => updateEducation(index, "school", event.target.value)}
                      placeholder="University of Example"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`education-degree-${index}`}>Degree</Label>
                    <Input
                      id={`education-degree-${index}`}
                      value={entry.degree}
                      onChange={(event) => updateEducation(index, "degree", event.target.value)}
                      placeholder="Master of IT"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`education-location-${index}`}>Location</Label>
                    <Input
                      id={`education-location-${index}`}
                      value={entry.location}
                      onChange={(event) => updateEducation(index, "location", event.target.value)}
                      placeholder="Sydney, Australia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`education-dates-${index}`}>Dates</Label>
                    <Input
                      id={`education-dates-${index}`}
                      value={entry.dates}
                      onChange={(event) => updateEducation(index, "dates", event.target.value)}
                      placeholder="2023 - 2025"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`education-details-${index}`}>Details (optional)</Label>
                  <Input
                    id={`education-details-${index}`}
                    value={entry.details ?? ""}
                    onChange={(event) => updateEducation(index, "details", event.target.value)}
                    placeholder="WAM 80/100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Skills</h2>
            <p className="text-xs text-muted-foreground">Group skills by category.</p>
          </div>
          <Button type="button" variant="secondary" onClick={addSkillGroup}>
            Add group
          </Button>
        </div>
        <div className="space-y-5">
          {skills.map((group, index) => (
            <div
              key={`skill-${index}`}
              className="space-y-3 rounded-2xl border border-slate-900/10 bg-white/70 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">Group {index + 1}</p>
                {skills.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-xs text-red-600 hover:text-red-600"
                    onClick={() => removeSkillGroup(index)}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`skill-label-${index}`}>Category</Label>
                <Input
                  id={`skill-label-${index}`}
                    value={group.category}
                      onChange={(event) => updateSkillGroup(index, "category", event.target.value)}
                  placeholder="Frontend"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Items</Label>
                  <Button type="button" variant="secondary" onClick={() => addSkillItem(index)}>
                    Add item
                  </Button>
                </div>
                <div className="space-y-2">
                  {group.items.map((item, itemIndex) => (
                    <div key={`skill-${index}-item-${itemIndex}`} className="flex gap-2">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`skill-item-${index}-${itemIndex}`}>Skill item</Label>
                        <Input
                          id={`skill-item-${index}-${itemIndex}`}
                          value={item}
                          onChange={(event) => updateSkillItem(index, itemIndex, event.target.value)}
                          placeholder="React"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-xs text-slate-500 hover:text-slate-900"
                          onClick={() => removeSkillItem(index, itemIndex)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          className="h-[92vh] w-[98vw] max-w-[min(98vw,1280px)] overflow-hidden p-0"
          showCloseButton={false}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>PDF preview</DialogTitle>
            <DialogDescription>Refreshes after Next or Save.</DialogDescription>
          </DialogHeader>
          <div className="flex h-full flex-col">
            <div className="flex h-11 items-center justify-end border-b border-slate-900/10 bg-white/90 px-3">
              <DialogClose asChild>
                <Button type="button" variant="ghost" size="sm">
                  Close
                </Button>
              </DialogClose>
            </div>
            <div className="flex-1 bg-white">
              {renderPreviewFrame("h-full", false)}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isAvailable = index <= maxStep;
          return (
            <button
              key={step}
              type="button"
              onClick={() => (isAvailable ? setCurrentStep(index) : null)}
              disabled={!isAvailable}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600"
              } ${!isAvailable ? "opacity-50" : "hover:border-emerald-300"}`}
            >
              {step}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-6">
        {renderStep()}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
            Back
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenPreview}
            disabled={!hasAnyContent}
          >
            Preview
          </Button>
        </div>
        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={handleNext} disabled={!canContinue}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={!canContinue || saving} className="edu-cta edu-cta--press">
            {saving ? "Saving..." : "Save master resume"}
          </Button>
        )}
      </div>
    </div>
  );
}




