"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SectionShell } from "../SectionShell";

interface SummarySectionProps {
  summary: string;
  setSummary: (value: string) => void;
  locale: string;
  applyBoldMarkdown: (
    key: string,
    currentValue: string,
    onChange: (nextValue: string) => void,
  ) => void;
  registerMarkdownRef: (
    key: string,
  ) => (element: HTMLInputElement | HTMLTextAreaElement | null) => void;
}

export function SummarySection({
  summary,
  setSummary,
  applyBoldMarkdown,
  registerMarkdownRef,
}: SummarySectionProps) {
  const t = useTranslations("resumeForm");

  return (
    <SectionShell title={t("summary")} description={t("summaryDesc")}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="resume-summary">{t("summary")}</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyBoldMarkdown("summary", summary, setSummary)}
          >
            {t("boldSelected")}
          </Button>
        </div>
        <div className="relative">
          <Textarea
            id="resume-summary"
            ref={registerMarkdownRef("summary")}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={t("summaryPlaceholder")}
            rows={8}
          />
          <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {summary.length}
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
