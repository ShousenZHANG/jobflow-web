"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function TopNav() {
  const { data } = useSession();
  const pathname = usePathname();

  const links = [
    { href: "/jobs", label: "Jobs" },
    { href: "/fetch", label: "Fetch" },
  ];

  return (
    <div className="sticky top-0 z-40 border-b border-emerald-500/20 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link className="text-lg font-semibold tracking-tight text-emerald-400" href="/">
            Jobflow
          </Link>
          <nav className="flex items-center gap-2 text-sm text-zinc-400">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 transition ${
                    active
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "hover:bg-emerald-500/10 hover:text-emerald-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-zinc-500">{data?.user?.email ?? ""}</span>
          <button
            className="rounded-full border border-emerald-500/30 px-3 py-1.5 text-emerald-300 transition hover:bg-emerald-500/10"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

