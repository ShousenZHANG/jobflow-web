import Link from "next/link";
import { ArrowRight, Briefcase, Compass, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f5f0]">
      <div className="marketing-grid" />
      <div className="marketing-orb marketing-orb--gold" />
      <div className="marketing-orb marketing-orb--ink" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-16">
        <header className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <Badge className="w-fit border-white/60 bg-white/70 text-xs uppercase tracking-[0.2em] text-foreground shadow-sm backdrop-blur">
              Jobflow workspace
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl">
              Hire in one flow.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Search, triage, decide. A calm workspace that keeps momentum without noise.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <Link href="/login">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/jobs">Open dashboard</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <div className="rounded-full border border-white/60 bg-white/70 px-3 py-1 backdrop-blur">
                Live status tracking
              </div>
              <div className="rounded-full border border-white/60 bg-white/70 px-3 py-1 backdrop-blur">
                Instant shortlist
              </div>
              <div className="rounded-full border border-white/60 bg-white/70 px-3 py-1 backdrop-blur">
                Zero clutter
              </div>
            </div>
          </div>

          <Card className="border-white/70 bg-white/80 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.55)] backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Today’s pulse</CardTitle>
              <CardDescription>Everything worth acting on.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "New roles", value: "12", icon: Briefcase },
                  { label: "Ready to review", value: "5", icon: Sparkles },
                  { label: "In flight", value: "3", icon: Compass },
                  { label: "Avg. time", value: "4m", icon: ArrowRight },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="group rounded-xl border border-white/70 bg-white/80 p-3 text-left transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="h-4 w-4 text-foreground/70" />
                      {label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/70 bg-white/75 p-3 text-sm text-muted-foreground">
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
          ].map((card) => (
            <Card
              key={card.title}
              className="group border-white/70 bg-white/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-35px_rgba(15,23,42,0.6)]"
            >
              <CardHeader>
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.copy}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group-hover:border-foreground/20">
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
