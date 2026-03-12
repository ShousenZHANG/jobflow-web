"use client";

import { useReducedMotion } from "framer-motion";
import { GradientBackground } from "react-gradient-animation";

const MINT = "#34d399";
const MINT_LIGHT = "#6ee7b7";
const PEACH = "#fb923c";
const PEACH_LIGHT = "#fed7aa";
const CREAM = "#fef3c7";
const BASE = "#fff8f1";

/**
 * Dynamic gradient background via react-gradient-animation.
 * Mint/peach/cream palette; falls back to static when prefers-reduced-motion.
 */
export function LandingBackground() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="edu-dynamic-bg edu-dynamic-bg--static" aria-hidden="true">
        <div className="edu-dynamic-orb edu-dynamic-orb--mint edu-dynamic-orb--1" />
        <div className="edu-dynamic-orb edu-dynamic-orb--peach edu-dynamic-orb--3" />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 z-[1] min-h-[100dvh] w-full overflow-hidden"
      aria-hidden="true"
    >
      <GradientBackground
        count={12}
        size={{ min: 400, max: 700, pulse: 0.25 }}
        speed={{ x: { min: 0.3, max: 1 }, y: { min: 0.3, max: 1 } }}
        colors={{
          background: BASE,
          particles: [MINT, MINT_LIGHT, PEACH, PEACH_LIGHT, CREAM],
        }}
        blending="overlay"
        opacity={{ center: 0.45, edge: 0 }}
        skew={-1}
        shapes={["c"]}
        style={{
          opacity: 0.9,
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
