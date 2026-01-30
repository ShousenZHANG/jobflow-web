import { Fredoka, Nunito } from "next/font/google";
import { TopNav } from "./TopNav";
import { RouteTransition } from "../RouteTransition";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-edu-display",
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-edu-body",
  weight: ["300", "400", "500", "600", "700"],
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`app-edu ${fredoka.variable} ${nunito.variable} relative flex min-h-screen flex-col overflow-hidden`}>
      <div className="edu-bg" />
      <div className="edu-blob edu-blob--mint" />
      <div className="edu-blob edu-blob--peach" />
      <TopNav />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8">
        <RouteTransition>{children}</RouteTransition>
      </div>
    </div>
  );
}

