import Link from "next/link";
import { Fredoka, Nunito } from "next/font/google";
import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react";
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
    <main className={`marketing-edu ${fredoka.variable} ${nunito.variable} relative min-h-screen overflow-hidden`}>
      <div className="edu-bg" />
      <div className="edu-blob edu-blob--mint" />
      <div className="edu-blob edu-blob--peach" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-10 text-center md:gap-14">
        <nav className="edu-nav edu-nav--press w-full max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            <Button asChild variant="outline" className="edu-outline edu-cta--press">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="edu-cta edu-cta--press">
              <Link href="/login">Start free</Link>
            </Button>
          </div>
        </nav>

        <header className="grid w-full max-w-5xl gap-10 text-center lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:text-left">
          <div className="edu-enter flex flex-col items-center lg:items-start">
            <Badge className="edu-pill">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              New: faster job discovery
            </Badge>
            <h1 className="mt-6 text-4xl leading-tight text-slate-900 md:text-6xl">
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
                <div className="text-2xl font-semibold text-slate-900">5 min</div>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                    <Search className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Role search</div>
                    <div className="text-xs text-slate-500">Frontend · Remote</div>
                  </div>
                </div>
                <span className="text-emerald-600 text-sm font-semibold">128</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-600">
                  Location
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-600">
                  Level
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-600">
                  Hybrid
                </span>
              </div>
              <div className="mt-4">
                <div className="text-xs text-slate-500">Relevance</div>
                <div className="mt-2 h-3 rounded-full bg-slate-100">
                  <div className="h-3 w-3/4 rounded-full bg-emerald-400" />
                </div>
              </div>
              <Button className="mt-5 w-full edu-cta edu-cta--press">View matches</Button>
            </div>

            <div className="edu-float edu-float--target">
              <MapPin className="h-5 w-5 text-sky-600" />
            </div>
            <div className="edu-float edu-float--spark">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </header>
      </div>
    </main>
  );
}
