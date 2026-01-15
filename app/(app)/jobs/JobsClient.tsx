"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";

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

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("limit", "20");
    if (statusFilter !== "ALL") sp.set("status", statusFilter);
    if (q.trim()) sp.set("q", q.trim());
    return sp.toString();
  }, [statusFilter, q]);

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3 justify-between">
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600">Search</span>
            <input
              className="rounded border px-3 py-2"
              placeholder="title/company..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600">Status</span>
            <select
              className="rounded border px-3 py-2"
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

        <button className="rounded border px-4 py-2" onClick={() => signOut({ callbackUrl: "/login" })}>
          Sign out
        </button>
      </div>

      {error ? <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Company</th>
              <th className="text-left p-3">Location</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="p-3 font-medium">{it.title}</td>
                <td className="p-3">{it.company ?? "-"}</td>
                <td className="p-3">{it.location ?? "-"}</td>
                <td className="p-3">
                  <select
                    className="rounded border px-2 py-1"
                    value={it.status}
                    onChange={(e) => updateStatus(it.id, e.target.value as JobStatus)}
                  >
                    <option value="NEW">NEW</option>
                    <option value="APPLIED">APPLIED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </td>
                <td className="p-3">
                  <a className="underline" href={it.jobUrl} target="_blank" rel="noreferrer">
                    open
                  </a>
                </td>
              </tr>
            ))}
            {!items.length && !loading ? (
              <tr>
                <td className="p-3 text-zinc-500" colSpan={5}>
                  No jobs yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="rounded border px-4 py-2 disabled:opacity-50"
          disabled={loading || !nextCursor}
          onClick={() => fetchPage(nextCursor, false)}
        >
          {loading ? "Loading..." : nextCursor ? "Load more" : "No more"}
        </button>
        <a className="underline" href="/fetch">
          Fetch more
        </a>
      </div>
    </div>
  );
}

