"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const { data } = useSession();
  const pathname = usePathname();

  const links = [
    { href: "/jobs", label: "Jobs" },
    { href: "/fetch", label: "Fetch" },
    { href: "/resume", label: "Resume" },
  ];
  const email = data?.user?.email ?? "";

  return (
    <div className="sticky top-0 z-40">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6" style={{ height: 88 }}>
        <div className="edu-nav edu-nav--press">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="edu-logo">
                <Search className="h-4 w-4 text-emerald-700" />
              </div>
              <Link className="text-lg font-semibold text-slate-900" href="/">
                Jobflow
              </Link>
            </div>
            <nav className="hidden items-center gap-2 md:flex">
              {links.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`edu-nav-link edu-nav-pill ${
                      active ? "edu-nav-pill--active" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="hidden text-emerald-700 transition hover:text-emerald-800 hover:underline sm:inline"
              >
                {email}
              </a>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              className="edu-outline edu-cta--press edu-outline--compact h-9 px-3 text-xs"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

