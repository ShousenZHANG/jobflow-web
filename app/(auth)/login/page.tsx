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

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <button onClick={() => signIn("google")} className="px-4 py-2 border rounded">
          Sign in with Google
        </button>
        <button onClick={() => signIn("github")} className="px-4 py-2 border rounded">
          Sign in with GitHub
        </button>
      </div>
    </main>
  );
}

