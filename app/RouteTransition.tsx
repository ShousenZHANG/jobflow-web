"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const transition = reduce ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={pathname}
        initial={reduce ? false : { opacity: 0, scale: 0.985 }}
        animate={reduce ? {} : { opacity: 1, scale: 1 }}
        exit={reduce ? {} : { opacity: 0, scale: 0.985 }}
        transition={transition}
        data-route-transition="fade-scale"
        className="flex min-h-0 flex-1 flex-col"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

