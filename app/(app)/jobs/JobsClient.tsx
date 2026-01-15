"use client";

import { useEffect, useMemo, useState } from "react";

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

  async function fetchPage(cursor?: string | null, replace?: boolean) {
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

      setItems((prev) => (replace ? newItems : [...prev, ...newItems]));
      setNextCursor(newCursor);
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // When filters change, reload from scratch
    setItems([]);
    setNextCursor(null);
    void fetchPage(null, true);
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

  const statusColor: Record<JobStatus, string> = {
    NEW: "bg-emerald-500/10 text-emerald-700",
    APPLIED: "bg-blue-500/10 text-blue-700",
    REJECTED: "bg-rose-500/10 text-rose-700",
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-end gap-3 justify-between">
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-zinc-600">Search</span>
              <input
                className="rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                placeholder="title/company..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-zinc-600">Status</span>
              <select
                className="rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="ALL">All</option>
                <option value="NEW">NEW</option>
                <option value="APPLIED">APPLIED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <section className="grid gap-3">
        {loading && items.length === 0 ? (
          <>
            <div className="rounded-2xl border bg-white p-4 shadow-sm shimmer h-24" />
            <div className="rounded-2xl border bg-white p-4 shadow-sm shimmer h-24" />
            <div className="rounded-2xl border bg-white p-4 shadow-sm shimmer h-24" />
          </>
        ) : null}
        {items.map((it) => (
          <div key={it.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="text-lg font-semibold">{it.title}</div>
                <div className="text-sm text-zinc-600">
                  {it.company ?? "-"} · {it.location ?? "-"}
                </div>
                <div className="text-xs text-zinc-500">
                  {it.jobType ?? "Unknown"} · {it.jobLevel ?? "Unknown"}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[it.status]}`}>
                  {it.status}
                </span>
                <select
                  className="rounded-full border px-3 py-1 text-xs"
                  value={it.status}
                  onChange={(e) => updateStatus(it.id, e.target.value as JobStatus)}
                >
                  <option value="NEW">NEW</option>
                  <option value="APPLIED">APPLIED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                <a className="text-xs underline" href={it.jobUrl} target="_blank" rel="noreferrer">
                  Open link
                </a>
              </div>
            </div>
          </div>
        ))}

        {!items.length && !loading ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-500">
            No jobs yet.
          </div>
        ) : null}
      </section>

      <div className="flex items-center gap-3">
        <button
          className="rounded-full border px-4 py-2 disabled:opacity-50"
          disabled={loading || !nextCursor}
          onClick={() => fetchPage(nextCursor, false)}
        >
          {loading ? "Loading..." : nextCursor ? "Load more" : "No more"}
        </button>
        <a className="text-sm underline" href="/fetch">
          Fetch more
        </a>
      </div>
    </div>
  );
}

