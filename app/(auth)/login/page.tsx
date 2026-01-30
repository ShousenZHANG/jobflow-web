"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Github, Search } from "lucide-react";
import { Fredoka, Nunito } from "next/font/google";
import { Button } from "@/components/ui/button";

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

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const sp = new URLSearchParams(window.location.search);
      const callbackUrl = sp.get("callbackUrl") || "/jobs";
      router.replace(callbackUrl);
    }
  }, [status, router]);

  function handleSignIn(provider: "google" | "github") {
    const sp = new URLSearchParams(window.location.search);
    const callbackUrl = sp.get("callbackUrl") || "/jobs";
    signIn(provider, { callbackUrl });
  }

  return (
    <main
      className={`marketing-edu edu-page-enter ${fredoka.variable} ${nunito.variable} relative min-h-screen overflow-hidden px-6`}
    >
      <div className="edu-bg" />
      <div className="edu-blob edu-blob--mint" />
      <div className="edu-blob edu-blob--peach" />

      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center py-16">
        <div className="edu-card w-full max-w-lg text-left">
          <div className="flex items-center gap-3">
            <div className="edu-logo">
              <Search className="h-4 w-4 text-emerald-700" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Jobflow</span>
          </div>
          <div className="mt-5">
            <span className="edu-pill inline-flex items-center gap-2 text-xs font-semibold">
              Secure sign in
            </span>
          </div>
          <h1 className="edu-title mt-4 text-3xl text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">
            Jump back into your job search and keep your shortlist moving.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={() => handleSignIn("google")} className="edu-cta edu-cta--press w-full">
              Continue with Google
            </Button>
            <Button
              onClick={() => handleSignIn("github")}
              variant="outline"
              className="edu-outline edu-cta--press w-full gap-2"
            >
              <Github className="h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            By signing in, you agree to the platform terms and privacy policy.
          </p>
        </div>
      </div>
    </main>
  );
}

