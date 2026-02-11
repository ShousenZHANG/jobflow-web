import { Fredoka, Nunito } from "next/font/google";
import { TopNav } from "./TopNav";
import { RouteTransition } from "../RouteTransition";
import { GuideProvider } from "../GuideContext";

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
      <GuideProvider>
        <TopNav />
        <div className="relative z-10 app-frame flex flex-1 flex-col py-8 app-shell">
          <RouteTransition>{children}</RouteTransition>
        </div>
      </GuideProvider>
    </div>
  );
}

