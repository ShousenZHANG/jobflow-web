export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="h-6 w-24 rounded-xl bg-muted animate-pulse" />
        <div className="h-10 rounded-xl bg-muted animate-pulse" />
        <div className="h-10 rounded-xl bg-muted animate-pulse" />
      </div>
    </div>
  );
}

