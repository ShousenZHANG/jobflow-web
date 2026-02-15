"use client";

import { useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const appShell = document.querySelector<HTMLElement>(".app-shell");
    if (appShell) {
      appShell.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const transition = reduce ? { duration: 0 } : { duration: 0.22, ease };

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={pathname}
        initial={reduce ? false : { opacity: 0, scale: 0.985 }}
        animate={reduce ? {} : { opacity: 1, scale: 1 }}
        exit={reduce ? {} : { opacity: 0, scale: 1.005 }}
        transition={transition}
        data-route-transition="fade"
        className="flex min-h-0 flex-1 flex-col origin-top [will-change:transform,opacity]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

