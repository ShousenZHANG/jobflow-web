"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { CircleHelp, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useGuide } from "../GuideContext";

export function TopNav() {
  const { data } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { openGuide, state } = useGuide();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  const prepareRouteChange = () => {
    const appShell = document.querySelector<HTMLElement>(".app-shell");
    if (appShell) {
      appShell.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const links = [
    { href: "/jobs", label: t("jobs") },
    { href: "/fetch", label: t("fetch") },
    { href: "/resume", label: t("resume") },
    { href: "/automation", label: t("automation") },
  ];
  const activeLink = links.find((link) => pathname.startsWith(link.href)) ?? links[0];
  const email = data?.user?.email ?? "";

  return (
    <div className="sticky top-0 z-40">
      <div className="relative app-frame py-2">
        {/* Desktop nav */}
        <div className="hidden lg:block">
          <div className="edu-nav edu-nav--press flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
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
              <nav className="flex items-center gap-2">
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
                {t("guide")}
                {state ? (
                  <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {state.completedCount}/{state.totalCount}
                  </span>
                ) : null}
              </Button>
              <LocaleSwitcher />
              <Button
                variant="outline"
                size="sm"
                className="edu-outline edu-cta--press edu-outline--compact h-9 px-3 text-xs"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                {tc("signOut")}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile nav – minimal app bar */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-3xl border-2 border-slate-900/10 bg-white/90 px-3 py-2 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)]">
            <div className="flex items-center gap-2">
              <div className="edu-logo h-9 w-9">
                <Search className="h-4 w-4 text-emerald-700" />
              </div>
              <Link
                href="/"
                className="text-sm font-semibold text-slate-900"
              >
                Jobflow
              </Link>
            </div>
            <div
              data-testid="mobile-current-route"
              className="text-xs font-semibold text-slate-800"
            >
              {activeLink.label}
            </div>
            <div className="flex items-center gap-1">
              <LocaleSwitcher />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <Button
              variant="outline"
              size="sm"
              className="edu-outline edu-cta--press edu-outline--compact h-8 flex-1 px-2 text-[11px]"
              onClick={openGuide}
            >
              <CircleHelp className="mr-1 h-3 w-3" />
              {t("guide")}
              {state ? (
                <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                  {state.completedCount}/{state.totalCount}
                </span>
              ) : null}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="edu-outline edu-cta--press edu-outline--compact h-8 flex-1 px-2 text-[11px]"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              {tc("signOut")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

