import { TopNav } from "./TopNav";
import { RouteTransition } from "../RouteTransition";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <TopNav />
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <RouteTransition>{children}</RouteTransition>
      </div>
    </div>
  );
}

