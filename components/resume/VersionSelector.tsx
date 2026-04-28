"use client";

import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useResumeContext } from "./ResumeContext";

export function VersionSelector() {
  const {
    profiles,
    activeProfileId,
    selectedProfileId,
    setSelectedProfileId,
    profileName,
    setProfileName,
    profileSwitching,
    profileCreating,
    profileDeleting,
    handleCreateProfile,
    handleDeleteProfile,
    handleActivateProfile,
    t,
  } = useResumeContext();

  const isBusy = profileSwitching || profileCreating || profileDeleting;

  const isActiveSelected =
    selectedProfileId !== null && selectedProfileId === activeProfileId;

  return (
    <div className="flex flex-wrap items-center gap-2 pb-3">
      <Label htmlFor="resume-profile-select" className="sr-only">
        {t("resumeVersion")}
      </Label>
      {/* Version pill — design spec ".version-pill". Native select stays
          accessible while the wrapper provides emerald dot + chevron. */}
      <div
        className={`relative inline-flex h-9 min-w-[180px] flex-1 items-center gap-2 rounded-[9px] border border-border bg-card px-3 text-sm shadow-[var(--shadow-xs)] transition-colors ${
          isBusy ? "cursor-wait opacity-60" : "hover:border-border focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40"
        }`}
      >
        <span
          aria-hidden
          className={`h-1.5 w-1.5 shrink-0 rounded-full ring-[3px] ${
            isActiveSelected
              ? "bg-emerald-500 ring-emerald-500/18"
              : "bg-muted-foreground/40 ring-muted-foreground/15"
          }`}
        />
        <select
          id="resume-profile-select"
          value={selectedProfileId ?? ""}
          onChange={(e) => {
            const nextId = e.target.value || null;
            setSelectedProfileId(nextId);
            if (nextId) {
              void handleActivateProfile(nextId);
            }
          }}
          disabled={isBusy}
          className="appearance-none bg-transparent pr-6 text-sm font-semibold text-foreground outline-none disabled:cursor-not-allowed flex-1 min-w-0 truncate"
        >
          {profiles.length === 0 ? (
            <option value="">{t("unsavedVersion")}</option>
          ) : null}
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
              {profile.id === activeProfileId ? ` · ${t("active")}` : ""}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-muted-foreground"
        />
      </div>
      <Input
        id="resume-profile-name"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        maxLength={80}
        placeholder={t("versionNamePlaceholder")}
        disabled={profileDeleting}
        className="hidden h-9 max-w-[200px] flex-1 rounded-[9px] text-sm sm:block"
      />
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void handleCreateProfile("copy")}
          disabled={isBusy}
          className="h-9 gap-1 rounded-[9px] px-2.5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{profileCreating ? t("creating") : t("newVersion")}</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={t("moreVersionActions")}
              disabled={isBusy}
              className="h-9 w-9 rounded-[9px]"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => void handleCreateProfile("copy")}>
              {t("newVersionFromActive")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void handleCreateProfile("blank")}>
              {t("newBlankVersion")}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-rose-600 focus:text-rose-700"
              onSelect={() => void handleDeleteProfile()}
              disabled={profiles.length <= 1 || !selectedProfileId}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("deleteSelectedVersion")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
