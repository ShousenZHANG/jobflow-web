import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 tech-grid">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
        <header className="flex flex-col gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-zinc-950 px-3 py-1 text-xs font-medium text-emerald-300 glow">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Jobflow CLI Console
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-100 md:text-6xl">
            A command‑style job dashboard built for focus.
          </h1>
          <p className="max-w-2xl text-lg text-zinc-400">
            Minimal UI, maximal clarity. Filter the noise, capture the signal,
            and keep every opportunity in one terminal‑inspired workspace.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-emerald-200 transition hover:bg-emerald-500/20"
              href="/login"
            >
              Sign in
            </Link>
            <Link className="rounded-full border border-emerald-500/20 px-5 py-2 text-emerald-200 transition hover:bg-emerald-500/10" href="/jobs">
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
            <div key={card.title} className="rounded-2xl border border-emerald-500/20 bg-zinc-950 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-emerald-200">{card.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{card.copy}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-emerald-500/20 bg-zinc-950 p-8 shadow-sm">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-emerald-200">Built for focus</h3>
            <p className="text-sm text-zinc-400">
              Jobflow removes noise, surfaces relevant roles, and lets you decide what to pursue.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

