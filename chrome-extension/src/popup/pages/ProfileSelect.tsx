import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@ext/shared/constants";
import { t } from "@ext/shared/i18n";

interface ProfileInfo {
  profileName: string;
  locale: string;
  flat?: {
    fullName?: string;
    email?: string;
    currentTitle?: string;
  };
}

const SUPPORTED_LOCALES = [
  { value: "en-AU", label: "English (AU)", flag: "🇦🇺" },
  { value: "zh-CN", label: "中文 (CN)", flag: "🇨🇳" },
] as const;

export function ProfileSelect() {
  const [currentLocale, setCurrentLocale] = useState("en-AU");
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback((locale: string) => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { type: "GET_FLAT_PROFILE", locale },
      (response) => {
        setLoading(false);
        if (response?.success && response.data) {
          setProfile(response.data);
        } else {
          setProfile(null);
        }
      },
    );
  }, []);

  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEYS.LOCALE, (result) => {
      const savedLocale = result[STORAGE_KEYS.LOCALE] ?? "en-AU";
      setCurrentLocale(savedLocale);
      loadProfile(savedLocale);
    });
  }, [loadProfile]);

  const handleLocaleChange = useCallback(
    (locale: string) => {
      setCurrentLocale(locale);
      chrome.storage.local.set({ [STORAGE_KEYS.LOCALE]: locale });
      chrome.storage.local.remove(STORAGE_KEYS.CACHED_PROFILE);
      loadProfile(locale);
    },
    [loadProfile],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Locale picker */}
      <div>
        <div className="jl-section-label">{t("profile.locale")}</div>
        <div style={{ display: "flex", gap: 6 }}>
          {SUPPORTED_LOCALES.map(({ value, label }) => {
            const active = currentLocale === value;
            return (
              <button
                key={value}
                onClick={() => handleLocaleChange(value)}
                className={`jl-btn ${active ? "jl-btn--primary" : "jl-btn--outline"}`}
                style={{ flex: 1, height: 36, fontSize: 12, borderRadius: "var(--jl-radius-md)" }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active profile card */}
      <div className="jl-card">
        <div className="jl-section-label" style={{ marginBottom: 10 }}>
          {t("profile.active")}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="jl-skeleton" style={{ width: 120, height: 14 }} />
            <div className="jl-skeleton" style={{ width: 160, height: 12 }} />
            <div className="jl-skeleton" style={{ width: 140, height: 12 }} />
          </div>
        ) : profile ? (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--jl-emerald-50)", color: "var(--jl-emerald-700)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 15, flexShrink: 0,
            }}>
              {(profile.flat?.fullName ?? "?")[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {profile.flat?.fullName ?? "—"}
              </div>
              <div style={{ fontSize: 12, color: "var(--jl-text-secondary)", marginTop: 1 }}>
                {profile.flat?.currentTitle ?? "—"}
              </div>
              <div style={{ fontSize: 11, color: "var(--jl-text-muted)", marginTop: 1 }}>
                {profile.flat?.email ?? "—"} &middot; {profile.profileName}
              </div>
            </div>
          </div>
        ) : (
          <div className="jl-empty" style={{ padding: "16px 0" }}>
            <div className="jl-empty-icon" style={{ width: 36, height: 36, borderRadius: 10 }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ color: "var(--jl-text-muted)" }}>
                <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="jl-empty-desc">{t("profile.noProfile")}</div>
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="jl-card" style={{
        background: "var(--jl-warning-bg)",
        borderColor: "#fde68a",
        padding: 12,
        fontSize: 12,
        color: "#92400e",
        lineHeight: 1.5,
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="8" cy="8" r="7" stroke="#d97706" strokeWidth="1.5"/>
          <path d="M8 5v3.5M8 10.5v.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>{t("profile.manageHint")}</span>
      </div>
    </div>
  );
}
