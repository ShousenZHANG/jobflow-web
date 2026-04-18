"use client";

import { useInView, type Variants } from "framer-motion";
import { useRef, type RefObject } from "react";

// Shared framer-motion variants for the marketing landing. Import these
// instead of hand-rolling values per section so reveal timing stays
// consistent and `prefers-reduced-motion` kills them uniformly.

const SPRING_EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: SPRING_EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: SPRING_EASE },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: SPRING_EASE },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const floatIn = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: SPRING_EASE },
  },
});

/**
 * Standard reveal-on-scroll props. Spread onto any `<motion.*>` element.
 *
 * Tuned by trial against Landing.html's reference: `amount: 0.12` keeps
 * the threshold low enough that tall sections (Features, Pricing) don't
 * sit visible in their hidden state, and a POSITIVE bottom margin
 * expands the IntersectionObserver root 15% below the viewport so the
 * reveal *pre-fires* while the element is still scrolling in.
 *
 * Retained for components that already use the prop spread. New sections
 * should prefer {@link useReveal} below — the hook form avoids a class
 * of propagation bugs where `whileInView` on a motion.section with
 * child variants would occasionally miss its initial intersection
 * after hydration.
 */
export const revealOnce = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.12, margin: "0px 0px 15% 0px" },
} as const;

export interface RevealProps {
  ref: RefObject<HTMLElement | null>;
  initial: "hidden";
  animate: "hidden" | "show";
}

/**
 * Hook-based reveal trigger. Use instead of {@link revealOnce} when the
 * component needs deterministic reveal firing — this uses an explicit
 * `useInView` observer attached to the returned ref, and sets the
 * `animate` prop directly rather than relying on framer-motion's
 * internal `whileInView` watcher (which has shown timing bugs under
 * Next.js App Router hydration in our testing).
 *
 * Usage:
 *   const reveal = useReveal();
 *   return <motion.section {...reveal} variants={fadeUp}>...</motion.section>;
 */
export function useReveal(): RevealProps {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: "0px 0px 15% 0px",
  });
  return {
    ref,
    initial: "hidden",
    animate: inView ? "show" : "hidden",
  };
}
