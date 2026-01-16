"use client";

import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { FetchProgressPanel } from "./FetchProgressPanel";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextTopLoader color="#111827" height={2} showSpinner={false} />
      {children}
      <FetchProgressPanel />
      <Toaster />
    </SessionProvider>
  );
}

