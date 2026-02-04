"use client";

import { useEffect, useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  DEFAULT_COVER_RULES,
  DEFAULT_CV_RULES,
} from "@/lib/shared/aiPromptDefaults";

type AiPromptProfilePayload = {
  cvRules: string[];
  coverRules: string[];
};

function joinRules(rules: string[]) {
  return rules.join("\n");
}

function parseRules(text: string) {
  return text
    .split("\n")
    .map((rule) => rule.trim())
    .filter(Boolean);
}

export function AiRulesForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvRulesText, setCvRulesText] = useState(joinRules(DEFAULT_CV_RULES));
  const [coverRulesText, setCoverRulesText] = useState(joinRules(DEFAULT_COVER_RULES));

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/ai-prompt-profile");
        if (!res.ok) return;
        const json = await res.json();
        if (!active) return;
        const profile = json.profile as AiPromptProfilePayload | null;
        if (profile?.cvRules?.length) {
          setCvRulesText(joinRules(profile.cvRules));
        }
        if (profile?.coverRules?.length) {
          setCoverRulesText(joinRules(profile.coverRules));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const parsedCvRules = useMemo(() => parseRules(cvRulesText), [cvRulesText]);
  const parsedCoverRules = useMemo(() => parseRules(coverRulesText), [coverRulesText]);

  const handleSave = async () => {
    if (parsedCvRules.length === 0 || parsedCoverRules.length === 0) {
      toast({
        title: "Add at least one rule per section.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/ai-prompt-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvRules: parsedCvRules,
          coverRules: parsedCoverRules,
        }),
      });

      if (!res.ok) {
        toast({
          title: "Save failed",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Rules updated." });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setCvRulesText(joinRules(DEFAULT_CV_RULES));
    setCoverRulesText(joinRules(DEFAULT_COVER_RULES));
    toast({ title: "Defaults restored." });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cv-rules">CV Rules (one rule per line)</Label>
        <Textarea
          id="cv-rules"
          value={cvRulesText}
          onChange={(event) => setCvRulesText(event.target.value)}
          rows={10}
          placeholder="Add one rule per line"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cover-rules">Cover Letter Rules (one rule per line)</Label>
        <Textarea
          id="cover-rules"
          value={coverRulesText}
          onChange={(event) => setCoverRulesText(event.target.value)}
          rows={10}
          placeholder="Add one rule per line"
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{loading ? "Loading..." : "Changes apply to future generations."}</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResetDefaults}
            disabled={saving || loading}
          >
            Restore defaults
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving || loading}>
            {saving ? "Saving..." : "Save rules"}
          </Button>
        </div>
      </div>
    </div>
  );
}
