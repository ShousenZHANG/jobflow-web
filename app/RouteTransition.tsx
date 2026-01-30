"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const transition = reduce ? { duration: 0 } : { duration: 0.18 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        exit={reduce ? {} : { opacity: 0, y: -6 }}
        transition={transition}
        className="flex min-h-0 flex-1 flex-col"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

