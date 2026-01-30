import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EEF2FF]">
      <div className="marketing-grid marketing-grid--indigo" />
      <div className="marketing-blob marketing-blob--indigo" />
      <div className="marketing-blob marketing-blob--orange" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-16">
        <header className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="enter-fade">
            <Badge className="w-fit border-white/70 bg-white/80 text-xs uppercase tracking-[0.2em] text-indigo-900 shadow-sm backdrop-blur">
              Jobflow workspace
            </Badge>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-indigo-950 md:text-6xl">
              Learn, hire, move faster.
            </h1>
            <p className="mt-5 max-w-xl text-base text-indigo-900/70 md:text-lg">
              A modern hiring hub that keeps teams aligned and momentum steady.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2 bg-[#F97316] text-white hover:bg-[#EA580C]">
                <Link href="/login">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-indigo-200 bg-white/70 text-indigo-900">
                <Link href="/jobs">Open dashboard</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-indigo-900/70">
              <div className="rounded-full border border-white/70 bg-white/80 px-3 py-1 backdrop-blur">
                Clear pipeline signals
              </div>
              <div className="rounded-full border border-white/70 bg-white/80 px-3 py-1 backdrop-blur">
                Fast role discovery
              </div>
              <div className="rounded-full border border-white/70 bg-white/80 px-3 py-1 backdrop-blur">
                Simple, focused UI
              </div>
            </div>
          </div>

          <Card className="enter-fade delay-1 rounded-3xl border-white/70 bg-white/80 shadow-[0_24px_60px_-40px_rgba(30,27,75,0.55)] backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-indigo-950">Today’s focus</CardTitle>
              <CardDescription className="text-indigo-900/70">Keep the next step obvious.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "New roles", value: "12", icon: BookOpen },
                  { label: "Ready to review", value: "5", icon: Sparkles },
                  { label: "In flight", value: "3", icon: Compass },
                  { label: "Avg. time", value: "4m", icon: ArrowRight },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="group rounded-2xl border border-white/70 bg-white/85 p-3 text-left transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-2 text-xs text-indigo-900/60">
                      <Icon className="h-4 w-4 text-indigo-900/70" />
                      {label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-indigo-950">{value}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-3 text-sm text-indigo-900/70">
                Next action: review Sydney ML Engineer shortlist.
              </div>
            </CardContent>
          </Card>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Roles board",
              copy: "Review faster with clear states.",
              href: "/jobs",
              cta: "Open roles",
            },
            {
              title: "Search engine",
              copy: "Launch targeted sourcing in seconds.",
              href: "/fetch",
              cta: "Start search",
            },
            {
              title: "Pipeline focus",
              copy: "Keep the next move visible.",
              href: "/jobs",
              cta: "Review pipeline",
            },
          ].map((card, index) => (
            <Card
              key={card.title}
              className={`enter-fade delay-${index + 2} group rounded-3xl border-white/70 bg-white/85 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-35px_rgba(30,27,75,0.45)]`}
            >
              <CardHeader>
                <CardTitle className="text-base text-indigo-950">{card.title}</CardTitle>
                <CardDescription className="text-indigo-900/70">{card.copy}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full border-indigo-200 bg-white/70 text-indigo-900 group-hover:border-indigo-300">
                  <Link href={card.href}>{card.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
