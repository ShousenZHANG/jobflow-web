"use client";

import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { FetchProgressPanel } from "./FetchProgressPanel";
import { FetchStatusProvider } from "./FetchStatusContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextTopLoader color="#111827" height={2} showSpinner={false} />
      <FetchStatusProvider>
        {children}
        <FetchProgressPanel />
      </FetchStatusProvider>
      <Toaster />
    </SessionProvider>
  );
}

