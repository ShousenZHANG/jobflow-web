import Link from "next/link";
import { Baloo_2, Comic_Neue } from "next/font/google";
import { ArrowRight, BookOpen, GraduationCap, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-edu-display",
});

const comic = Comic_Neue({
  subsets: ["latin"],
  variable: "--font-edu-body",
  weight: ["300", "400", "700"],
});

export default function HomePage() {
  return (
    <main className={`marketing-edu ${baloo.variable} ${comic.variable} relative min-h-screen overflow-hidden`}>
      <div className="edu-bg" />
      <div className="edu-blob edu-blob--mint" />
      <div className="edu-blob edu-blob--peach" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-10">
        <nav className="edu-nav">
          <div className="flex items-center gap-3">
            <div className="edu-logo">
              <GraduationCap className="h-5 w-5 text-emerald-700" />
            </div>
            <span className="text-lg font-semibold text-slate-900">Jobflow</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <span className="cursor-pointer transition hover:text-slate-900">Jobs</span>
            <span className="cursor-pointer transition hover:text-slate-900">Fetch</span>
            <span className="cursor-pointer transition hover:text-slate-900">Insights</span>
            <span className="cursor-pointer transition hover:text-slate-900">About</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="edu-outline">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="edu-cta">
              <Link href="/login">Start free</Link>
            </Button>
          </div>
        </nav>

        <header className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="edu-enter">
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
              Shortlist, review, and move candidates forward with clarity and calm.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="edu-cta">
                <Link href="/login">
                  Start hiring <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="edu-outline">
                <Link href="/jobs">Open dashboard</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-8 text-sm text-slate-600">
              <div>
                <div className="text-2xl font-semibold text-slate-900">10K+</div>
                Roles tracked
              </div>
              <div>
                <div className="text-2xl font-semibold text-slate-900">2M+</div>
                Updates synced
              </div>
              <div>
                <div className="text-2xl font-semibold text-slate-900">500+</div>
                Teams onboarded
              </div>
            </div>
          </div>

          <div className="edu-enter delay-1">
            <div className="edu-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100">
                    <BookOpen className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Senior Frontend</div>
                    <div className="text-xs text-slate-500">12 applicants · 4h</div>
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
              <Button className="mt-5 w-full edu-cta">Continue review</Button>
            </div>

            <div className="edu-float edu-float--target">
              <Target className="h-5 w-5 text-pink-600" />
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
