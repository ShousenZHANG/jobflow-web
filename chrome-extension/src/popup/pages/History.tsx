import { useState, useEffect } from "react";
import { t } from "@ext/shared/i18n";

interface SubmissionRecord {
  id: string;
  pageDomain: string;
  pageUrl: string;
  atsProvider: string;
  formSignature: string;
  fieldCount: number;
  filledCount: number;
  createdAt: string;
}

const ATS_CHIP_CLASS: Record<string, string> = {
  greenhouse: "jl-ats-chip--greenhouse",
  lever: "jl-ats-chip--lever",
  workday: "jl-ats-chip--workday",
  icims: "jl-ats-chip--icims",
  successfactors: "jl-ats-chip--successfactors",
};

function getAtsChipClass(provider: string): string {
  return ATS_CHIP_CLASS[provider.toLowerCase()] ?? "jl-ats-chip--generic";
}

export function History() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: "GET_SUBMISSIONS", params: { limit: 50 } },
      (response) => {
        setLoading(false);
        if (response?.success && Array.isArray(response.data)) {
          setSubmissions(response.data);
        }
      },
    );
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="jl-card" style={{ padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div className="jl-skeleton" style={{ width: 140, height: 14 }} />
              <div className="jl-skeleton" style={{ width: 60, height: 18, borderRadius: 999 }} />
            </div>
            <div className="jl-skeleton" style={{ width: 180, height: 11 }} />
          </div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="jl-empty">
        <div className="jl-empty-icon">
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="1.5" width="12" height="13" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
            <path d="M5 5h6M5 8h4" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="jl-empty-title">{t("history.empty")}</div>
        <div className="jl-empty-desc">{t("history.emptyDesc")}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="jl-section-label">
        {submissions.length} {t("history.title").toLowerCase()}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {submissions.map((sub) => (
          <SubmissionCard key={sub.id} submission={sub} />
        ))}
      </div>
    </div>
  );
}

function SubmissionCard({ submission }: { submission: SubmissionRecord }) {
  const timeAgo = getRelativeTime(new Date(submission.createdAt));
  const fillRatio = submission.fieldCount > 0
    ? Math.round((submission.filledCount / submission.fieldCount) * 100)
    : 0;

  return (
    <div className="jl-card" style={{ padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{
          fontWeight: 600, fontSize: 13, color: "var(--jl-text-primary)",
          maxWidth: 190, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {submission.pageDomain}
        </div>
        <span className={`jl-ats-chip ${getAtsChipClass(submission.atsProvider)}`}>
          {submission.atsProvider}
        </span>
      </div>

      {/* Mini progress bar */}
      <div className="jl-progress" style={{ marginBottom: 6 }}>
        <div
          className="jl-progress-bar"
          style={{
            width: `${fillRatio}%`,
            background: fillRatio >= 80 ? "var(--jl-emerald-500)" : fillRatio >= 50 ? "var(--jl-warning)" : "var(--jl-error)",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--jl-text-muted)" }}>
        <span>
          {t("history.fieldsFilled", {
            filled: submission.filledCount,
            total: submission.fieldCount,
          })}
        </span>
        <span>{timeAgo}</span>
      </div>
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
