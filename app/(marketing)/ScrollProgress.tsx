"use client";

import { motion, useScroll, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <motion.div
      className="edu-scroll-progress"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
