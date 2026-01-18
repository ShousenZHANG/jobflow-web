import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-violet-300/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200/30 via-sky-200/20 to-transparent blur-3xl" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-16">
        <header className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <Badge className="w-fit gap-2" variant="secondary">
              <Sparkles className="h-3.5 w-3.5" />
              Jobflow Dashboard
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Track, filter, and act on the right roles faster.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              One clean dashboard for fetch, review, and decision-making. Minimal noise. Maximum
              clarity.
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
          </div>
          <Card className="border-muted/70 bg-background/80 shadow-lg backdrop-blur">
            <CardHeader>
              <CardTitle>What to do first</CardTitle>
              <CardDescription>3 steps to get value immediately.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {[
                { title: "Start a fetch", copy: "Run a curated search in seconds." },
                { title: "Review results", copy: "Scan and update status fast." },
                { title: "Focus your pipeline", copy: "Prioritize what matters next." },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border bg-muted/40 p-3">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.copy}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Jobs board",
              copy: "All roles in one place with fast status controls.",
              href: "/jobs",
              cta: "Go to Jobs",
            },
            {
              title: "Fetch engine",
              copy: "Launch new searches with targeted filters.",
              href: "/fetch",
              cta: "Start Fetch",
            },
            {
              title: "Smart focus",
              copy: "Stay on top of what to apply for next.",
              href: "/jobs",
              cta: "Review Pipeline",
            },
          ].map((card) => (
            <Card key={card.title} className="transition hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.copy}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
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

