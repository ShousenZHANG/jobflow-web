import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
        <header className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <Badge className="w-fit" variant="secondary">
              Jobflow for job seekers
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              A clean, focused job tracker built to help you land faster.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Organize applications, capture insights, and run curated job fetches with clarity.
              Everything is designed around the way job seekers actually work.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/jobs">Open dashboard</Link>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>What you get</CardTitle>
              <CardDescription>All the essentials in one clear workspace.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {[
                "Structured pipeline with status tracking",
                "Smart search across title & company",
                "Fast import with JobSpy automation",
                "A clean UI optimized for focus",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Centralized tracking",
              copy:
                "Keep every opportunity in one clean list with status control and source links.",
            },
            {
              title: "Smart filters",
              copy:
                "Search by title or company, then filter by status to focus on the next move.",
            },
            {
              title: "Automated discovery",
              copy:
                "Trigger JobSpy runs with your criteria and import curated results instantly.",
            },
          ].map((card) => (
            <Card key={card.title}>
              <CardHeader>
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.copy}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Built for focus</CardTitle>
            <CardDescription>
              Jobflow removes noise, surfaces relevant roles, and lets you decide what to pursue.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}

