export default function MarketingLoading() {
  return (
    <div className="marketing-edu relative min-h-screen overflow-hidden">
      <div className="edu-bg" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-16 px-6 py-8">
        {/* Nav skeleton */}
        <div className="h-[72px] w-full max-w-5xl rounded-full border-3 border-slate-200 bg-white/80" />

        {/* Hero skeleton */}
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <div className="h-7 w-48 animate-pulse rounded-full bg-slate-200" />
            <div className="h-14 w-full max-w-md animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-5 w-64 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 flex gap-3">
              <div className="h-12 w-40 animate-pulse rounded-full bg-slate-200" />
              <div className="h-12 w-36 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="mt-4 grid w-full max-w-md grid-cols-3 gap-6">
              <div className="h-14 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-14 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-14 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="h-[340px] w-full max-w-md animate-pulse rounded-[32px] border-3 border-slate-200 bg-white/60" />
          </div>
        </div>

        {/* Features skeleton */}
        <div className="w-full max-w-5xl space-y-6">
          <div className="mx-auto h-8 w-80 animate-pulse rounded-xl bg-slate-200" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-[24px] border-3 border-slate-200 bg-white/60"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
