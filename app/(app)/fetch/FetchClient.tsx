"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

type FetchRunStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";

const DEFAULT_QUERIES = [
  '"software engineer"',
  '"software developer"',
  '"java developer"',
  '"full stack developer"',
  '"backend developer"',
  '"frontend developer"',
  '"web developer"',
  '"AI engineer"',
  '"junior software engineer"',
  '"junior java developer"',
  '"graduate software engineer"',
  '"graduate developer"',
  '"entry level software engineer"',
  '"junior full stack developer"',
  '"junior backend developer"',
  '"software intern"',
  '"software engineering intern"',
  '"developer intern"',
  '"software internship"',
  '"part time software developer"',
  '"part time software engineer"',
  '"part-time developer"',
  '"contract software developer"',
  '"contract engineer"',
  '"mid level software engineer"',
  '"mid level java developer"',
  '"mid level full stack developer"',
  '"mid level backend developer"',
];

export function FetchClient() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const [location, setLocation] = useState("Sydney, New South Wales, Australia");
  const [hoursOld, setHoursOld] = useState(48);
  const [resultsWanted, setResultsWanted] = useState(100);
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
    "work_rights",
    "security_clearance",
    "no_sponsorship",
    "exp_3",
    "exp_4",
    "exp_5",
    "exp_7",
  ]);

  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchRunStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasActiveRun, setHasActiveRun] = useState(false);

  const queries = useMemo(() => {
    return jobTitle.trim() ? [jobTitle.trim()] : [];
  }, [jobTitle]);

  const isManualDisabled = selectedQueries.length > 0;
  const isMultiDisabled = jobTitle.trim().length > 0;
  const queriesSummary =
    selectedQueries.length === 0
      ? "Select job titles"
      : `${selectedQueries.length} selected`;

  function getErrorMessage(err: unknown, fallback = "Failed") {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return fallback;
  }

  async function createRun() {
    const hasPresets = selectedQueries.length > 0;
    const res = await fetch("/api/fetch-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(hasPresets ? { queries: selectedQueries } : { title: jobTitle.trim(), queries }),
        location,
        hoursOld,
        resultsWanted,
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

  async function fetchRun(id: string) {
    const res = await fetch(`/api/fetch-runs/${id}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to fetch run");
    return json.run as { status: FetchRunStatus; importedCount: number; error: string | null };
  }

  useEffect(() => {
    if (!runId) return;
    let alive = true;
    const t = setInterval(async () => {
      try {
        const r = await fetchRun(runId);
        if (!alive) return;
        setStatus(r.status);
        setError(r.error ?? null);
        if (r.status === "SUCCEEDED") {
          clearInterval(t);
        }
        if (r.status === "FAILED") {
          clearInterval(t);
        }
      } catch (e: unknown) {
        if (!alive) return;
        setError(getErrorMessage(e, "Polling failed"));
      }
    }, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [runId]);

  useEffect(() => {
    const stored = localStorage.getItem("jobflow_fetch_run_id");
    if (!stored) {
      setHasActiveRun(false);
      return;
    }
    setHasActiveRun(true);
    if (!runId) {
      setRunId(stored);
    }
  }, [runId]);

  async function onSubmit() {
    setIsSubmitting(true);
    setError(null);
    try {
      const hasManual = jobTitle.trim().length > 0;
      const hasPresets = selectedQueries.length > 0;
      if (!hasManual && !hasPresets) {
        throw new Error("Please enter a job title or choose presets.");
      }
      if (hasManual && hasPresets) {
        throw new Error("Please use manual input or presets, not both.");
      }
      const id = await createRun();
      setRunId(id);
      setStatus("QUEUED");
      localStorage.setItem("jobflow_fetch_run_id", id);
      localStorage.setItem("jobflow_fetch_started_at", String(Date.now()));
      setHasActiveRun(true);
      window.dispatchEvent(new Event("jobflow-fetch-started"));
      await triggerRun(id);
      setStatus("RUNNING");
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  const isRunning = status === "RUNNING" || status === "QUEUED" || hasActiveRun;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Fetch jobs</h1>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Job title (manual)</Label>
            <Input
              placeholder="e.g. Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isManualDisabled}
            />
            {isManualDisabled ? (
              <div className="text-xs text-muted-foreground">
                Manual input is disabled when you select presets.
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>Job title presets</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                  disabled={isMultiDisabled}
                >
                  {queriesSummary}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-80 w-[320px] overflow-auto">
                <div className="flex items-center justify-between px-2 py-1.5 text-xs text-muted-foreground">
                  <button
                    type="button"
                    className="rounded px-2 py-1 hover:bg-muted"
                    onClick={() => setSelectedQueries(DEFAULT_QUERIES)}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    className="rounded px-2 py-1 hover:bg-muted"
                    onClick={() => setSelectedQueries([])}
                  >
                    Clear all
                  </button>
                </div>
                {DEFAULT_QUERIES.map((query) => (
                  <DropdownMenuCheckboxItem
                    key={query}
                    checked={selectedQueries.includes(query)}
                    onCheckedChange={(checked) => {
                      setSelectedQueries((prev) =>
                        checked
                          ? Array.from(new Set([...prev, query]))
                          : prev.filter((value) => value !== query),
                      );
                    }}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {query}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {isMultiDisabled ? (
              <div className="text-xs text-muted-foreground">
                Presets are disabled when manual input has a value.
              </div>
            ) : null}
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
          <div className="space-y-2">
            <Label>Results wanted</Label>
            <Select value={String(resultsWanted)} onValueChange={(v) => setResultsWanted(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[20, 50, 80, 100, 150, 200].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} results
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exclusions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Apply exclusions</div>
              <div className="text-xs text-muted-foreground">
                Toggle title and description filters.
              </div>
            </div>
            <Switch checked={applyExcludes} onCheckedChange={setApplyExcludes} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Exclude title terms (dropdown)</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between" disabled={!applyExcludes}>
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
              <div className="text-xs text-muted-foreground">Exclude description rules (dropdown)</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between" disabled={!applyExcludes}>
                    {excludeDescriptionRules.length
                      ? `Selected (${excludeDescriptionRules.length})`
                      : "Select rules"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                  {[
                    { value: "work_rights", label: "Work rights / PR required" },
                    { value: "security_clearance", label: "Security clearance" },
                    { value: "no_sponsorship", label: "No sponsorship" },
                    { value: "exp_3", label: "Experience 3+ years" },
                    { value: "exp_4", label: "Experience 4+ years" },
                    { value: "exp_5", label: "Experience 5+ years" },
                    { value: "exp_7", label: "Experience 7+ years" },
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

      <div className="flex items-center gap-3">
        <Button onClick={onSubmit} disabled={isSubmitting || isRunning}>
          {isSubmitting ? "Starting..." : "Start fetch"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/jobs")}>
          View jobs
        </Button>
      </div>
    </div>
  );
}

