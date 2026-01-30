import Link from "next/link";
import { Fredoka, Nunito } from "next/font/google";
import { ArrowRight, Menu, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-edu-display",
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-edu-body",
  weight: ["300", "400", "500", "600", "700"],
});

export default function HomePage() {
  return (
    <main className={`marketing-edu edu-page-enter ${fredoka.variable} ${nunito.variable} relative min-h-screen overflow-hidden`}>
      <div className="edu-bg" />
      <div className="edu-blob edu-blob--mint" />
      <div className="edu-blob edu-blob--peach" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-10 text-center md:gap-14">
        <nav className="edu-nav edu-nav--press w-full max-w-5xl">
          <div className="flex items-center gap-3">
            <div className="edu-logo">
              <Search className="h-5 w-5 text-emerald-700" />
            </div>
            <span className="text-lg font-semibold text-slate-900">Jobflow</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <Link href="/jobs" className="cursor-pointer transition hover:text-slate-900">
              Jobs
            </Link>
            <Link href="/fetch" className="cursor-pointer transition hover:text-slate-900">
              Fetch
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <details className="edu-menu md:hidden">
              <summary className="edu-outline edu-cta--press flex h-10 w-10 items-center justify-center">
                <Menu className="h-4 w-4" />
              </summary>
              <div className="edu-menu-panel">
                <Link href="/login" className="edu-fav-link">
                  Log in
                </Link>
                <Link href="/jobs" className="edu-fav-link">
                  Dashboard
                </Link>
              </div>
            </details>
            <Button asChild variant="outline" className="edu-outline edu-cta--press hidden md:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="edu-cta edu-cta--press hidden md:inline-flex">
              <Link href="/login">Start free</Link>
            </Button>
          </div>
        </nav>

        <header className="grid w-full max-w-5xl gap-10 text-center lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:text-left">
          <div className="edu-enter flex flex-col items-center lg:items-start">
            <Badge className="edu-pill">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              New: faster job discovery
            </Badge>
            <h1 className="edu-title mt-6 text-4xl leading-tight text-slate-900 md:text-6xl">
              Find the right roles,
              <span className="text-emerald-500"> faster</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
              Search smarter, compare quickly, and move with clarity.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button asChild className="edu-cta edu-cta--press">
                <Link href="/login">
                  Start searching <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="edu-outline edu-cta--press">
                <Link href="/jobs">Open dashboard</Link>
              </Button>
            </div>
            <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-6 text-sm text-slate-600 lg:max-w-none">
              <div>
                <div className="text-2xl font-semibold text-slate-900">1.2k+</div>
                Roles indexed
              </div>
              <div>
                <div className="text-2xl font-semibold text-slate-900">1 min</div>
                Avg. shortlist
              </div>
              <div>
                <div className="text-2xl font-semibold text-slate-900">2.4x</div>
                Faster discovery
              </div>
            </div>
          </div>

          <div className="edu-enter delay-1 flex w-full items-center justify-center lg:justify-end">
            <div className="edu-card w-full max-w-md text-left">
              <div className="text-sm font-semibold text-slate-900">Role search</div>
              <p className="mt-1 text-xs text-slate-500">Refine your search to see better matches.</p>
              <div className="mt-4 grid gap-3">
                <div className="edu-input">
                  <span className="text-xs text-slate-500">Title</span>
                  <div className="text-sm text-slate-900">Frontend Engineer</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="edu-input">
                    <span className="text-xs text-slate-500">Location</span>
                    <div className="text-sm text-slate-900">Remote</div>
                  </div>
                  <div className="edu-input">
                    <span className="text-xs text-slate-500">Level</span>
                    <div className="text-sm text-slate-900">Mid-level</div>
                  </div>
                </div>
                <div className="edu-input">
                  <span className="text-xs text-slate-500">Results</span>
                  <div className="text-sm text-slate-900">128 roles available</div>
                </div>
              </div>
              <Button asChild className="mt-5 w-full edu-cta edu-cta--press">
                <Link href="/jobs">View matches</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="edu-footer w-full max-w-5xl text-left">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <div className="edu-logo h-10 w-10">
                  <Search className="h-4 w-4 text-emerald-700" />
                </div>
                Jobflow
              </div>
              <p className="text-sm text-slate-600">
                A calm space to search faster and keep your job hunt on track.
              </p>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="text-sm font-semibold text-slate-900">Explore</div>
              <div>Saved roles</div>
              <div>Recent searches</div>
              <div>Career tips</div>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="text-sm font-semibold text-slate-900">Support</div>
              <div>Help center</div>
              <div>Contact</div>
              <div>Privacy</div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>© 2026 Jobflow. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Terms</span>
              <span>Cookies</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
