import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(29,78,216,0.08),_transparent_55%)]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
        <header className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <Badge className="w-fit" variant="outline">
              Hiring workspace
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl">
              Shortlist faster. Decide with confidence.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              A clean recruiting workspace to search, review, and move quickly.
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
          <Card className="border-muted/60 bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Start in minutes</CardTitle>
              <CardDescription>Three fast steps to your first shortlist.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {[
                { title: "Launch a search", copy: "Run curated queries for new roles." },
                { title: "Review candidates", copy: "Scan details and update status quickly." },
                { title: "Prioritize next steps", copy: "Keep your pipeline focused." },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border bg-muted/30 p-3">
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
              title: "Roles board",
              copy: "All roles in one place with clear status controls.",
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
              copy: "Track what’s ready to move next.",
              href: "/jobs",
              cta: "Review pipeline",
            },
          ].map((card) => (
            <Card key={card.title} className="transition hover:-translate-y-1 hover:shadow-md">
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

