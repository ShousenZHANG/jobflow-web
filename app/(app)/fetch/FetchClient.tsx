"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FetchRunStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";

export function FetchClient() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [location, setLocation] = useState("Sydney, New South Wales, Australia");
  const [hoursOld, setHoursOld] = useState(48);
  const [resultsWanted, setResultsWanted] = useState(120);
  const [applyExcludes, setApplyExcludes] = useState(true);
  const [excludeTitleTerms, setExcludeTitleTerms] = useState<string[]>([
    "senior",
    "lead",
  ]);
  const [excludeDescriptionRules, setExcludeDescriptionRules] = useState<string[]>([
    "work_rights",
    "security_clearance",
    "no_sponsorship",
    "exp_4",
  ]);

  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchRunStatus | null>(null);
  const [importedCount, setImportedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queries = useMemo(() => {
    return jobTitle.trim() ? [jobTitle.trim()] : [];
  }, [jobTitle]);

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
        setImportedCount(r.importedCount ?? 0);
        setError(r.error ?? null);
        if (r.status === "SUCCEEDED") {
          clearInterval(t);
        }
        if (r.status === "FAILED") {
          clearInterval(t);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Polling failed");
      }
    }, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
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
      await triggerRun(id);
      setStatus("RUNNING");
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  const progressValue = status === "SUCCEEDED" ? 100 : status === "RUNNING" ? 60 : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Fetch jobs</h1>
        <p className="text-sm text-muted-foreground">
          Configure JobSpy to import roles that match your search.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job title</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Single title query</Label>
          <Input
            placeholder="e.g. Software Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hours old</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={hoursOld}
              onChange={(e) => setHoursOld(Number(e.target.value))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Results wanted</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={resultsWanted}
              onChange={(e) => setResultsWanted(Number(e.target.value))}
            />
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

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Exclude title terms</div>
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
              <div className="text-xs text-muted-foreground">Exclude description rules</div>
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
                    { value: "exp_4", label: "Experience 4+ years" },
                    { value: "exp_5", label: "Experience 5+ years" },
                    { value: "exp_7", label: "Experience 7+ years" },
                  ].map((opt) => {
                    const checked = excludeDescriptionRules.includes(opt.value);
                    return (
                      <DropdownMenuCheckboxItem
                        key={opt.value}
                        checked={checked}
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
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Starting..." : "Start fetch"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/jobs")}>
          View jobs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Run status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">State</span>
            <span>{status ?? "-"}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            id={runId ?? "-"} imported={importedCount}
          </div>
          <Progress value={progressValue} />
          <div className="text-xs text-muted-foreground">
            {status === "RUNNING"
              ? "Fetching and importing..."
              : status === "SUCCEEDED"
                ? "Completed successfully"
                : status === "FAILED"
                  ? "Run failed"
                  : "Idle"}
          </div>
          {error ? <div className="text-sm text-destructive">{error}</div> : null}
        </CardContent>
      </Card>
    </div>
  );
}

