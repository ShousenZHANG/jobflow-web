"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "react-day-picker/dist/style.css";
import { ExternalLink, FileText, MapPin, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ToastAction } from "@/components/ui/toast";

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
  "HTML",
  "CSS",
  "Sass",
  "SCSS",
  "Less",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue",
  "Nuxt",
  "Angular",
  "Svelte",
  "SvelteKit",
  "SolidJS",
  "Remix",
  "Node",
  "Node.js",
  "Express",
  "NestJS",
  "Fastify",
  "Deno",
  "Bun",
  "Python",
  "Django",
  "Flask",
  "FastAPI",
  "Java",
  "Spring",
  "Spring Boot",
  "Kotlin",
  "Scala",
  "C#",
  ".NET",
  "ASP.NET",
  "C++",
  "Go",
  "Golang",
  "Rust",
  "Ruby",
  "Rails",
  "PHP",
  "Laravel",
  "GraphQL",
  "REST",
  "gRPC",
  "tRPC",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "OpenSearch",
  "Kafka",
  "RabbitMQ",
  "SQS",
  "SNS",
  "AWS",
  "Azure",
  "GCP",
  "Firebase",
  "Cloudflare",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Ansible",
  "Git",
  "GitHub Actions",
  "GitLab CI",
  "CI/CD",
  "Linux",
  "Nginx",
  "Vercel",
  "Netlify",
  "Jest",
  "Vitest",
  "Cypress",
  "Playwright",
  "Storybook",
  "Tailwind",
  "shadcn/ui",
  "Material UI",
  "Chakra UI",
  "Figma",
  "React Native",
  "Flutter",
  "Swift",
  "SwiftUI",
  "Android",
  "iOS",
  "ML",
  "AI",
  "LLM",
  "OpenAI",
  "LangChain",
  "Vector",
  "Pinecone",
  "Weaviate",
  "Snowflake",
  "Databricks",
  "Airflow",
  "dbt",
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
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [coverGeneratingIds, setCoverGeneratingIds] = useState<Set<string>>(new Set());
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<JobStatus | "ALL">("ALL");
  const statusFilterRef = useRef<JobStatus | "ALL">("ALL");
  const [q, setQ] = useState("");
  const pageSize = 10;
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [jobLevelFilter, setJobLevelFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(initialItems[0]?.id ?? null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [timeZone] = useState<string | null>(() => getUserTimeZone() || null);
  const [isPending, startTransition] = useTransition();
  const resultsScrollRef = useRef<HTMLDivElement | null>(null);
  const resultsViewportRef = useRef<HTMLDivElement | null>(null);
  const [resultsViewportReady, setResultsViewportReady] = useState(false);
  const pendingDeleteRef = useRef<
    Map<
      string,
      {
        timeoutId: ReturnType<typeof setTimeout>;
        previous: JobsResponse | undefined;
        previousSelectedId: string | null;
      }
    >
  >(new Map());
  const deleteUndoMs = 2400;

  function getErrorMessage(err: unknown, fallback = "Failed") {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return fallback;
  }

  const deferredQ = useDeferredValue(q);
  const deferredStatus = useDeferredValue(statusFilter);
  const deferredLocation = useDeferredValue(locationFilter);
  const deferredJobLevel = useDeferredValue(jobLevelFilter);
  const deferredSortOrder = useDeferredValue(sortOrder);

  const filters = useMemo(
    () => ({
      q: deferredQ,
      statusFilter: deferredStatus,
      locationFilter: deferredLocation,
      jobLevelFilter: deferredJobLevel,
      sortOrder: deferredSortOrder,
      pageSize,
    }),
    [deferredQ, deferredStatus, deferredLocation, deferredJobLevel, deferredSortOrder, pageSize],
  );

  const debouncedFilters = useDebouncedValue(filters, 200);

  useEffect(() => {
    if (!resultsScrollRef.current) return;
    const viewport = resultsScrollRef.current.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLDivElement | null;
    resultsViewportRef.current = viewport;
    setResultsViewportReady(Boolean(viewport));
  }, []);

  useEffect(() => {
    const pendingDeletes = pendingDeleteRef.current;
    return () => {
      pendingDeletes.forEach((pending) => clearTimeout(pending.timeoutId));
      pendingDeletes.clear();
    };
  }, []);

  useEffect(() => {
    statusFilterRef.current = statusFilter;
  }, [statusFilter]);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("limit", String(debouncedFilters.pageSize));
    if (debouncedFilters.statusFilter !== "ALL") sp.set("status", debouncedFilters.statusFilter);
    if (debouncedFilters.q.trim()) sp.set("q", debouncedFilters.q.trim());
    if (debouncedFilters.locationFilter !== "ALL") sp.set("location", debouncedFilters.locationFilter);
    if (debouncedFilters.jobLevelFilter !== "ALL") sp.set("jobLevel", debouncedFilters.jobLevelFilter);
    sp.set("sort", debouncedFilters.sortOrder);
    return sp.toString();
  }, [debouncedFilters]);

  const initialQueryRef = useRef<string | null>(null);
  if (initialQueryRef.current === null) {
    initialQueryRef.current = queryString;
  }
  const jobsQuery = useQuery({
    queryKey: ["jobs", queryString, cursor],
    queryFn: async ({ signal }): Promise<JobsResponse> => {
      const sp = new URLSearchParams(queryString);
      if (cursor) sp.set("cursor", cursor);
      const res = await fetch(`/api/jobs?${sp.toString()}`, { cache: "no-store", signal });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load jobs");
      return { items: json.items ?? [], nextCursor: json.nextCursor ?? null };
    },
    enabled: Boolean(queryString),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
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
  const delayedLoading = useDebouncedValue(loading, 160);
  const showLoadingOverlay = (loading ? delayedLoading : false) || isPending;
  const listOpacityClass = showLoadingOverlay ? "opacity-70" : "opacity-100";
  const queryError = jobsQuery.error
    ? getErrorMessage(jobsQuery.error, "Failed to load jobs")
    : null;

  const activeError = error ?? queryError;
  const prevDisabled = loading || pageIndex === 0;
  const nextDisabled = loading || !nextCursor;

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
    resetPagination();
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
  }

  const resetPagination = useMemo(
    () => () => {
      setCursorStack([null]);
      setPageIndex(0);
      setCursor(null);
    },
    [],
  );

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
        className:
          "border-rose-200 bg-rose-50 text-rose-900 animate-in fade-in zoom-in-95",
      });
    },
    onSuccess: (_data, variables) => {
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
    onError: (e) => {
      setError(getErrorMessage(e, "Failed to delete job"));
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({
        title: "Delete failed",
        description: getErrorMessage(e, "The job could not be removed."),
        variant: "destructive",
        duration: 2400,
        className:
          "border-rose-200 bg-rose-50 text-rose-900 animate-in fade-in zoom-in-95",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
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

  function filenameFromDisposition(disposition: string | null) {
    if (!disposition) return null;
    const match = disposition.match(/filename="?([^"]+)"?/i);
    return match?.[1] ?? null;
  }

  async function generateResume(job: JobItem) {
    setGeneratingIds((prev) => new Set(prev).add(job.id));
    setError(null);
    try {
      const res = await fetch("/api/applications/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || json?.error || "Failed to generate resume");
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download =
        filenameFromDisposition(res.headers.get("content-disposition")) || "resume.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);

      toast({
        title: "Resume generated",
        description: "PDF downloaded and application record updated.",
        duration: 2000,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900 animate-in fade-in zoom-in-95",
      });
    } catch (e) {
      const message = getErrorMessage(e, "Failed to generate resume");
      setError(message);
      toast({
        title: "Generate failed",
        description: message,
        variant: "destructive",
        duration: 2600,
        className:
          "border-rose-200 bg-rose-50 text-rose-900 animate-in fade-in zoom-in-95",
      });
    } finally {
      setGeneratingIds((prev) => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    }
  }

  async function generateCoverLetter(job: JobItem) {
    setCoverGeneratingIds((prev) => new Set(prev).add(job.id));
    setError(null);
    try {
      const res = await fetch("/api/applications/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          json?.error?.message || json?.error || "Failed to generate cover letter",
        );
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download =
        filenameFromDisposition(res.headers.get("content-disposition")) || "cover-letter.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);

      toast({
        title: "Cover letter generated",
        description: "PDF downloaded and application record updated.",
        duration: 2000,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-900 animate-in fade-in zoom-in-95",
      });
    } catch (e) {
      const message = getErrorMessage(e, "Failed to generate cover letter");
      setError(message);
      toast({
        title: "Generate failed",
        description: message,
        variant: "destructive",
        duration: 2600,
        className:
          "border-rose-200 bg-rose-50 text-rose-900 animate-in fade-in zoom-in-95",
      });
    } finally {
      setCoverGeneratingIds((prev) => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    }
  }

  function scheduleDelete(job: JobItem) {
    const previous = queryClient.getQueryData<JobsResponse>(["jobs", queryString, cursor]);
    const previousSelectedId = selectedId;
    setError(null);
    setDeletingIds((prev) => new Set(prev).add(job.id));
    queryClient.setQueryData<JobsResponse>(["jobs", queryString, cursor], (old) => {
      if (!old) return old;
      return { ...old, items: old.items.filter((it) => it.id !== job.id) };
    });
    if (selectedId === job.id) {
      setSelectedId(null);
    }

    const commitDelete = () => {
      pendingDeleteRef.current.delete(job.id);
      deleteMutation.mutate(job.id);
    };
    const timeoutId = setTimeout(commitDelete, deleteUndoMs);

    pendingDeleteRef.current.set(job.id, { timeoutId, previous, previousSelectedId });

    const undo = () => {
      const pending = pendingDeleteRef.current.get(job.id);
      if (!pending) return;
      clearTimeout(pending.timeoutId);
      pendingDeleteRef.current.delete(job.id);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
      if (pending.previous) {
        queryClient.setQueryData(["jobs", queryString, cursor], pending.previous);
      } else {
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
      }
      if (pending.previousSelectedId) {
        setSelectedId(pending.previousSelectedId);
      }
    };

    toast({
      title: "Job removed",
      description: "Undo to restore this role.",
      duration: deleteUndoMs,
      className:
        "border-slate-900/10 bg-white/95 text-slate-900 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] backdrop-blur animate-in fade-in zoom-in-95",
      action: (
        <ToastAction
          altText="Undo"
          onClick={undo}
          className="border-slate-900/15 bg-slate-900/5 text-slate-900 hover:bg-slate-900/10"
        >
          Undo
        </ToastAction>
      ),
    });
  }

  const statusClass: Record<JobStatus, string> = {
    NEW: "bg-emerald-100 text-emerald-700",
    APPLIED: "bg-sky-100 text-sky-700",
    REJECTED: "bg-slate-200 text-slate-600",
  };

  const effectiveSelectedId = useMemo(() => {
    if (!items.length) return null;
    if (selectedId && items.some((it) => it.id === selectedId)) return selectedId;
    return items[0]?.id ?? null;
  }, [items, selectedId]);

  const selectedJob = items.find((it) => it.id === effectiveSelectedId) ?? null;
  const detailsScrollRef = useRef<HTMLDivElement | null>(null);
  const listPadding = 12;
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => resultsViewportRef.current,
    getItemKey: (index) => items[index]?.id ?? index,
    estimateSize: () => 120,
    overscan: 6,
    measureElement: (el) => el.getBoundingClientRect().height,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();
  const canVirtualize = resultsViewportReady && virtualItems.length > 0;
  const detailQuery = useQuery({
    queryKey: ["job-details", effectiveSelectedId],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${effectiveSelectedId}`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load details");
      return json as { id: string; description: string | null };
    },
    enabled: Boolean(effectiveSelectedId),
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

  const markdownStyles = useMemo(
    () => ({
      heading: "text-base font-semibold text-slate-900",
      subheading: "text-sm font-semibold text-slate-900",
      paragraph: "text-sm leading-7 text-slate-700",
      list: "list-disc space-y-1 pl-5 text-sm text-slate-700",
      listOrdered: "list-decimal space-y-1 pl-5 text-sm text-slate-700",
      listItem: "text-sm leading-7 text-slate-700",
      blockquote: "border-l-2 border-slate-200 bg-slate-50/60 px-4 py-2 text-sm text-slate-700",
      codeInline: "rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800",
      pre: "rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 overflow-auto",
      link: "text-emerald-700 underline-offset-4 hover:underline",
      table: "w-full border-collapse text-sm",
      th: "border border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-900",
      td: "border border-slate-200 px-3 py-2 text-slate-700",
    }),
    [],
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
    <div
      data-testid="jobs-shell"
      className="edu-page-enter relative flex h-full flex-1 min-h-0 flex-col gap-6 text-foreground"
    >
      <div className="flex h-full min-h-0 flex-1 flex-col gap-6">
        <div
        data-testid="jobs-toolbar"
        className="rounded-3xl border-2 border-slate-900/10 bg-white/80 p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition-shadow duration-200 ease-out hover:shadow-[0_26px_55px_-40px_rgba(15,23,42,0.4)]"
      >
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_0.8fr_0.8fr_0.9fr_auto] lg:items-end">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Title or Keywords</div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="e.g. software engineer"
                value={q}
                onChange={(e) => {
                  resetPagination();
                  setQ(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Select
                value={locationFilter}
                onValueChange={(v) => {
                  startTransition(() => {
                    resetPagination();
                    setLocationFilter(v);
                  });
                }}
              >
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
            <Select
              value={jobLevelFilter}
              onValueChange={(v) => {
                startTransition(() => {
                  resetPagination();
                  setJobLevelFilter(v);
                });
              }}
            >
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
              onValueChange={(v) => {
                startTransition(() => {
                  resetPagination();
                  setStatusFilter(v as JobStatus | "ALL");
                });
              }}
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
            <Select
              value={sortOrder}
              onValueChange={(v) => {
                startTransition(() => {
                  resetPagination();
                  setSortOrder(v as "newest" | "oldest");
                });
              }}
            >
              <SelectTrigger className="h-9 bg-muted/40">
                <SelectValue placeholder="Posted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Posted: newest</SelectItem>
                <SelectItem value="oldest">Posted: oldest</SelectItem>
              </SelectContent>
            </Select>
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
        </div>
      </div>

      {activeError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {activeError}
        </div>
      ) : null}

        <section className="grid flex-1 min-h-0 gap-4 overflow-hidden lg:max-h-[calc(100vh-260px)] lg:grid-cols-[380px_1fr] lg:items-stretch">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border-2 border-slate-900/10 bg-white/80 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.3)] backdrop-blur transition-shadow duration-200 ease-out hover:shadow-[0_24px_50px_-36px_rgba(15,23,42,0.38)] lg:max-h-[calc(100vh-260px)]">
          {showLoadingOverlay ? <div className="edu-loading-bar" aria-hidden /> : null}
          <div className="flex items-center justify-between border-b px-4 py-3 text-sm font-semibold">
            <span>Results</span>
            <span className="text-xs text-muted-foreground">Page {pageIndex + 1}</span>
          </div>
          <ScrollArea
            ref={resultsScrollRef}
            data-testid="jobs-results-scroll"
            data-loading={showLoadingOverlay ? "true" : "false"}
            data-virtual="true"
            className={`max-h-full flex-1 min-h-0 transition-opacity duration-200 ease-out ${listOpacityClass}`}
          >
            {loading && items.length === 0 ? (
              <div className="space-y-3 p-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={`s-${idx}`} className="rounded-lg border p-3">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="mt-2 h-3 w-1/2" />
                    <Skeleton className="mt-2 h-3 w-1/3" />
                  </div>
                ))}
              </div>
            ) : null}
            {items.length > 0 ? (
              canVirtualize ? (
                <div
                  className="relative w-full"
                  style={{ height: rowVirtualizer.getTotalSize() + listPadding * 2 }}
                >
                  {virtualItems.map((virtualRow) => {
                    const it = items[virtualRow.index];
                    const active = it.id === effectiveSelectedId;
                    return (
                      <div
                        key={it.id}
                        ref={rowVirtualizer.measureElement}
                        data-index={virtualRow.index}
                        className="absolute left-0 right-0 px-3 pb-3"
                        style={{
                          transform: `translateY(${virtualRow.start + listPadding}px)`,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(it.id);
                          }}
                          data-perf="cv-auto"
                          className={`jobflow-list-item w-full rounded-2xl border border-l-4 border-slate-900/10 bg-white/80 px-3 py-3 text-left transition-all duration-200 ease-out hover:-translate-y-[1px] ${
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
                            {it.company ?? "-"} - {it.location ?? "-"}
                          </div>
                          <div className="mt-2 text-[11px] text-muted-foreground">
                            {it.jobType ?? "Unknown"} - {it.jobLevel ?? "Unknown"}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3 p-3">
                  {items.map((it) => {
                    const active = it.id === effectiveSelectedId;
                    return (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(it.id);
                        }}
                        data-perf="cv-auto"
                        className={`jobflow-list-item w-full rounded-2xl border border-l-4 border-slate-900/10 bg-white/80 px-3 py-3 text-left transition-all duration-200 ease-out hover:-translate-y-[1px] ${
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
                          {it.company ?? "-"} - {it.location ?? "-"}
                        </div>
                        <div className="mt-2 text-[11px] text-muted-foreground">
                          {it.jobType ?? "Unknown"} - {it.jobLevel ?? "Unknown"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )
            ) : !loading ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No jobs yet.
              </div>
            ) : null}
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
                    aria-disabled={prevDisabled}
                    className={
                      prevDisabled
                        ? "pointer-events-none cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }
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
                    aria-disabled={nextDisabled}
                    className={
                      nextDisabled
                        ? "pointer-events-none cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border-2 border-slate-900/10 bg-white/80 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.3)] backdrop-blur transition-shadow duration-200 ease-out hover:shadow-[0_24px_50px_-36px_rgba(15,23,42,0.38)] lg:max-h-[calc(100vh-260px)] lg:sticky lg:top-24">
          {showLoadingOverlay ? <div className="edu-loading-bar" aria-hidden /> : null}
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
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={generatingIds.has(selectedJob.id)}
                    onClick={() => generateResume(selectedJob)}
                    className="edu-cta--press edu-outline--compact h-9 gap-1 px-3"
                  >
                    <FileText className="h-4 w-4" />
                    {generatingIds.has(selectedJob.id) ? "Generating..." : "Generate CV"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={coverGeneratingIds.has(selectedJob.id)}
                    onClick={() => generateCoverLetter(selectedJob)}
                    className="edu-cta--press edu-outline--compact h-9 gap-1 px-3"
                  >
                    <FileText className="h-4 w-4" />
                    {coverGeneratingIds.has(selectedJob.id)
                      ? "Generating..."
                      : "Generate Cover Letter"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deletingIds.has(selectedJob.id)}
                    onClick={() => scheduleDelete(selectedJob)}
                    className="edu-cta--press edu-outline--compact gap-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Select a job to preview details.</div>
            )}
          </div>
          <ScrollArea
            data-testid="jobs-details-scroll"
            data-loading={showLoadingOverlay ? "true" : "false"}
            className={`max-h-full flex-1 min-h-0 transition-opacity duration-200 ease-out ${listOpacityClass}`}
          >
            <div key={effectiveSelectedId ?? "empty"} ref={detailsScrollRef} className="p-4">
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
                  <div className="space-y-3 rounded-lg border border-dashed border-slate-900/10 bg-transparent p-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-900/10 bg-transparent p-5">
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
                              h2: ({ children }) => (
                                <h2 className={markdownStyles.heading}>{renderHighlighted(children)}</h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className={markdownStyles.subheading}>{renderHighlighted(children)}</h3>
                              ),
                              p: ({ children }) => (
                                <p className={markdownStyles.paragraph}>
                                  {renderHighlighted(children)}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className={markdownStyles.list}>{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className={markdownStyles.listOrdered}>{children}</ol>
                              ),
                              li: ({ children }) => (
                                <li className={markdownStyles.listItem}>
                                  {renderHighlighted(children)}
                                </li>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className={markdownStyles.blockquote}>{children}</blockquote>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-slate-900">
                                  {renderHighlighted(children)}
                                </strong>
                              ),
                              a: ({ href, children }) => (
                                <a href={href} className={markdownStyles.link} target="_blank" rel="noreferrer">
                                  {children}
                                </a>
                              ),
                              pre: ({ children }) => <pre className={markdownStyles.pre}>{children}</pre>,
                              code: ({ className, children }) => {
                                const isInline = !className;
                                return isInline ? (
                                  <code className={markdownStyles.codeInline}>{children}</code>
                                ) : (
                                  <code className={className}>{children}</code>
                                );
                              },
                              table: ({ children }) => (
                                <table className={markdownStyles.table}>{children}</table>
                              ),
                              th: ({ children }) => <th className={markdownStyles.th}>{children}</th>,
                              td: ({ children }) => <td className={markdownStyles.td}>{children}</td>,
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
    </div>
  );
}
