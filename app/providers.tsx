"use client";

import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextTopLoader color="#111827" height={2} showSpinner={false} />
      {children}
    </SessionProvider>
  );
}

