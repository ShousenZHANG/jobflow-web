"use client";

import { useEffect, useRef, useState } from "react";
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
  const [showRouteProgress, setShowRouteProgress] = useState(false);
  const progressDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetAppShellScroll = () => {
    const appShell = document.querySelector<HTMLElement>(".app-shell");
    if (appShell) {
      appShell.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const beginRouteFeedback = (href: string) => {
    resetAppShellScroll();
    if (href === pathname) return;
    if (progressDelayRef.current) {
      clearTimeout(progressDelayRef.current);
    }
    setShowRouteProgress(false);
    progressDelayRef.current = setTimeout(() => {
      setShowRouteProgress(true);
      progressDelayRef.current = null;
    }, 120);
  };

  useEffect(() => {
    if (progressDelayRef.current) {
      clearTimeout(progressDelayRef.current);
      progressDelayRef.current = null;
    }
    setShowRouteProgress(false);
  }, [pathname]);

  useEffect(
    () => () => {
      if (progressDelayRef.current) {
        clearTimeout(progressDelayRef.current);
      }
    },
    [],
  );

  const links = [
    { href: "/jobs", label: "Jobs" },
    { href: "/fetch", label: "Fetch" },
    { href: "/resume", label: "Resume" },
  ];
  const email = data?.user?.email ?? "";

  return (
    <div className="sticky top-0 z-40">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-4 sm:px-6" style={{ height: 88 }}>
        <div className="edu-nav edu-nav--press">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="edu-logo">
                <Search className="h-4 w-4 text-emerald-700" />
              </div>
              <Link
                className="text-lg font-semibold text-slate-900"
                href="/"
                onClick={() => beginRouteFeedback("/")}
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
                    onClick={() => beginRouteFeedback(link.href)}
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
              className="edu-outline edu-cta--press edu-outline--compact h-9 px-3 text-xs"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sign out
            </Button>
          </div>
        </div>
        <div
          aria-hidden="true"
          className={`edu-route-progress ${showRouteProgress ? "edu-route-progress--active" : ""}`}
        />
      </div>
    </div>
  );
}

