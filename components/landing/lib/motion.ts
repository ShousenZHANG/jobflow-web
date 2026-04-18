import type { Variants } from "framer-motion";

// Shared framer-motion variants for the marketing landing. Import these
// instead of hand-rolling values per section so reveal timing stays
// consistent and `prefers-reduced-motion` kills them uniformly.

const SPRING_EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: SPRING_EASE },
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
 * Standard reveal-on-scroll props. Spread onto any `<motion.*>` element
 * to reveal it once when the section crosses the viewport bottom. The
 * negative top margin fires the observer ~10% before the element enters
 * the viewport so long sections (Features, Pricing) never sit visible
 * in their "hidden" state — critical for the reveal to read as smooth
 * on trackpad scroll. `amount: 0.15` keeps the trigger honest on very
 * tall cards without waiting until the user has already scrolled past.
 */
export const revealOnce = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.15, margin: "0px 0px -10% 0px" },
} as const;
