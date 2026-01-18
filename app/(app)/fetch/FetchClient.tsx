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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type FetchRunStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";

export function FetchClient() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [location, setLocation] = useState("Sydney, New South Wales, Australia");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
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

  useEffect(() => {
    const q = jobTitle.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }
    const controller = new AbortController();
    setSuggestionsLoading(true);
    setSuggestionsError(null);
    const t = setTimeout(() => {
      fetch(`/api/jobs/suggestions?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((json) => {
          setSuggestions(Array.isArray(json?.suggestions) ? json.suggestions : []);
          setSuggestionsOpen(true);
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setSuggestionsError(getErrorMessage(err, "Failed to load suggestions"));
          setSuggestionsOpen(true);
        })
        .finally(() => setSuggestionsLoading(false));
    }, 200);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [jobTitle]);

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
        title: jobTitle.trim(),
        queries,
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
      if (!jobTitle.trim()) {
        throw new Error("Please enter one job title to search.");
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
            <Label>Job title</Label>
            <div className="relative">
              <Command className="w-full">
                <CommandInput
                  placeholder="e.g. Software Engineer"
                  value={jobTitle}
                  onValueChange={setJobTitle}
                  onFocus={() => {
                    if (jobTitle.trim().length >= 2) setSuggestionsOpen(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setSuggestionsOpen(false), 150);
                  }}
                />
                {suggestionsOpen ? (
                  <CommandList className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-sm">
                    {suggestionsLoading ? (
                      <CommandEmpty>Loading suggestions...</CommandEmpty>
                    ) : suggestionsError ? (
                      <CommandEmpty>{suggestionsError}</CommandEmpty>
                    ) : suggestions.length ? (
                      <CommandGroup heading="Suggestions">
                        {suggestions.map((item) => (
                          <CommandItem
                            key={item}
                            value={item}
                            onSelect={(value) => {
                              setJobTitle(value);
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
                ) : null}
              </Command>
            </div>
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

