"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 flex items-center gap-2">
          <AlertCircle className="size-5 text-emerald-600 dark:text-emerald-500" aria-hidden />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Something went wrong</h2>
        </div>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button type="button" onClick={reset} className="bg-emerald-600 text-white hover:bg-emerald-700">
          Try again
        </Button>
      </div>
    </div>
  );
}
