
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
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
import { useGuide } from "@/app/GuideContext";

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
  links: ResumeLink[];
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
  itemsText: string;
};

type ResumeSkillPayload = {
  category: string;
  items: string[];
};

type ResumeProfilePayload = {
  basics?: ResumeBasics | null;
  links?: ResumeLink[] | null;
  summary?: string | null;
  experiences?: ResumeExperience[] | null;
  projects?: ResumeProject[] | null;
  education?: ResumeEducation[] | null;
  skills?: ResumeSkillPayload[] | null;
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
  links: [{ label: "", url: "" }],
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
  itemsText: "",
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

function normalizeCommaItems(text: string) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ResumeForm() {
  const { toast } = useToast();
  const { isTaskHighlighted, markTaskComplete } = useGuide();
  const guideHighlightClass =
    "ring-2 ring-emerald-400 ring-offset-2 ring-offset-white shadow-[0_0_0_4px_rgba(16,185,129,0.18)]";
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
  const [expandedExperienceIndex, setExpandedExperienceIndex] = useState(0);
  const [expandedProjectIndex, setExpandedProjectIndex] = useState(0);
  const markdownRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});

  const registerMarkdownRef =
    (key: string) => (element: HTMLInputElement | HTMLTextAreaElement | null) => {
      markdownRefs.current[key] = element;
    };

  const applyBoldMarkdown = useCallback(
    (
      key: string,
      currentValue: string,
      onChange: (nextValue: string) => void,
    ) => {
      const field = markdownRefs.current[key];
      const start = field?.selectionStart ?? currentValue.length;
      const end = field?.selectionEnd ?? currentValue.length;
      const before = currentValue.slice(0, start);
      const selected = currentValue.slice(start, end);
      const after = currentValue.slice(end);
      const wrapped = `**${selected || "keyword"}**`;
      const nextValue = `${before}${wrapped}${after}`;
      const selectionStart = before.length + 2;
      const selectionEnd = selectionStart + (selected || "keyword").length;

      onChange(nextValue);
      requestAnimationFrame(() => {
        const nextField = markdownRefs.current[key];
        if (!nextField) return;
        nextField.focus();
        nextField.setSelectionRange(selectionStart, selectionEnd);
      });
    },
    [],
  );

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
            links:
              Array.isArray(entry.links) && entry.links.length > 0
                ? entry.links.map((link) => ({
                    label: link.label ?? "",
                    url: link.url ?? "",
                  }))
                : (("link" in entry && (entry as { link?: string }).link
                    ? [{ label: "Link", url: (entry as { link?: string }).link ?? "" }]
                    : [{ label: "", url: "" }]) as ResumeLink[]),
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
        const skillGroups = profile.skills.map((group) => {
          const source = group as { category?: string; label?: string; items?: string[] };
          return {
            category: source.category ?? source.label ?? "",
            itemsText:
              Array.isArray(source.items) && source.items.length > 0
                ? source.items.join(", ")
                : "",
          };
        });
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
          skills.every(
            (group) =>
              hasContent(group.category) && normalizeCommaItems(group.itemsText).length > 0,
          )
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
  const currentStepLabel = steps[currentStep];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const stepMeta = useMemo(
    () =>
      steps.map((label, index) => {
        const status = index === currentStep ? "current" : index < maxStep ? "complete" : "upcoming";
        return {
          label,
          index,
          status,
          available: index <= maxStep,
        };
      }),
    [currentStep, maxStep],
  );

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
    setExperiences((prev) => {
      const next = [...prev, emptyExperience()];
      setExpandedExperienceIndex(next.length - 1);
      return next;
    });
  };

  const removeExperience = (index: number) => {
    setExperiences((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((_, idx) => idx !== index);
      setExpandedExperienceIndex((current) => {
        if (current === index) return Math.max(0, index - 1);
        if (current > index) return current - 1;
        return current;
      });
      return next;
    });
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

  const updateProjectLink = (
    projectIndex: number,
    linkIndex: number,
    field: keyof ResumeLink,
    value: string,
  ) => {
    setProjects((prev) =>
      prev.map((entry, idx) => {
        if (idx !== projectIndex) return entry;
        const links = entry.links.map((link, lIdx) =>
          lIdx === linkIndex ? { ...link, [field]: value } : link,
        );
        return { ...entry, links };
      }),
    );
  };

  const addProjectLink = (projectIndex: number) => {
    setProjects((prev) =>
      prev.map((entry, idx) =>
        idx === projectIndex ? { ...entry, links: [...entry.links, { label: "", url: "" }] } : entry,
      ),
    );
  };

  const removeProjectLink = (projectIndex: number, linkIndex: number) => {
    setProjects((prev) =>
      prev.map((entry, idx) => {
        if (idx !== projectIndex) return entry;
        const links = entry.links.filter((_, lIdx) => lIdx !== linkIndex);
        return { ...entry, links: links.length > 0 ? links : [{ label: "", url: "" }] };
      }),
    );
  };

  const addProject = () => {
    setProjects((prev) => {
      const next = [...prev, emptyProject()];
      setExpandedProjectIndex(next.length - 1);
      return next;
    });
  };

  const removeProject = (index: number) => {
    setProjects((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((_, idx) => idx !== index);
      setExpandedProjectIndex((current) => {
        if (current === index) return Math.max(0, index - 1);
        if (current > index) return current - 1;
        return current;
      });
      return next;
    });
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

  const addSkillGroup = () => {
    setSkills((prev) => [...prev, emptySkillGroup()]);
  };

  const removeSkillGroup = (index: number) => {
    setSkills((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== index) : prev));
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
        const cleanedLinks = entry.links
          .map((link) => ({ label: link.label.trim(), url: link.url.trim() }))
          .filter((link) => link.label && link.url);

        return {
          name: entry.name.trim(),
          location: entry.location.trim(),
          stack: entry.stack.trim(),
          dates: entry.dates.trim(),
          links: cleanedLinks,
          bullets: normalizeBullets(entry.bullets),
        };
      });

      const cleanedEducation = education.map((entry) => ({
        ...entry,
        details: entry.details?.trim() ?? "",
      }));

      const cleanedSkills = skills.map((group) => ({
        category: group.category.trim(),
        items: normalizeCommaItems(group.itemsText),
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
              (group) => hasContent(group.category) && group.items.length > 0,
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
        entry.links.some((link) => hasContent(link.label) || hasContent(link.url)) ||
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
      (group) => hasContent(group.category) || hasContent(group.itemsText),
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
    markTaskComplete("resume_setup");
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
            <p className="text-sm text-muted-foreground">
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
                <p className="text-sm text-muted-foreground">
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
            <p className="text-sm text-muted-foreground">
              Share a concise summary of your strengths.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="resume-summary">Summary</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => applyBoldMarkdown("summary", summary, setSummary)}
              >
                Bold selected
              </Button>
            </div>
            <Textarea
              id="resume-summary"
              ref={registerMarkdownRef("summary")}
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
              <p className="text-sm text-muted-foreground">Add your most recent roles.</p>
            </div>
            <Button type="button" variant="secondary" onClick={addExperience}>
              Add experience
            </Button>
          </div>
          <div className="space-y-5">
            {experiences.map((entry, index) => (
              <details
                key={`exp-${index}`}
                open={expandedExperienceIndex === index}
                onToggle={(event) => {
                  if ((event.currentTarget as HTMLDetailsElement).open) {
                    setExpandedExperienceIndex(index);
                  }
                }}
                className="rounded-2xl border border-slate-900/10 bg-white/70 p-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-1 py-1">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Experience {index + 1}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {entry.title || entry.company ? `${entry.title || "Untitled"} · ${entry.company || "Company"}` : "Draft"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {experiences.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs text-red-600 hover:text-red-600"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          removeExperience(index);
                        }}
                      >
                        Remove
                      </Button>
                    ) : null}
                    {expandedExperienceIndex === index ? (
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                </summary>
                <div className="space-y-3 pt-3">
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
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`experience-bullet-${index}-${bulletIndex}`}>Experience bullet</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  applyBoldMarkdown(
                                    `exp-bullet-${index}-${bulletIndex}`,
                                    bullet,
                                    (next) => updateExperienceBullet(index, bulletIndex, next),
                                  )
                                }
                              >
                                Bold selected
                              </Button>
                            </div>
                            <Input
                              id={`experience-bullet-${index}-${bulletIndex}`}
                              ref={registerMarkdownRef(`exp-bullet-${index}-${bulletIndex}`)}
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
              </details>
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
              <p className="text-sm text-muted-foreground">Highlight the most relevant projects.</p>
            </div>
            <Button type="button" variant="secondary" onClick={addProject}>
              Add project
            </Button>
          </div>
          <div className="space-y-5">
            {projects.map((entry, index) => (
              <details
                key={`project-${index}`}
                open={expandedProjectIndex === index}
                onToggle={(event) => {
                  if ((event.currentTarget as HTMLDetailsElement).open) {
                    setExpandedProjectIndex(index);
                  }
                }}
                className="rounded-2xl border border-slate-900/10 bg-white/70 p-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-1 py-1">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Project {index + 1}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {entry.name ? `${entry.name}${entry.stack ? ` · ${entry.stack}` : ""}` : "Draft"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {projects.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs text-red-600 hover:text-red-600"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          removeProject(index);
                        }}
                      >
                        Remove
                      </Button>
                    ) : null}
                    {expandedProjectIndex === index ? (
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                </summary>
                <div className="space-y-3 pt-3">
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Project links (optional)</Label>
                      <Button type="button" variant="secondary" onClick={() => addProjectLink(index)}>
                        Add link
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {entry.links.map((link, linkIndex) => (
                        <div
                          key={`project-${index}-link-${linkIndex}`}
                          className="grid gap-2 md:grid-cols-[1fr_2fr_auto]"
                        >
                          <Input
                            value={link.label}
                            onChange={(event) =>
                              updateProjectLink(index, linkIndex, "label", event.target.value)
                            }
                            placeholder="GitHub / Live Demo / Case Study"
                          />
                          <Input
                            value={link.url}
                            onChange={(event) =>
                              updateProjectLink(index, linkIndex, "url", event.target.value)
                            }
                            placeholder="https://"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-xs text-slate-500 hover:text-slate-900"
                            onClick={() => removeProjectLink(index, linkIndex)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
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
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`project-bullet-${index}-${bulletIndex}`}>Project bullet</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  applyBoldMarkdown(
                                    `project-bullet-${index}-${bulletIndex}`,
                                    bullet,
                                    (next) => updateProjectBullet(index, bulletIndex, next),
                                  )
                                }
                              >
                                Bold selected
                              </Button>
                            </div>
                            <Input
                              id={`project-bullet-${index}-${bulletIndex}`}
                              ref={registerMarkdownRef(`project-bullet-${index}-${bulletIndex}`)}
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
              </details>
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
              <p className="text-sm text-muted-foreground">List your most relevant education.</p>
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
            <p className="text-sm text-muted-foreground">Group skills by category.</p>
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
              <div className="space-y-2">
                <Label htmlFor={`skill-items-${index}`}>Items (comma-separated)</Label>
                <Input
                  id={`skill-items-${index}`}
                  value={group.itemsText}
                  onChange={(event) => updateSkillGroup(index, "itemsText", event.target.value)}
                  placeholder="React, Next.js, TypeScript, Tailwind CSS"
                />
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

      <div className="space-y-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-6 lg:space-y-0">
        <aside className="hidden lg:block lg:sticky lg:top-20">
          <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Resume setup</p>
            <p className="mt-1 text-sm text-slate-700">
              Step {currentStep + 1} of {steps.length}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <nav className="mt-4 space-y-2">
              {stepMeta.map((step) => (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => (step.available ? setCurrentStep(step.index) : null)}
                  disabled={!step.available}
                  aria-current={step.status === "current" ? "step" : undefined}
                  className={`flex min-h-11 w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                    step.status === "current"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : step.status === "complete"
                        ? "border-emerald-200 bg-emerald-50/50 text-slate-700"
                        : "border-slate-200 bg-white text-slate-500"
                  } ${!step.available ? "opacity-50" : "hover:border-emerald-300"}`}
                >
                  <span>{step.label}</span>
                  <span className="text-xs">
                    {step.status === "complete" ? "Done" : step.status === "current" ? "Now" : ""}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 lg:hidden">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isAvailable = index <= maxStep;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => (isAvailable ? setCurrentStep(index) : null)}
                  disabled={!isAvailable}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm transition ${
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

          <div className="rounded-2xl border border-slate-900/10 bg-white/70 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Current step</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-slate-900">{currentStepLabel}</p>
              <p className="text-xs text-slate-500">
                {currentStep + 1}/{steps.length}
              </p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="min-h-[540px] rounded-2xl border border-slate-900/10 bg-white/70 p-6">
            {renderStep()}
          </div>

          <div className="sticky bottom-3 z-20 rounded-2xl border border-slate-900/10 bg-white/95 p-3 shadow-sm backdrop-blur">
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
                <Button
                  onClick={handleSave}
                  disabled={!canContinue || saving}
                  className={`edu-cta edu-cta--press ${
                    isTaskHighlighted("resume_setup") ? guideHighlightClass : ""
                  }`}
                  data-guide-highlight={isTaskHighlighted("resume_setup") ? "true" : "false"}
                >
                  {saving ? "Saving..." : "Save master resume"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




