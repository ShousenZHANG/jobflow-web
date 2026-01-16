"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const { data } = useSession();
  const pathname = usePathname();

  const links = [
    { href: "/jobs", label: "Jobs" },
    { href: "/fetch", label: "Fetch" },
  ];

  return (
    <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link className="text-lg font-semibold tracking-tight" href="/">
            Jobflow
          </Link>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 transition ${
                    active ? "bg-secondary text-foreground" : "hover:bg-secondary/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{data?.user?.email ?? ""}</span>
          <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

