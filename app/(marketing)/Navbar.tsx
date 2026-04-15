"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

const LINKS = [
  { key: "navHowItWorks", href: "#how-it-works" },
  { key: "navFeatures", href: "#features" },
  { key: "navBeforeAfter", href: "#before-after" },
  { key: "navGetStarted", href: "#get-started" },
] as const;

export function Navbar() {
  const t = useTranslations("marketing");
  const { status } = useSession();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSmoothScroll = useCallback(
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!href.startsWith("#")) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduceMotion],
  );

  const ctaHref =
    status === "authenticated"
      ? "/jobs"
      : status === "unauthenticated"
        ? "/login"
        : "#";
  const ctaLabel =
    status === "authenticated" ? t("navOpenApp") : t("navLogin");

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className="fixed inset-x-0 top-3 z-50 mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:top-4 sm:px-6"
      aria-label="Primary"
    >
      <div
        className={`flex w-full items-center justify-between rounded-full px-4 py-2 transition-all duration-300 sm:px-5 ${
          scrolled ? "nav-glass" : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight text-slate-900 transition-colors hover:text-emerald-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          aria-label="Joblit home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
            <Search className="h-3.5 w-3.5 text-emerald-700" strokeWidth={2.5} />
          </span>
          Joblit
        </Link>

        {/* Center links — hidden on mobile */}
        <ul className="hidden items-center gap-1 text-sm md:flex">
          {LINKS.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                onClick={handleSmoothScroll(link.href)}
                className="rounded-full px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-slate-900"
              >
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: locale switcher + CTA */}
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Link
            href={ctaHref}
            aria-disabled={status === "loading"}
            tabIndex={status === "loading" ? -1 : undefined}
            className={`rounded-full bg-slate-900 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md ${
              status === "loading" ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
