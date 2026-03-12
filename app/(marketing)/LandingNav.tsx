"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { MobileNav } from "./MobileNav";

/**
 * Landing nav: glass bar aligned with content, soft Log in + pill CTA.
 * Fits inside max-w-7xl so Jobflow / Log in / Start free feel part of the page.
 */
export function LandingNav() {
  const t = useTranslations("marketing");

  return (
    <nav
      aria-label="Main navigation"
      className="edu-landing-glass w-full rounded-2xl border border-slate-200/60 bg-white/75 px-4 py-3 backdrop-blur-md sm:px-5 sm:py-3.5"
    >
      <div className="flex w-full items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-slate-800 transition-colors hover:text-slate-900"
          aria-label="Jobflow home"
        >
          <div className="edu-landing-logo flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-700">
            <Search className="h-4 w-4" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight sm:text-base">
            Jobflow
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <MobileNav />
          <Link
            href="/login"
            className="edu-landing-login hidden min-h-[40px] items-center rounded-lg px-3 text-sm font-medium text-slate-600 outline-none transition-colors hover:bg-slate-100/80 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 md:inline-flex"
          >
            {t("login")}
          </Link>
          <Link
            href="/login"
            className="edu-landing-cta-pill inline-flex min-h-[40px] min-w-[44px] items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm outline-none transition-all hover:bg-emerald-700 hover:shadow focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 md:min-h-[42px] md:px-5"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
