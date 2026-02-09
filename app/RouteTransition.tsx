"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const transition = reduce ? { duration: 0 } : { duration: 0.18, ease };

  return (
    <AnimatePresence initial={false}>
      <motion.main
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        exit={reduce ? {} : { opacity: 0, y: -4 }}
        transition={transition}
        data-route-transition="fade"
        className="flex min-h-0 flex-1 flex-col [will-change:transform,opacity]"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

