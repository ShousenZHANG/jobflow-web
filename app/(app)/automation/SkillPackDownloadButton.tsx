"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const SKILL_PACK_ENDPOINT = "/api/prompt-rules/skill-pack";
const FALLBACK_FILENAME = "jobflow-skill-pack.tar.gz";

function filenameFromDisposition(contentDisposition: string | null): string {
  if (!contentDisposition) return FALLBACK_FILENAME;
  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }
  const asciiMatch = /filename="?([^"]+)"?/i.exec(contentDisposition);
  return asciiMatch?.[1] || FALLBACK_FILENAME;
}

export default function SkillPackDownloadButton() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch(SKILL_PACK_ENDPOINT, { cache: "no-store" });
      if (!res.ok) {
        let message = "Failed to download skill pack";
        try {
          const json = await res.json();
          if (typeof json?.error === "string") message = json.error;
          if (typeof json?.error?.message === "string") message = json.error.message;
        } catch {}
        throw new Error(message);
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const filename = filenameFromDisposition(res.headers.get("content-disposition"));
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to download skill pack");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" size="sm" onClick={handleDownload} disabled={downloading}>
        <Download className="h-4 w-4" />
        {downloading ? "Downloading..." : "Download Skill Pack"}
      </Button>
      {error ? (
        <p role="alert" className="text-xs text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
