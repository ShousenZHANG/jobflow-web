"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ResumeExperiencePayload = {
  location: string;
  dates: string;
  title: string;
  company: string;
  bullets: string[];
};

type ResumeProfilePayload = {
  summary?: string | null;
  skills?: string[] | null;
  experiences?: ResumeExperiencePayload[] | null;
};

export function ResumeForm() {
  const { toast } = useToast();
  const [summary, setSummary] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [experiences, setExperiences] = useState<ResumeExperiencePayload[]>([
    { title: "", company: "", location: "", dates: "", bullets: [] },
  ]);
  const [experienceBulletsText, setExperienceBulletsText] = useState<string[]>([
    "",
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const res = await fetch("/api/resume-profile");
      if (!res.ok) return;
      const json = await res.json();
      if (!active) return;
      const profile = json.profile as ResumeProfilePayload | null;
      setSummary(profile?.summary ?? "");
      setSkillsText((profile?.skills ?? []).join(", "));
      const loadedExperiences = profile?.experiences ?? [];
      if (loadedExperiences.length > 0) {
        setExperiences(loadedExperiences);
        setExperienceBulletsText(
          loadedExperiences.map((entry) => entry.bullets.join("\n")),
        );
      } else {
        setExperiences([{ title: "", company: "", location: "", dates: "", bullets: [] }]);
        setExperienceBulletsText([""]);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const updateExperience = (
    index: number,
    field: keyof ResumeExperiencePayload,
    value: string,
  ) => {
    setExperiences((prev) =>
      prev.map((entry, idx) => (idx === index ? { ...entry, [field]: value } : entry)),
    );
  };

  const updateExperienceBullets = (index: number, value: string) => {
    setExperienceBulletsText((prev) =>
      prev.map((entry, idx) => (idx === index ? value : entry)),
    );
  };

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      { title: "", company: "", location: "", dates: "", bullets: [] },
    ]);
    setExperienceBulletsText((prev) => [...prev, ""]);
  };

  const removeExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, idx) => idx !== index));
    setExperienceBulletsText((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const experiencesPayload = experiences
      .map((entry, index) => {
        const bullets = experienceBulletsText[index]
          .split("\n")
          .map((bullet) => bullet.trim())
          .filter(Boolean);
        return {
          ...entry,
          bullets,
        };
      })
      .filter((entry) => {
        const hasFields =
          entry.title.trim() ||
          entry.company.trim() ||
          entry.location.trim() ||
          entry.dates.trim();
        return Boolean(hasFields || entry.bullets.length);
      });
    const payload: ResumeProfilePayload = {
      summary: summary.trim() || null,
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      experiences: experiencesPayload.length > 0 ? experiencesPayload : null,
    };
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
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="resume-summary">Summary</Label>
        <Textarea
          id="resume-summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="Write a concise summary that highlights your strengths."
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resume-skills">Skills</Label>
        <Input
          id="resume-skills"
          value={skillsText}
          onChange={(event) => setSkillsText(event.target.value)}
          placeholder="React, TypeScript, Node.js"
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Experience</h2>
            <p className="text-xs text-muted-foreground">Add your most recent roles.</p>
          </div>
          <Button type="button" variant="secondary" onClick={addExperience}>
            Add experience
          </Button>
        </div>
        <div className="space-y-5">
          {experiences.map((entry, index) => (
            <div key={`exp-${index}`} className="space-y-3 rounded-2xl border border-slate-900/10 bg-white/70 p-4">
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
              <div className="space-y-2">
                <Label htmlFor={`experience-bullets-${index}`}>Experience bullets</Label>
                <Textarea
                  id={`experience-bullets-${index}`}
                  value={experienceBulletsText[index]}
                  onChange={(event) => updateExperienceBullets(index, event.target.value)}
                  placeholder={"Built scalable job search features\nImproved API latency by 35%"}
                  rows={4}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={handleSave} disabled={saving} className="edu-cta edu-cta--press">
        {saving ? "Saving..." : "Save master resume"}
      </Button>
    </div>
  );
}
