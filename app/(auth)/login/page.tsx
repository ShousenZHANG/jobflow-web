"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <main className="min-h-screen bg-background px-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/25 via-purple-300/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gradient-to-tr from-sky-200/30 via-emerald-200/20 to-transparent blur-3xl" />
      </div>
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center py-16">
        <Card className="w-full max-w-lg border-muted/70 bg-background/90 shadow-xl backdrop-blur">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Sign in to Jobflow
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the dashboard and start your next fetch in seconds.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={() => handleSignIn("google")} className="w-full">
              Continue with Google
            </Button>
            <Button onClick={() => handleSignIn("github")} variant="outline" className="w-full gap-2">
              <Github className="h-4 w-4" />
              Continue with GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

