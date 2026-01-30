import Link from "next/link";
import { Fredoka, Nunito } from "next/font/google";
import { ArrowRight, Briefcase, ClipboardList, Radar, Sparkles } from "lucide-react";
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
              <Briefcase className="h-5 w-5 text-emerald-700" />
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
              New: AI-powered hiring
            </Badge>
            <h1 className="mt-6 text-4xl leading-tight text-slate-900 md:text-6xl">
              Hire smarter,
              <span className="text-emerald-500"> faster</span>,
              every day.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
              Find roles, review candidates, move forward — all in one calm flow.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button asChild className="edu-cta edu-cta--press">
                <Link href="/login">
                  Start hiring <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="edu-outline edu-cta--press">
                <Link href="/jobs">Open dashboard</Link>
              </Button>
            </div>
            <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-6 text-sm text-slate-600 lg:max-w-none">
              <div>
                <div className="text-2xl font-semibold text-slate-900">8.4k</div>
                Roles tracked
              </div>
              <div>
                <div className="text-2xl font-semibold text-slate-900">2.1k</div>
                Reviews this week
              </div>
              <div>
                <div className="text-2xl font-semibold text-slate-900">3.2x</div>
                Faster decisions
              </div>
            </div>
          </div>

          <div className="edu-enter delay-1 flex w-full items-center justify-center lg:justify-end">
            <div className="edu-card w-full max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                    <ClipboardList className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900">Shortlist queue</div>
                    <div className="text-xs text-slate-500">12 new roles · 4h</div>
                  </div>
                </div>
                <span className="text-emerald-600 text-sm font-semibold">68%</span>
              </div>
              <div className="mt-4">
                <div className="text-xs text-slate-500">Pipeline</div>
                <div className="mt-2 h-3 rounded-full bg-slate-100">
                  <div className="h-3 w-2/3 rounded-full bg-emerald-400" />
                </div>
              </div>
              <Button className="mt-5 w-full edu-cta edu-cta--press">Continue review</Button>
            </div>

            <div className="edu-float edu-float--target">
              <Radar className="h-5 w-5 text-sky-600" />
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
