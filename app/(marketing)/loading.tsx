export default function MarketingLoading() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-8 w-40 rounded-full shimmer" />
        <div className="h-12 w-3/4 rounded-xl shimmer" />
        <div className="h-6 w-2/3 rounded-xl shimmer" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-32 rounded-2xl shimmer" />
          <div className="h-32 rounded-2xl shimmer" />
          <div className="h-32 rounded-2xl shimmer" />
        </div>
      </div>
    </div>
  );
}

