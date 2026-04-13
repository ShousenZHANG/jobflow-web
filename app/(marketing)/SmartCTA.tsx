"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type SmartCTAProps = {
  label: string;
  className?: string;
};

export function SmartCTA({ label, className }: SmartCTAProps) {
  const { status } = useSession();
  const href = status === "authenticated" ? "/jobs" : status === "unauthenticated" ? "/login" : "#";
  const loading = status === "loading";

  return (
    <Button asChild size="lg" className={className} aria-disabled={loading}>
      <Link href={href} tabIndex={loading ? -1 : undefined} style={loading ? { pointerEvents: "none", opacity: 0.6 } : undefined}>
        {label} <ArrowRight className="h-4 w-4 shrink-0" />
      </Link>
    </Button>
  );
}
