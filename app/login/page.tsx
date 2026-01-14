"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
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