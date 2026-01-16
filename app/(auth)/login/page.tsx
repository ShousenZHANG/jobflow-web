"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 tech-grid">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-emerald-500/30 bg-zinc-950 p-6 shadow-sm glow">
        <h1 className="text-xl font-semibold text-emerald-200">Sign in</h1>
        <button
          onClick={() => handleSignIn("google")}
          className="px-4 py-2 border border-emerald-500/30 rounded-full text-emerald-200 transition hover:bg-emerald-500/10"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => handleSignIn("github")}
          className="px-4 py-2 border border-emerald-500/30 rounded-full text-emerald-200 transition hover:bg-emerald-500/10"
        >
          Sign in with GitHub
        </button>
      </div>
    </main>
  );
}

