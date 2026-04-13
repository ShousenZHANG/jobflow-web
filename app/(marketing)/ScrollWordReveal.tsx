"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface ScrollWordRevealProps {
  text: string;
  /** Optional words (case-insensitive) rendered in stronger accent color. */
  highlight?: string[];
  className?: string;
}

/**
 * Word-by-word opacity reveal tied to parent scroll progress.
 * Inspired by Mindloop mission section pattern.
 */
export function ScrollWordReveal({ text, highlight = [], className }: ScrollWordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });

  const words = text.split(/(\s+)/); // preserve whitespace tokens
  const realWordIndexes = words
    .map((w, i) => (w.trim().length > 0 ? i : -1))
    .filter((i) => i >= 0);
  const total = realWordIndexes.length;
  const highlightSet = new Set(highlight.map((w) => w.toLowerCase().replace(/[.,!?]/g, "")));

  if (reduceMotion) {
    return (
      <p ref={ref} className={className}>
        {words.map((w, i) => {
          const isHl = highlightSet.has(w.toLowerCase().replace(/[.,!?]/g, ""));
          return (
            <span key={i} className={isHl ? "text-slate-900 font-semibold" : undefined}>
              {w}
            </span>
          );
        })}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        if (w.trim().length === 0) return <span key={i}>{w}</span>;
        const order = realWordIndexes.indexOf(i);
        const isHl = highlightSet.has(w.toLowerCase().replace(/[.,!?]/g, ""));
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            order={order}
            total={total}
            highlight={isHl}
          >
            {w}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  order,
  total,
  highlight,
}: {
  children: React.ReactNode;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  order: number;
  total: number;
  highlight: boolean;
}) {
  const start = order / total;
  const end = (order + 1) / total;
  const opacity = useTransform(progress, [start, end], [0.15, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={highlight ? "text-slate-900 font-semibold" : "text-slate-500"}
    >
      {children}
    </motion.span>
  );
}
