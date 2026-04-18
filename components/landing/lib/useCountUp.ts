"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Number-animation hook used by the Stats band. Starts at 0 and eases to
// `target` with a cubic ease-out over `durationMs`. Activates only when
// `active` flips true (pair with `framer-motion`'s `useInView`) so the
// RAF cost is zero until the element scrolls into view. Respects
// `prefers-reduced-motion` — jumps straight to `target`.

export interface UseCountUpOptions {
  target: number;
  durationMs?: number;
  active?: boolean;
}

export function useCountUp({
  target,
  durationMs = 1600,
  active = true,
}: UseCountUpOptions): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // When reduced-motion is on we bypass the effect entirely — the
    // hook's return expression below short-circuits to `target`, so there
    // is no setState-in-effect (and no RAF to manage).
    if (!active || reduced) return;

    startedAtRef.current = null;
    const tick = (now: number) => {
      if (startedAtRef.current === null) startedAtRef.current = now;
      const elapsed = now - startedAtRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, durationMs, active, reduced]);

  return reduced ? target : value;
}
