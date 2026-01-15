"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function TopNav() {
  const { data } = useSession();

  return (
    <div className="border-b bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link className="text-lg font-semibold" href="/">
            Jobflow
          </Link>
          <nav className="flex items-center gap-3 text-sm text-zinc-600">
            <Link className="hover:text-zinc-900" href="/jobs">
              Jobs
            </Link>
            <Link className="hover:text-zinc-900" href="/fetch">
              Fetch
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-zinc-600">{data?.user?.email ?? ""}</span>
          <button
            className="rounded border px-3 py-1"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

