"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { ExternalLink, MapPin, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const HIGHLIGHT_KEYWORDS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "REST",
  "CI/CD",
  "Git",
  "Linux",
  "Terraform",
  "React Native",
  "Tailwind",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function JobsClient({
  initialItems = [],
  initialCursor = null,
}: {
  initialItems?: JobItem[];
  initialCursor?: string | null;
}) {
  const { toast } = useToast();
  const [items, setItems] = useState<JobItem[]>(initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);

  const [statusFilter, setStatusFilter] = useState<JobStatus | "ALL">("ALL");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const pageSize = 10;
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [jobLevelFilter, setJobLevelFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(initialItems[0]?.id ?? null);
  const [jobLevelOptions, setJobLevelOptions] = useState<string[]>([]);
  const [detailsById, setDetailsById] = useState<Record<string, { description: string | null }>>(
    {},
  );
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  function getErrorMessage(err: unknown, fallback = "Failed") {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return fallback;
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("limit", String(pageSize));
    if (statusFilter !== "ALL") sp.set("status", statusFilter);
    if (debouncedQ.trim()) sp.set("q", debouncedQ.trim());
    if (locationFilter !== "ALL") sp.set("location", locationFilter);
    if (jobLevelFilter !== "ALL") sp.set("jobLevel", jobLevelFilter);
    sp.set("sort", sortOrder);
    return sp.toString();
  }, [statusFilter, debouncedQ, pageSize, sortOrder, locationFilter, jobLevelFilter]);

  const initialQueryRef = useRef<string | null>(null);
  if (initialQueryRef.current === null) {
    initialQueryRef.current = queryString;
  }
  const skipInitialFetchRef = useRef<boolean>(initialItems.length > 0);

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
      initialQueryRef.current = queryString;
      setCursorStack((prev) => {
        const copy = [...prev];
        copy[nextIndex] = cursor;
        return copy;
      });
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  function scrollToTop() {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function triggerSearch() {
    const trimmed = q.trim();
    if (trimmed !== debouncedQ) {
      setDebouncedQ(trimmed);
      return;
    }
    setItems([]);
    setNextCursor(null);
    setCursorStack([null]);
    setPageIndex(0);
    void fetchPage(null, 0);
  }

  useEffect(() => {
    if (
      skipInitialFetchRef.current &&
      initialQueryRef.current === queryString
    ) {
      skipInitialFetchRef.current = false;
      return;
    }
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
    } catch (e: unknown) {
      throw new Error(getErrorMessage(e, "Failed to update status"));
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
    } catch (e: unknown) {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: previous } : it)));
      setError(getErrorMessage(e, "Failed to update status"));
      toast({
        title: "Update failed",
        description: getErrorMessage(e, "The change could not be saved."),
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

  async function deleteJob(id: string) {
    setError(null);
    setDeletingIds((prev) => new Set(prev).add(id));
    const previousItems = items;
    setItems((prev) => prev.filter((it) => it.id !== id));
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to delete job");
      toast({
        title: "Job removed",
        description: "The job was deleted successfully.",
        duration: 1800,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900 animate-in fade-in zoom-in-95",
      });
    } catch (e: unknown) {
      setItems(previousItems);
      setError(getErrorMessage(e, "Failed to delete job"));
      toast({
        title: "Delete failed",
        description: getErrorMessage(e, "The job could not be removed."),
        variant: "destructive",
        duration: 2200,
      });
    } finally {
      setDeletingIds((prev) => {
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

  useEffect(() => {
    if (items.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !items.some((it) => it.id === selectedId)) {
      setSelectedId(items[0]?.id ?? null);
    }
  }, [items, selectedId]);

  const selectedJob = items.find((it) => it.id === selectedId) ?? null;
  const detailsScrollRef = useRef<HTMLDivElement | null>(null);
  const selectedDescription = selectedJob ? detailsById[selectedJob.id]?.description ?? "" : "";
  const isLongDescription = selectedDescription.length > 600;
  const isExpanded =
    selectedJob && expandedDescriptions[selectedJob.id] ? true : false;
  const highlightRegex = useMemo(() => {
    const patterns = HIGHLIGHT_KEYWORDS.map((keyword) => {
      const escaped = escapeRegExp(keyword);
      const isPlainWord = /^[a-z0-9.+#-]+$/i.test(keyword);
      return isPlainWord ? `\\b${escaped}\\b` : escaped;
    });
    return new RegExp(`(${patterns.join("|")})`, "gi");
  }, []);

  useLayoutEffect(() => {
    const container = detailsScrollRef.current;
    if (!container) return;
    container.scrollTop = 0;
    container.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedId, detailLoadingId]);

  function highlightText(text: string) {
    const parts = text.split(highlightRegex);
    return parts.map((part, index) => {
      if (highlightRegex.test(part)) {
        return (
          <mark
            key={`${part}-${index}`}
            className="rounded-sm bg-amber-200/70 px-1 py-0.5 font-medium text-amber-900"
          >
            {part}
          </mark>
        );
      }
      return <span key={`${part}-${index}`}>{part}</span>;
    });
  }

  function renderHighlighted(children: React.ReactNode): React.ReactNode {
    if (typeof children === "string") return highlightText(children);
    if (Array.isArray(children)) {
      return children.map((child, index) => (
        <span key={index}>{renderHighlighted(child)}</span>
      ));
    }
    return children;
  }

  useEffect(() => {
    if (!items.length) return;
    const levels = items
      .map((item) => item.jobLevel)
      .filter((level): level is string => Boolean(level));
    if (!levels.length) return;
    setJobLevelOptions((prev) => Array.from(new Set([...prev, ...levels])));
  }, [items]);


  useEffect(() => {
    if (!selectedId) return;
    if (detailsById[selectedId]) return;
    const controller = new AbortController();
    setDetailLoadingId(selectedId);
    setDetailError(null);
    fetch(`/api/jobs/${selectedId}`, { signal: controller.signal })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "Failed to load details");
        setDetailsById((prev) => ({
          ...prev,
          [selectedId]: { description: json.description ?? null },
        }));
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setDetailError(getErrorMessage(e, "Failed to load details"));
      })
      .finally(() => {
        setDetailLoadingId((prev) => (prev === selectedId ? null : prev));
      });
    return () => controller.abort();
  }, [selectedId, detailsById]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Curated Jobs</h1>
        </div>
        <div className="rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          Search
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm backdrop-blur">
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_0.8fr_0.8fr_auto]">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Title or Keywords</div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="e.g. software engineer"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Select value={locationFilter} onValueChange={(v) => setLocationFilter(v)}>
                <SelectTrigger className="pl-9">
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All locations</SelectItem>
                  <SelectItem value="state:NSW">NSW</SelectItem>
                  <SelectItem value="state:VIC">VIC</SelectItem>
                  <SelectItem value="state:QLD">QLD</SelectItem>
                  <SelectItem value="state:WA">WA</SelectItem>
                  <SelectItem value="state:SA">SA</SelectItem>
                  <SelectItem value="state:ACT">ACT</SelectItem>
                  <SelectItem value="state:TAS">TAS</SelectItem>
                  <SelectItem value="state:NT">NT</SelectItem>
                  {[
                    "Sydney, New South Wales, Australia",
                    "Melbourne, Victoria, Australia",
                    "Brisbane, Queensland, Australia",
                    "Perth, Western Australia, Australia",
                    "Adelaide, South Australia, Australia",
                    "Canberra, Australian Capital Territory, Australia",
                    "Hobart, Tasmania, Australia",
                    "Darwin, Northern Territory, Australia",
                    "Sydney, NSW",
                    "Melbourne, VIC",
                    "Brisbane, QLD",
                    "Perth, WA",
                    "Adelaide, SA",
                    "Canberra, ACT",
                    "Hobart, TAS",
                    "Darwin, NT",
                    "Gold Coast, QLD",
                    "Newcastle, NSW",
                  ].map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Job level</div>
            <Select value={jobLevelFilter} onValueChange={setJobLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All levels</SelectItem>
                {jobLevelOptions.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Status</div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as JobStatus | "ALL")}
            >
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
          <div className="flex items-end">
            <Button onClick={triggerSearch} disabled={loading} className="w-full lg:w-auto">
              Search
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "newest" | "oldest")}>
              <SelectTrigger className="h-9 w-[170px] bg-muted/40">
                <SelectValue placeholder="Posted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Posted: newest</SelectItem>
                <SelectItem value="oldest">Posted: oldest</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
              {items.length} results
            </div>
          </div>
          <Button asChild variant="outline">
            <a href="/fetch">Fetch jobs</a>
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <div className="flex h-full min-h-[520px] flex-col rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3 text-sm font-semibold">
            <span>Results</span>
            <span className="text-xs text-muted-foreground">Page {pageIndex + 1}</span>
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-3">
            {loading && items.length === 0 ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={`s-${idx}`} className="rounded-lg border p-3">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="mt-2 h-3 w-1/2" />
                  <Skeleton className="mt-2 h-3 w-1/3" />
                </div>
              ))
            ) : null}
            {items.map((it) => {
              const active = it.id === selectedId;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setSelectedId(it.id)}
                  className={`w-full rounded-lg border-l-4 px-3 py-3 text-left transition ${
                    active
                      ? "border-l-primary border-primary/50 bg-primary/5 shadow-sm"
                      : "border-l-transparent hover:border-muted-foreground/30 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge className={statusClass[it.status]}>{it.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(it.createdAt).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold">{it.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {it.company ?? "-"} · {it.location ?? "-"}
                  </div>
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    {it.jobType ?? "Unknown"} · {it.jobLevel ?? "Unknown"}
                  </div>
                </button>
              );
            })}
            {!items.length && !loading ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No jobs yet.
              </div>
            ) : null}
          </div>
          <div className="border-t px-4 py-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (pageIndex > 0) {
                        scrollToTop();
                        setItems([]);
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
                      if (loading || !nextCursor) return;
                      scrollToTop();
                      setItems([]);
                      void fetchPage(nextCursor, pageIndex + 1);
                    }}
                    aria-disabled={loading || !nextCursor}
                    className={loading || !nextCursor ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        <div className="flex h-full min-h-[520px] flex-col rounded-xl border bg-card">
          <div className="border-b px-4 py-3">
            {selectedJob ? (
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{selectedJob.title}</h2>
                    <Badge className={statusClass[selectedJob.status]}>{selectedJob.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedJob.company ?? "-"} · {selectedJob.location ?? "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedJob.jobType ?? "Unknown"} · {selectedJob.jobLevel ?? "Unknown"}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={selectedJob.status}
                    onValueChange={(v) => updateStatus(selectedJob.id, v as JobStatus)}
                    disabled={updatingIds.has(selectedJob.id)}
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
                  <Button asChild size="sm" className="gap-1 bg-blue-600 text-white hover:bg-blue-700">
                    <a href={selectedJob.jobUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open job
                    </a>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingIds.has(selectedJob.id)}
                        className="gap-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove this job?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the job from your list.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteJob(selectedJob.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Select a job to preview details.</div>
            )}
          </div>
          <div ref={detailsScrollRef} className="flex-1 overflow-auto p-4">
            {selectedJob ? (
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Job Description
                </div>
                {detailError ? (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                    {detailError}
                  </div>
                ) : null}
                {detailLoadingId === selectedJob.id && !detailsById[selectedJob.id] ? (
                  <div className="space-y-3 rounded-lg border border-dashed bg-muted/30 p-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed bg-muted/30 p-5">
                    {selectedDescription ? (
                      <div className="space-y-3">
                        <div
                          className={`relative space-y-4 ${
                            !isExpanded ? "max-h-56 overflow-hidden" : ""
                          }`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              p: ({ children }) => (
                                <p className="text-sm leading-7 text-foreground/80">
                                  {renderHighlighted(children)}
                                </p>
                              ),
                              li: ({ children }) => (
                                <li className="text-sm leading-7 text-foreground/80">
                                  {renderHighlighted(children)}
                                </li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-foreground">
                                  {renderHighlighted(children)}
                                </strong>
                              ),
                              code: ({ children }) => (
                                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">
                                  {children}
                                </code>
                              ),
                            }}
                          >
                            {selectedDescription}
                          </ReactMarkdown>
                          {!isExpanded && isLongDescription ? (
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-muted/60 to-transparent" />
                          ) : null}
                        </div>
                        {isLongDescription ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedDescriptions((prev) => ({
                                ...prev,
                                [selectedJob.id]: !isExpanded,
                              }))
                            }
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </Button>
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No description available for this job yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Use the list on the left to choose a job.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

