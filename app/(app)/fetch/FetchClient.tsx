"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { useFetchStatus } from "@/app/FetchStatusContext";
import { useGuide } from "@/app/GuideContext";

const COMMON_TITLES = [
  "Software Engineer",
  "Software Developer",
  "Frontend Engineer",
  "Frontend Developer",
  "Backend Engineer",
  "Backend Developer",
  "Full Stack Engineer",
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "TypeScript Developer",
  "Python Developer",
  "Java Developer",
  "Go Developer",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "QA Engineer",
  "Automation Engineer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Cloud Engineer",
  "Data Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  "Product Engineer",
  "Security Engineer",
  "Platform Engineer",
];

export function FetchClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [location, setLocation] = useState("Sydney, New South Wales, Australia");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [hoursOld, setHoursOld] = useState(48);
  const [smartExpand, setSmartExpand] = useState(true);
  const [applyExcludes, setApplyExcludes] = useState(true);
  const [excludeTitleTerms, setExcludeTitleTerms] = useState<string[]>([
    "senior",
    "lead",
    "principal",
    "staff",
    "manager",
    "director",
    "head",
    "architect",
  ]);
  const [excludeDescriptionRules, setExcludeDescriptionRules] = useState<string[]>([
    "identity_requirement",
  ]);

  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    startRun,
    status: globalStatus,
    runId: globalRunId,
    error: globalError,
  } = useFetchStatus();
  const { isTaskHighlighted, markTaskComplete } = useGuide();
  const guideHighlightClass =
    "ring-2 ring-emerald-400 ring-offset-2 ring-offset-white shadow-[0_0_0_4px_rgba(16,185,129,0.18)]";
  const prevUserIdRef = useRef<string | null>(null);

  const queries = useMemo(() => {
    const parts = jobTitle
      .split(/[\n,|]/)
      .map((part) => part.trim())
      .filter(Boolean);
    return Array.from(new Set(parts));
  }, [jobTitle]);

  const suggestionQuery = useMemo(() => {
    const segments = jobTitle.split(/[\n,|]/);
    return (segments.at(-1) ?? "").trim().toLowerCase();
  }, [jobTitle]);
  const suggestionMode = suggestionQuery.length < 2 ? "Popular" : "Suggestions";
  const suggestions = useMemo(() => {
    if (suggestionQuery.length < 2) {
      return COMMON_TITLES.slice(0, 12);
    }
    return COMMON_TITLES.filter((title) =>
      title.toLowerCase().includes(suggestionQuery),
    ).slice(0, 12);
  }, [suggestionQuery]);

  useEffect(() => {
    const prev = prevUserIdRef.current;
    if (prev && prev !== userId) {
      setLocalError(null);
      setIsSubmitting(false);
    }
    prevUserIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    const raw = localStorage.getItem("jobflow.fetch.preferences");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        title?: string;
        location?: string;
        hoursOld?: number;
        smartExpand?: boolean;
      };
      if (parsed.title) setJobTitle(parsed.title);
      if (parsed.location) setLocation(parsed.location);
      if (parsed.hoursOld) setHoursOld(parsed.hoursOld);
      if (typeof parsed.smartExpand === "boolean") setSmartExpand(parsed.smartExpand);
    } catch {
      // ignore invalid local preference payload
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "jobflow.fetch.preferences",
      JSON.stringify({
        title: jobTitle,
        location,
        hoursOld,
        smartExpand,
      }),
    );
  }, [jobTitle, location, hoursOld, smartExpand]);

  function getErrorMessage(err: unknown, fallback = "Failed") {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return fallback;
  }

  async function createRun() {
    const res = await fetch("/api/fetch-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: queries[0] ?? jobTitle.trim(),
        queries,
        location,
        hoursOld,
        smartExpand,
        applyExcludes,
        excludeTitleTerms,
        excludeDescriptionRules,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to create run");
    return json.id as string;
  }

  async function triggerRun(id: string) {
    const res = await fetch(`/api/fetch-runs/${id}/trigger`, { method: "POST" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to trigger run");
  }

  async function onSubmit() {
    setIsSubmitting(true);
    setLocalError(null);
    try {
      if (!queries.length) {
        throw new Error("Please enter at least one job title to search.");
      }
      const id = await createRun();
      startRun(id);
      await triggerRun(id);
      markTaskComplete("first_fetch");
    } catch (e: unknown) {
      setLocalError(getErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeError = localError ?? globalError;
  const isRunning =
    globalRunId !== null &&
    (globalStatus === "RUNNING" || globalStatus === "QUEUED" || globalStatus === null);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Search roles</h1>
      </div>

      {activeError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {activeError}
        </div>
      ) : null}

      <Card className="rounded-3xl border-2 border-slate-900/10 bg-white/80 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition-shadow duration-200 ease-out hover:shadow-[0_26px_55px_-40px_rgba(15,23,42,0.4)]">
        <CardContent className="grid gap-4 p-5 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Job title</Label>
            <Popover open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
              <PopoverAnchor asChild>
                <Input
                  placeholder="e.g. Software Engineer, Frontend Engineer | Backend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onFocus={() => {
                    setSuggestionsOpen(true);
                  }}
                  onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
                />
              </PopoverAnchor>
              <PopoverContent
                align="start"
                className="w-[var(--radix-popover-trigger-width)] p-0"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command shouldFilter={false}>
                  <CommandList className="max-h-64 p-1">
                    {suggestions.length ? (
                      <CommandGroup heading={suggestionMode}>
                        {suggestions.map((item) => (
                          <CommandItem
                            key={item}
                            value={item}
                            onSelect={(value) => {
                              const segments = jobTitle.split(/[\n,|]/);
                              const prefix = segments.slice(0, -1).map((part) => part.trim()).filter(Boolean);
                              setJobTitle([...prefix, value].join(", "));
                              setSuggestionsOpen(false);
                            }}
                          >
                            {item}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>No suggestions found.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Smart fetch can auto-expand one title to related roles. You can still separate multiple
              titles with comma or <code>|</code>.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Hours old</Label>
            <Select value={String(hoursOld)} onValueChange={(v) => setHoursOld(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 6, 12, 24, 48, 72].map((h) => (
                  <SelectItem key={h} value={String(h)}>
                    {h} hours
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-2 border-slate-900/10 bg-white/80 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition-shadow duration-200 ease-out hover:shadow-[0_26px_55px_-40px_rgba(15,23,42,0.4)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Smart role coverage</div>
              <div className="text-xs text-muted-foreground">
                Expand one title to related role variants automatically.
              </div>
            </div>
            <Switch checked={smartExpand} onCheckedChange={setSmartExpand} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Apply exclusions</div>
              <div className="text-xs text-muted-foreground">
                Remove seniority and work-rights restricted roles.
              </div>
            </div>
            <Switch checked={applyExcludes} onCheckedChange={setApplyExcludes} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Title exclusions</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-between rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-none transition-colors hover:bg-slate-50 disabled:opacity-50"
                    disabled={!applyExcludes}
                  >
                    {excludeTitleTerms.length ? `Selected (${excludeTitleTerms.length})` : "Select terms"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {[
                    { value: "senior", label: "Senior" },
                    { value: "lead", label: "Lead" },
                    { value: "principal", label: "Principal" },
                    { value: "staff", label: "Staff" },
                    { value: "manager", label: "Manager" },
                    { value: "director", label: "Director" },
                    { value: "head", label: "Head" },
                    { value: "architect", label: "Architect" },
                  ].map((opt) => {
                    const checked = excludeTitleTerms.includes(opt.value);
                    return (
                      <DropdownMenuCheckboxItem
                        key={opt.value}
                        checked={checked}
                        onSelect={(e) => e.preventDefault()}
                        onCheckedChange={(value) => {
                          setExcludeTitleTerms((prev) =>
                            value
                              ? [...prev, opt.value]
                              : prev.filter((v) => v !== opt.value),
                          );
                        }}
                      >
                        {opt.label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Description exclusions</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-between rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-none transition-colors hover:bg-slate-50 disabled:opacity-50"
                    disabled={!applyExcludes}
                  >
                    {excludeDescriptionRules.length
                      ? `Selected (${excludeDescriptionRules.length})`
                      : "Select rules"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                  {[
                    { value: "identity_requirement", label: "PR/Citizen requirement" },
                  ].map((opt) => {
                    const checked = excludeDescriptionRules.includes(opt.value);
                    return (
                      <DropdownMenuCheckboxItem
                        key={opt.value}
                        checked={checked}
                        onSelect={(e) => e.preventDefault()}
                        onCheckedChange={(value) => {
                          setExcludeDescriptionRules((prev) =>
                            value
                              ? [...prev, opt.value]
                              : prev.filter((v) => v !== opt.value),
                          );
                        }}
                      >
                        {opt.label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center" data-testid="fetch-actions">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || isRunning}
          className={`h-10 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:brightness-105 active:scale-[0.98] disabled:opacity-50 sm:w-auto ${
            isTaskHighlighted("first_fetch") ? guideHighlightClass : ""
          }`}
          data-guide-highlight={isTaskHighlighted("first_fetch") ? "true" : "false"}
          data-guide-anchor="first_fetch"
        >
          {isSubmitting ? "Starting..." : "Start fetch"}
        </Button>
        <Button
          variant="outline"
          className="h-10 w-full rounded-xl border-2 border-slate-700 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-800 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] sm:w-auto"
          onClick={() => router.push("/jobs")}
        >
          View jobs
        </Button>
      </div>
    </div>
  );
}
