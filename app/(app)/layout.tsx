import { TopNav } from "./TopNav";
import { RouteTransition } from "../RouteTransition";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_0%_0%,rgba(202,138,4,0.16)_0%,rgba(250,250,249,0.96)_45%,rgba(250,250,249,1)_100%)]">
      <TopNav />
      <div className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <RouteTransition>{children}</RouteTransition>
      </div>
    </div>
  );
}

