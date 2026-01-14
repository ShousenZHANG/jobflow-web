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
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-3">
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