"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type JobStatus = "NEW" | "APPLIED" | "REJECTED";

type JobItem = {
  id: string;
  jobUrl: string;
  title: string;
  company: string | null;
  location: string | null;
  jobType: string | null;
  jobLevel: string | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
};

export function JobsClient() {
  const { toast } = useToast();
  const [items, setItems] = useState<JobItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);

  const [statusFilter, setStatusFilter] = useState<JobStatus | "ALL">("ALL");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("limit", "20");
    if (statusFilter !== "ALL") sp.set("status", statusFilter);
    if (debouncedQ.trim()) sp.set("q", debouncedQ.trim());
    return sp.toString();
  }, [statusFilter, debouncedQ]);

  async function fetchPage(cursor: string | null, nextIndex: number) {
    setLoading(true);
    setError(null);
    try {
      const sp = new URLSearchParams(queryString);
      if (cursor) sp.set("cursor", cursor);
      const res = await fetch(`/api/jobs?${sp.toString()}`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load jobs");

      const newItems = (json.items ?? []) as JobItem[];
      const newCursor = (json.nextCursor ?? null) as string | null;

      setItems(newItems);
      setNextCursor(newCursor);
      setPageIndex(nextIndex);
      setCursorStack((prev) => {
        const copy = [...prev];
        copy[nextIndex] = cursor;
        return copy;
      });
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setItems([]);
    setNextCursor(null);
    setCursorStack([null]);
    setPageIndex(0);
    void fetchPage(null, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function updateStatusRemote(id: string, status: JobStatus) {
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update status");
    } catch (e: any) {
      throw new Error(e?.message || "Failed to update status");
    }
  }

  async function updateStatusWithRetry(id: string, status: JobStatus) {
    const attempts = 3;
    for (let i = 0; i < attempts; i += 1) {
      try {
        await updateStatusRemote(id, status);
        return;
      } catch (e) {
        if (i === attempts - 1) throw e;
        await sleep(400 * Math.pow(2, i));
      }
    }
  }

  async function updateStatus(id: string, status: JobStatus) {
    const previous = items.find((it) => it.id === id)?.status;
    if (!previous || previous === status) return;

    setError(null);
    setUpdatingIds((prev) => new Set(prev).add(id));
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));

    try {
      await updateStatusWithRetry(id, status);
      toast({
        title: "Status updated",
        description: `${previous} → ${status}`,
        duration: 1800,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900 animate-in fade-in zoom-in-95",
      });
    } catch (e: any) {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: previous } : it)));
      setError(e?.message || "Failed to update status");
      toast({
        title: "Update failed",
        description: e?.message || "The change could not be saved.",
        variant: "destructive",
        duration: 2200,
      });
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  const statusClass: Record<JobStatus, string> = {
    NEW: "bg-emerald-100 text-emerald-700",
    APPLIED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-sm text-muted-foreground">
            Clear, modern tracking for your applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <a href="/fetch">Fetch jobs</a>
          </Button>
          <Button onClick={() => void fetchPage(null, 0)} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1.5fr_1fr_0.6fr]">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Search</div>
            <Input
              placeholder="Search title or company"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Status</div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-center rounded-md border bg-muted/40 px-4 py-3 text-sm">
            <div className="text-muted-foreground">Showing</div>
            <div className="text-lg font-semibold">{items.length}</div>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4">
        {loading && items.length === 0 ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Card key={`s-${idx}`}>
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : null}
        {items.map((it) => (
          <Card key={it.id}>
            <CardContent className="grid gap-4 p-4 md:grid-cols-[1.6fr_1fr] md:items-center">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold">{it.title}</h3>
                  <Badge className={statusClass[it.status]}>{it.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {it.company ?? "-"} · {it.location ?? "-"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {it.jobType ?? "Unknown"} · {it.jobLevel ?? "Unknown"}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <Select
                  value={it.status}
                  onValueChange={(v) => updateStatus(it.id, v as JobStatus)}
                  disabled={updatingIds.has(it.id)}
                >
                  <SelectTrigger className="h-9 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="APPLIED">Applied</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button asChild variant="outline" size="sm">
                  <a href={it.jobUrl} target="_blank" rel="noreferrer">
                    Open job
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!items.length && !loading ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No jobs yet.
            </CardContent>
          </Card>
        ) : null}
      </section>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Page {pageIndex + 1}</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (pageIndex > 0) {
                    void fetchPage(cursorStack[pageIndex - 1] ?? null, pageIndex - 1);
                  }
                }}
                aria-disabled={loading || pageIndex === 0}
                className={loading || pageIndex === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (nextCursor) {
                    void fetchPage(nextCursor, pageIndex + 1);
                  }
                }}
                aria-disabled={loading || !nextCursor}
                className={loading || !nextCursor ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

