import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-white animated-gradient">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
        <header className="flex flex-col gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium text-zinc-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Jobflow Dashboard
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-900 md:text-6xl">
            Track applications and discover jobs with precision.
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600">
            A focused dashboard that keeps your job pipeline organized, filters
            noise, and imports new roles straight into your workflow.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2 text-white transition hover:bg-zinc-800"
              href="/login"
            >
              Sign in
            </Link>
            <Link className="rounded-full border px-5 py-2 transition hover:bg-zinc-100" href="/jobs">
              Open dashboard
            </Link>
          </div>
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
            <div key={card.title} className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-zinc-900">{card.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{card.copy}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-zinc-900">Built for focus</h3>
            <p className="text-sm text-zinc-600">
              Jobflow removes noise, surfaces relevant roles, and lets you decide what to pursue.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

