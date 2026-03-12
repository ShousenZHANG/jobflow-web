"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { MobileNav } from "./MobileNav";

/**
 * Minimal top bar for landing first screen (big-tech pattern).
 * Logo + single CTA link; full nav (Jobs, Fetch) available via mobile menu or scroll if we add scroll-to-nav later.
 */
export function LandingNav() {
  const t = useTranslations("marketing");

  return (
    <nav
      aria-label="Main navigation"
      className="edu-landing-bar relative z-[2] flex w-full items-center justify-between px-4 py-4 md:px-6"
    >
      <Link
        href="/"
        className="flex items-center gap-2"
        aria-label="Jobflow home"
      >
        <div className="edu-logo h-9 w-9">
          <Search className="h-4 w-4 text-emerald-700" />
        </div>
        <span className="text-base font-semibold text-slate-900">Jobflow</span>
      </Link>
      <div className="flex items-center gap-1 sm:gap-2">
        <MobileNav />
        <Link
          href="/login"
          className="edu-landing-cta flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-3 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900 md:min-h-0 md:min-w-0 md:px-0 md:text-base md:justify-start"
        >
          {t("login")}
        </Link>
        <Link
          href="/login"
          className="edu-cta edu-cta--press hidden min-h-[44px] items-center rounded-lg px-4 py-2 text-sm font-semibold md:inline-flex"
        >
          {t("cta")}
        </Link>
      </div>
    </nav>
  );
}
