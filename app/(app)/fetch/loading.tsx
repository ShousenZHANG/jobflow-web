import { LoadingBubbles } from "@/components/ui/loading-bubbles";

export default function LoadingFetch() {
  return (
    <div className="route-loading-enter space-y-4">
      <div className="flex h-12 items-center justify-between rounded-xl bg-muted/70 px-4">
        <LoadingBubbles label="Loading fetch results" />
        <div className="h-2 w-24 rounded-full bg-muted-foreground/25" />
      </div>
      <div className="h-40 rounded-xl bg-muted animate-pulse" />
      <div className="h-40 rounded-xl bg-muted animate-pulse" />
    </div>
  );
}

