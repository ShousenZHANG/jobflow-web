"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Github } from "lucide-react";
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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(29,78,216,0.08),_transparent_55%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center py-16">
        <Card className="w-full max-w-lg border-muted/60 bg-card shadow-md">
          <CardHeader className="space-y-2">
            <div className="text-sm text-muted-foreground">Sign in to Jobflow</div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <p className="text-sm text-muted-foreground">
              Access your hiring workspace to review and launch searches.
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
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to the platform terms and privacy policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

