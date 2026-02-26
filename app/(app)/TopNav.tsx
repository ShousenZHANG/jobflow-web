"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { CircleHelp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuide } from "../GuideContext";

export function TopNav() {
  const { data } = useSession();
  const pathname = usePathname();
  const { openGuide, state } = useGuide();

  const prepareRouteChange = () => {
    const appShell = document.querySelector<HTMLElement>(".app-shell");
    if (appShell) {
      appShell.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const links = [
    { href: "/jobs", label: "Jobs" },
    { href: "/fetch", label: "Fetch" },
    { href: "/resume", label: "Resume" },
    { href: "/automation", label: "Automation" },
  ];
  const email = data?.user?.email ?? "";

  return (
    <div className="sticky top-0 z-40">
      <div className="relative app-frame py-2">
        <div className="edu-nav edu-nav--press flex-col items-stretch gap-3 md:flex-row md:items-center">
          <div className="flex items-center justify-between gap-4 md:justify-start">
            <div className="flex items-center gap-3">
              <div className="edu-logo">
                <Search className="h-4 w-4 text-emerald-700" />
              </div>
              <Link
                className="text-lg font-semibold text-slate-900"
                href="/"
              >
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
                    onClick={prepareRouteChange}
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
          <nav
            className="edu-nav-mobile-tabs md:hidden"
            data-testid="mobile-tab-nav"
            aria-label="Primary"
          >
            <div className="edu-nav-mobile-tabs__row">
              {links.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={`mobile-${link.href}`}
                    href={link.href}
                    onClick={prepareRouteChange}
                    data-testid={`mobile-tab-${link.label.toLowerCase()}`}
                    className={`edu-nav-link edu-nav-pill edu-nav-mobile-pill ${
                      active ? "edu-nav-pill--active" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="flex w-full items-center justify-end gap-2 text-sm sm:gap-3 md:w-auto">
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
              className="edu-outline edu-cta--press edu-outline--compact h-9 flex-1 px-3 text-xs sm:flex-none"
              onClick={openGuide}
            >
              <CircleHelp className="mr-1 h-3.5 w-3.5" />
              Guide
              {state ? (
                <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {state.completedCount}/{state.totalCount}
                </span>
              ) : null}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="edu-outline edu-cta--press edu-outline--compact h-9 flex-1 px-3 text-xs sm:flex-none"
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

