"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const [items, setItems] = useState<JobItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  async function updateStatus(id: string, status: JobStatus) {
    setError(null);
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error || "Failed to update status");
      return;
    }
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
  }

  const statusClass: Record<JobStatus, string> = {
    NEW: "bg-emerald-100 text-emerald-700",
    APPLIED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-sm text-muted-foreground">Track and update your applications.</p>
        </div>
        <Button asChild variant="secondary">
          <a href="/fetch">Fetch jobs</a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Search</div>
            <Input
              placeholder="Title or company"
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
          <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm">
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && items.length === 0 ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <TableRow key={`s-${idx}`}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : null}
              {items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell>
                    <div className="font-medium">{it.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {it.jobLevel ?? "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell>{it.company ?? "-"}</TableCell>
                  <TableCell>{it.location ?? "-"}</TableCell>
                  <TableCell>{it.jobType ?? "Unknown"}</TableCell>
                  <TableCell>
                    <Badge className={statusClass[it.status]}>{it.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        value={it.status}
                        onValueChange={(v) => updateStatus(it.id, v as JobStatus)}
                      >
                        <SelectTrigger className="h-8 w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="APPLIED">Applied</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button asChild variant="ghost" size="sm">
                        <a href={it.jobUrl} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!items.length && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No jobs yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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

