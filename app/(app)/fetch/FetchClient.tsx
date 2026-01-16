"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type FetchRunStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";

export function FetchClient() {
  const router = useRouter();
  const [queriesText, setQueriesText] = useState(
    '"junior software engineer", "backend engineer", "java developer"',
  );
  const [location, setLocation] = useState("Sydney, New South Wales, Australia");
  const [hoursOld, setHoursOld] = useState(48);
  const [resultsWanted, setResultsWanted] = useState(120);
  const [includeFromQueries, setIncludeFromQueries] = useState(false);
  const [filterDescription, setFilterDescription] = useState(true);

  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<FetchRunStatus | null>(null);
  const [importedCount, setImportedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queries = useMemo(() => {
    return queriesText
      .split("|")
      .flatMap((chunk) => chunk.split(","))
      .map((s) => s.trim())
      .filter(Boolean);
  }, [queriesText]);

  async function createRun() {
    const res = await fetch("/api/fetch-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queries,
        location,
        hoursOld,
        resultsWanted,
        includeFromQueries,
        filterDescription,
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
          <CardTitle className="text-base">Search queries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Queries (comma or | separated)</Label>
          <Textarea rows={3} value={queriesText} onChange={(e) => setQueriesText(e.target.value)} />
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
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium">Filter description</div>
                <div className="text-xs text-muted-foreground">
                  Exclude years-of-exp / work-rights jobs
                </div>
              </div>
              <Switch checked={filterDescription} onCheckedChange={setFilterDescription} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium">Include from queries</div>
                <div className="text-xs text-muted-foreground">
                  Require title to contain a query phrase
                </div>
              </div>
              <Switch checked={includeFromQueries} onCheckedChange={setIncludeFromQueries} />
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

