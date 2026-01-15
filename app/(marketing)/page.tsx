import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Jobflow
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-900 md:text-5xl">
            Job tracking and automated discovery in one dashboard.
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600">
            Sign in to manage applications, run targeted searches, and keep your
            pipeline organized with clear status tracking.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded border border-zinc-900 bg-zinc-900 px-4 py-2 text-white"
              href="/login"
            >
              Sign in
            </Link>
            <Link className="rounded border px-4 py-2" href="/jobs">
              View dashboard
            </Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded border p-5">
            <h2 className="text-base font-semibold text-zinc-900">Centralized jobs</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Keep all job opportunities in a single list with clear status and
              quick access to the source link.
            </p>
          </div>
          <div className="rounded border p-5">
            <h2 className="text-base font-semibold text-zinc-900">Smart filters</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Search by title or company and filter by status to focus on the
              next step.
            </p>
          </div>
          <div className="rounded border p-5">
            <h2 className="text-base font-semibold text-zinc-900">Automated fetch</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Trigger job discovery runs with your criteria and import results
              directly into your dashboard.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

