"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "react-day-picker/dist/style.css";
import { ChevronDown, ChevronUp, ExternalLink, MapPin, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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

type JobsResponse = {
  items: JobItem[];
  nextCursor: string | null;
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

const LOCATION_OPTIONS = [
  { value: "New South Wales, Australia", label: "New South Wales" },
  { value: "Victoria, Australia", label: "Victoria" },
  { value: "Queensland, Australia", label: "Queensland" },
  { value: "Western Australia, Australia", label: "Western Australia" },
  { value: "South Australia, Australia", label: "South Australia" },
  { value: "Australian Capital Territory, Australia", label: "ACT" },
  { value: "Tasmania, Australia", label: "Tasmania" },
  { value: "Northern Territory, Australia", label: "Northern Territory" },
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatInsertedTime(iso: string) {
  const createdAt = new Date(iso);
  if (Number.isNaN(createdAt.getTime())) return "unknown";
  const diffMs = Date.now() - createdAt.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day ago`;
}

function formatLocalDateTime(iso: string, timeZone: string | null) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "unknown";
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
    ...(timeZone ? { timeZone } : {}),
  };
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function getUserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function formatLocalDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function JobsClient({
  initialItems = [],
  initialCursor = null,
}: {
  initialItems?: JobItem[];
  initialCursor?: string | null;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<JobStatus | "ALL">("ALL");
  const statusFilterRef = useRef<JobStatus | "ALL">("ALL");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const pageSize = 10;
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [jobLevelFilter, setJobLevelFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(initialItems[0]?.id ?? null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [timeZone, setTimeZone] = useState<string | null>(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinError, setCheckinError] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [floatingSidebar, setFloatingSidebar] = useState<{
    enabled: boolean;
    left: number;
    width: number;
  }>({ enabled: false, left: 0, width: 0 });

  useEffect(() => {
    document.body.classList.add("jobs-no-scroll");
    return () => {
      document.body.classList.remove("jobs-no-scroll");
    };
  }, []);

  function getErrorMessage(err: unknown, fallback = "Failed") {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return fallback;
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const tz = getUserTimeZone();
    setTimeZone(tz || null);
  }, []);

  useEffect(() => {
    statusFilterRef.current = statusFilter;
  }, [statusFilter]);

  useEffect(() => {
    function updateFloatingSidebar() {
      if (!contentRef.current) return;
      if (window.innerWidth < 1280) {
        setFloatingSidebar((prev) =>
          prev.enabled ? { ...prev, enabled: false } : prev,
        );
        return;
      }
      const rect = contentRef.current.getBoundingClientRect();
      const available = window.innerWidth - rect.right;
      const minWidth = 280;
      const maxWidth = 360;
      const gap = 16;
      if (available >= minWidth + gap) {
        const width = Math.min(maxWidth, Math.max(minWidth, available - gap));
        setFloatingSidebar({
          enabled: true,
          left: Math.max(0, rect.right + gap),
          width,
        });
      } else {
        setFloatingSidebar((prev) =>
          prev.enabled ? { ...prev, enabled: false } : prev,
        );
      }
    }

    const observer = new ResizeObserver(() => updateFloatingSidebar());
    if (contentRef.current) observer.observe(contentRef.current);
    window.addEventListener("resize", updateFloatingSidebar);
    updateFloatingSidebar();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateFloatingSidebar);
    };
  }, []);

  function refreshCheckins() {
    queryClient.invalidateQueries({ queryKey: ["checkins", resolvedTimeZone] });
  }

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
  const jobsQuery = useQuery({
    queryKey: ["jobs", queryString, cursor],
    queryFn: async (): Promise<JobsResponse> => {
      const sp = new URLSearchParams(queryString);
      if (cursor) sp.set("cursor", cursor);
      const res = await fetch(`/api/jobs?${sp.toString()}`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load jobs");
      return { items: json.items ?? [], nextCursor: json.nextCursor ?? null };
    },
    enabled: Boolean(queryString),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 15_000,
    initialData: () => {
      const shouldUseInitial =
        initialItems.length > 0 &&
        cursor === null &&
        pageIndex === 0 &&
        initialQueryRef.current === queryString;
      if (!shouldUseInitial) return undefined;
      return { items: initialItems, nextCursor: initialCursor ?? null };
    },
  });

  const items = useMemo(() => jobsQuery.data?.items ?? [], [jobsQuery.data?.items]);
  const nextCursor = jobsQuery.data?.nextCursor ?? null;
  const loading = jobsQuery.isFetching;
  const queryError = jobsQuery.error
    ? getErrorMessage(jobsQuery.error, "Failed to load jobs")
    : null;

  const activeError = error ?? queryError;
  const resolvedTimeZone = timeZone ?? getUserTimeZone();

  const checkinsQuery = useQuery({
    queryKey: ["checkins", resolvedTimeZone],
    queryFn: async () => {
      const res = await fetch("/api/checkins", {
        headers: { "x-user-timezone": resolvedTimeZone },
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load check-ins");
      return json as {
        dates: string[];
        localDate: string | null;
        remainingNew: number | null;
        checkedInToday: boolean;
      };
    },
    enabled: Boolean(resolvedTimeZone),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const checkinDates = useMemo(
    () =>
      Array.isArray(checkinsQuery.data?.dates)
        ? checkinsQuery.data?.dates
        : [],
    [checkinsQuery.data?.dates],
  );
  const checkinLocalDate =
    typeof checkinsQuery.data?.localDate === "string"
      ? checkinsQuery.data?.localDate
      : null;
  const remainingNewToday =
    typeof checkinsQuery.data?.remainingNew === "number"
      ? checkinsQuery.data?.remainingNew
      : null;
  const checkedInToday = Boolean(checkinsQuery.data?.checkedInToday);
  const checkinFetchError = checkinsQuery.error
    ? getErrorMessage(checkinsQuery.error, "Failed to load check-ins")
    : null;
  const checkinErrorMessage = checkinError ?? checkinFetchError;

  const jobLevelsQuery = useQuery<string[]>({
    queryKey: ["job-levels"],
    queryFn: async () => {
      const res = await fetch("/api/jobs?limit=50", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load job levels");
      const levels = (json.items ?? [])
        .map((item: JobItem) => item.jobLevel)
        .filter((level: string | null): level is string => Boolean(level));
      return Array.from(new Set(levels));
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const jobLevelOptions = useMemo(() => {
    const fromItems = items
      .map((item) => item.jobLevel)
      .filter((level): level is string => Boolean(level));
    const fromQuery = jobLevelsQuery.data ?? [];
    return Array.from(new Set([...fromQuery, ...fromItems]));
  }, [items, jobLevelsQuery.data]);


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
    setCursorStack([null]);
    setPageIndex(0);
    setCursor(null);
    queryClient.invalidateQueries({ queryKey: ["jobs", queryString, null] });
  }

  useEffect(() => {
    if (
      skipInitialFetchRef.current &&
      initialQueryRef.current === queryString
    ) {
      skipInitialFetchRef.current = false;
      return;
    }
    setCursorStack([null]);
    setPageIndex(0);
    setCursor(null);
  }, [queryString]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: JobStatus }) => {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update status");
    },
    onMutate: async ({ id, status }) => {
      setError(null);
      setUpdatingIds((prev) => new Set(prev).add(id));
      await queryClient.cancelQueries({ queryKey: ["jobs", queryString, cursor] });
      const previous = queryClient.getQueryData<JobsResponse>(["jobs", queryString, cursor]);
      queryClient.setQueryData<JobsResponse>(["jobs", queryString, cursor], (old) => {
        if (!old) return old;
        const currentFilter = statusFilterRef.current;
        const shouldKeep = currentFilter === "ALL" || currentFilter === status;
        return {
          ...old,
          items: shouldKeep
            ? old.items.map((it) => (it.id === id ? { ...it, status } : it))
            : old.items.filter((it) => it.id !== id),
        };
      });
      return { previous };
    },
    onError: (e, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["jobs", queryString, cursor], context.previous);
      }
      setError(getErrorMessage(e, "Failed to update status"));
      toast({
        title: "Update failed",
        description: getErrorMessage(e, "The change could not be saved."),
        variant: "destructive",
        duration: 2200,
      });
    },
    onSuccess: (_data, variables) => {
      void refreshCheckins();
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({
        title: "Status updated",
        description: `${variables.status}`,
        duration: 1800,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900 animate-in fade-in zoom-in-95",
      });
    },
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(variables.id);
        return next;
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to delete job");
    },
    onMutate: async (id: string) => {
      setError(null);
      setDeletingIds((prev) => new Set(prev).add(id));
      await queryClient.cancelQueries({ queryKey: ["jobs", queryString, cursor] });
      const previous = queryClient.getQueryData<JobsResponse>(["jobs", queryString, cursor]);
      queryClient.setQueryData<JobsResponse>(["jobs", queryString, cursor], (old) => {
        if (!old) return old;
        return { ...old, items: old.items.filter((it) => it.id !== id) };
      });
      if (selectedId === id) {
        setSelectedId(null);
      }
      return { previous };
    },
    onError: (e, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["jobs", queryString, cursor], context.previous);
      }
      setError(getErrorMessage(e, "Failed to delete job"));
      toast({
        title: "Delete failed",
        description: getErrorMessage(e, "The job could not be removed."),
        variant: "destructive",
        duration: 2200,
      });
    },
    onSuccess: () => {
      void refreshCheckins();
      toast({
        title: "Job removed",
        description: "The job was deleted successfully.",
        duration: 1800,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900 animate-in fade-in zoom-in-95",
      });
    },
    onSettled: (_data, _error, id) => {
      if (!id) return;
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
  });

  async function updateStatus(id: string, status: JobStatus) {
    const previous = items.find((it) => it.id === id)?.status;
    if (!previous || previous === status) return;
    updateStatusMutation.mutate({ id, status });
  }

  async function deleteJob(id: string) {
    deleteMutation.mutate(id);
  }

  const statusClass: Record<JobStatus, string> = {
    NEW: "bg-emerald-100 text-emerald-700",
    APPLIED: "bg-sky-100 text-sky-700",
    REJECTED: "bg-slate-200 text-slate-600",
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
  const detailQuery = useQuery({
    queryKey: ["job-details", selectedId],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${selectedId}`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load details");
      return json as { id: string; description: string | null };
    },
    enabled: Boolean(selectedId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const selectedDescription = selectedJob ? detailQuery.data?.description ?? "" : "";
  const detailError = detailQuery.error
    ? getErrorMessage(detailQuery.error, "Failed to load details")
    : null;
  const detailLoading = detailQuery.isFetching && !detailQuery.data;
  const isLongDescription = selectedDescription.length > 600;
  const isExpanded =
    selectedJob && expandedDescriptions[selectedJob.id] ? true : false;
  const highlightRegex = useMemo(() => {
    const patterns = HIGHLIGHT_KEYWORDS.map((keyword) => {
      const escaped = escapeRegExp(keyword);
      const isPlainWord = /^[a-z0-9.+#-]+$/i.test(keyword);
      return isPlainWord ? `\\b${escaped}\\b` : escaped;
    });
    return new RegExp(`(${patterns.join("|")})`, "i");
  }, []);

  const checkinDateSet = useMemo(
    () => new Set(checkinDates),
    [checkinDates],
  );
  const canCheckIn = remainingNewToday === 0 && !checkedInToday;
  const checkinStatusText =
    remainingNewToday === null
      ? "Checking today's progress..."
      : remainingNewToday > 0
        ? `You still have ${remainingNewToday} NEW job(s) from today.`
        : checkedInToday
          ? "Checked in for today. Great work!"
          : "All NEW jobs from today are done. You can check in.";
  const checkinCards = (
    <Card className="border-2 border-slate-900/10 bg-white/80 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition-shadow duration-200 ease-out hover:shadow-[0_24px_50px_-38px_rgba(15,23,42,0.4)]">
      <CardHeader className="pb-1">
        <CardTitle className="text-[15px]">Daily check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div className="text-[12px] text-muted-foreground">{checkinStatusText}</div>
        {checkinErrorMessage ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
            {checkinErrorMessage}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            className="edu-cta edu-cta--press edu-cta--compact h-8 px-3 text-[12px]"
            onClick={async () => {
              if (!canCheckIn) return;
              setCheckinLoading(true);
              try {
                const tz = timeZone ?? getUserTimeZone();
                const res = await fetch("/api/checkins", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "x-user-timezone": tz },
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) {
                  throw new Error(json?.error || "Check-in failed");
                }
                refreshCheckins();
                toast({
                  title: "Checked in",
                  description: "Today's check-in is saved.",
                  duration: 1800,
                  className:
                    "border-emerald-200 bg-emerald-50 text-emerald-900 animate-in fade-in zoom-in-95",
                });
              } catch (e: unknown) {
                setCheckinError(getErrorMessage(e, "Check-in failed"));
              } finally {
                setCheckinLoading(false);
              }
            }}
            disabled={!canCheckIn || checkinLoading}
          >
            {checkedInToday ? "Checked in" : checkinLoading ? "Checking in..." : "Check in"}
          </Button>
          <div className="rounded-full border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground">
            {checkinLocalDate ?? "Local date unavailable"}
          </div>
        </div>
        <div className="border-t pt-2">
          <div className="flex items-center justify-between">
            <div className="text-[12px] font-medium text-muted-foreground">Calendar</div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px]"
              onClick={() => setCalendarOpen((prev) => !prev)}
            >
              {calendarOpen ? "Hide" : "Show"}
              {calendarOpen ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : (
                <ChevronDown className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
          {calendarOpen ? (
            <div className="mt-2 w-full max-w-[280px] rounded-2xl bg-white/80 p-2 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)]">
              <Calendar
                className="jobflow-calendar"
                view="month"
                showNeighboringMonth
                locale="en-AU"
                value={null}
                tileClassName={({ date, view }) =>
                  view === "month" && checkinDateSet.has(formatLocalDateKey(date))
                    ? "jobflow-calendar__checked"
                    : undefined
                }
              />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );



  function highlightText(text: string) {
    const parts = text.split(highlightRegex);
    return parts.map((part, index) => {
      if (highlightRegex.test(part)) {
        return (
          <mark
            key={`${part}-${index}`}
            className="rounded-sm bg-amber-100/90 px-1 py-0.5 font-medium text-amber-900"
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



  return (
    <div className="relative flex flex-1 min-h-0 flex-col gap-6 text-foreground">
      <div ref={contentRef} className="flex min-h-0 flex-1 flex-col gap-6">
        {!floatingSidebar.enabled ? (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">{checkinCards}</div>
        ) : null}

      <div
        data-testid="jobs-toolbar"
        className="rounded-3xl border-2 border-slate-900/10 bg-white/80 p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition-shadow duration-200 ease-out hover:shadow-[0_26px_55px_-40px_rgba(15,23,42,0.4)]"
      >
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_0.8fr_0.8fr_0.9fr_auto_auto] lg:items-end">
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
                  {LOCATION_OPTIONS.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
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
          <div className="space-y-2" data-testid="jobs-sort">
            <div className="text-xs text-muted-foreground">Posted</div>
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "newest" | "oldest")}>
              <SelectTrigger className="h-9 bg-muted/40">
                <SelectValue placeholder="Posted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Posted: newest</SelectItem>
                <SelectItem value="oldest">Posted: oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end" data-testid="jobs-results-count">
            <div className="rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
              {items.length} results
            </div>
          </div>
          <div className="flex items-end">
            <Button
              onClick={triggerSearch}
              disabled={loading}
              className="edu-cta edu-cta--press edu-cta--compact w-full lg:w-auto"
            >
              Search
            </Button>
          </div>
          <div className="flex items-end">
            <Button asChild variant="outline" className="edu-outline edu-cta--press edu-outline--compact w-full lg:w-auto">
              <a href="/fetch">Fetch jobs</a>
            </Button>
          </div>
        </div>
      </div>

      {activeError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {activeError}
        </div>
      ) : null}

        <section className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[380px_1fr] lg:items-start">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-3xl border-2 border-slate-900/10 bg-white/80 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.3)] backdrop-blur transition-shadow duration-200 ease-out hover:shadow-[0_24px_50px_-36px_rgba(15,23,42,0.38)]">
          <div className="flex items-center justify-between border-b px-4 py-3 text-sm font-semibold">
            <span>Results</span>
            <span className="text-xs text-muted-foreground">Page {pageIndex + 1}</span>
          </div>
          <ScrollArea data-testid="jobs-results-scroll" className="flex-1">
            <div className="space-y-3 p-3">
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
                  onClick={() => {
                    setSelectedId(it.id);
                  }}
                  className={`w-full rounded-2xl border border-l-4 border-slate-900/10 bg-white/80 px-3 py-3 text-left transition-all duration-200 ease-out hover:-translate-y-[1px] ${
                    active
                      ? "border-l-emerald-500 bg-emerald-50/60 shadow-sm"
                      : "border-l-transparent hover:border-slate-900/20 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge className={statusClass[it.status]}>{it.status}</Badge>
                    <span
                      className="text-xs text-muted-foreground"
                      title={formatLocalDateTime(it.createdAt, timeZone)}
                    >
                      {formatInsertedTime(it.createdAt)}
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
          </ScrollArea>
          <div className="border-t px-4 py-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (pageIndex > 0) {
                        scrollToTop();
                        const prevCursor = cursorStack[pageIndex - 1] ?? null;
                        setPageIndex(pageIndex - 1);
                        setCursor(prevCursor);
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
                      setCursorStack((prev) => {
                        const copy = [...prev];
                        copy[pageIndex + 1] = nextCursor;
                        return copy;
                      });
                      setPageIndex(pageIndex + 1);
                      setCursor(nextCursor);
                    }}
                    aria-disabled={loading || !nextCursor}
                    className={loading || !nextCursor ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden rounded-3xl border-2 border-slate-900/10 bg-white/80 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.3)] backdrop-blur transition-shadow duration-200 ease-out hover:shadow-[0_24px_50px_-36px_rgba(15,23,42,0.38)] lg:sticky lg:top-24">
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
                  <Button asChild size="sm" className="edu-cta edu-cta--press edu-cta--compact h-9 gap-1 px-3">
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
                        className="edu-cta--press edu-outline--compact gap-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
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
          <ScrollArea data-testid="jobs-details-scroll" className="flex-1">
            <div key={selectedId ?? "empty"} ref={detailsScrollRef} className="p-4">
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
                {detailLoading ? (
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
                                <code className="rounded bg-muted/70 px-1.5 py-0.5 text-xs text-foreground/80">
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
          </ScrollArea>
        </div>
        </section>
      </div>

      {floatingSidebar.enabled ? (
        <aside
          className="fixed z-30 hidden xl:flex"
          style={{ top: 96, left: floatingSidebar.left, width: floatingSidebar.width }}
        >
          <div className="flex max-h-[calc(100vh-120px)] flex-col gap-4 overflow-auto pr-1">
            {checkinCards}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
