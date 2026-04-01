"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { TailoringDemoCard } from "./TailoringDemoCard";
import { SmartCTA } from "./SmartCTA";

const stagger = 0.08;
const duration = 0.4;

export interface HeroSectionProps {
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel: string;
  badgeLabel: string;
}

export function HeroSection({
  heroTitle,
  heroSubtitle,
  ctaLabel,
  badgeLabel,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const noMotion = reduceMotion === true;
  const headerRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = headerRef.current;
      if (!el || noMotion) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
    },
    [noMotion],
  );

  const base = {
    opacity: 0,
    y: noMotion ? 0 : 14,
  };
  const visible = {
    opacity: 1,
    y: 0,
    transition: {
      duration: noMotion ? 0 : duration,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  };

  // Typewriter effect for hero title
  const [displayedTitle, setDisplayedTitle] = useState(noMotion ? heroTitle : "");
  const [showCursor, setShowCursor] = useState(!noMotion);

  useEffect(() => {
    if (noMotion) return;
    let cancelled = false;
    let i = 0;
    setDisplayedTitle("");
    const type = () => {
      if (cancelled || i >= heroTitle.length) {
        if (!cancelled) setTimeout(() => setShowCursor(false), 600);
        return;
      }
      i += 1;
      setDisplayedTitle(heroTitle.slice(0, i));
      setTimeout(type, 30);
    };
    // Start typing after badge animation
    const delay = setTimeout(type, 400);
    return () => { cancelled = true; clearTimeout(delay); };
  }, [heroTitle, noMotion]);

  // Render title with gradient on "AI-tailored" portion
  function renderTitle(text: string) {
    const aiMatch = text.match(/^(AI-tailored)/);
    if (aiMatch) {
      return (
        <>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {aiMatch[1]}
          </span>
          {text.slice(aiMatch[1].length)}
        </>
      );
    }
    return text;
  }

  return (
    <header
      ref={headerRef}
      onMouseMove={handleMouseMove}
      className="group relative grid w-full max-w-6xl gap-8 overflow-hidden text-center sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:text-left"
    >
      {/* Spotlight cursor overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--spotlight-x) var(--spotlight-y), rgba(16,185,129,0.06), transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-[1] flex flex-col items-center lg:items-start">
        <motion.div
          initial={base}
          animate={visible}
          transition={{ delay: noMotion ? 0 : 0 }}
        >
          <Badge className="edu-pill-pro text-sm">
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            {badgeLabel}
          </Badge>
        </motion.div>
        <h1
          className="edu-title mt-6 min-h-[3em] text-3xl leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] lg:leading-[1.15]"
        >
          {renderTitle(displayedTitle)}
          {showCursor && (
            <span className="edu-caret ml-0.5 inline-block" aria-hidden="true" />
          )}
        </h1>
        <motion.p
          className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600 sm:mt-5 sm:text-xl sm:leading-7"
          initial={base}
          animate={visible}
          transition={{ delay: noMotion ? 0 : stagger * 2 }}
        >
          {heroSubtitle}
        </motion.p>
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 lg:justify-start"
          initial={base}
          animate={visible}
          transition={{ delay: noMotion ? 0 : stagger * 3 }}
        >
          <SmartCTA label={ctaLabel} className="edu-cta-shimmer min-h-[48px] min-w-[44px] px-6" />
        </motion.div>
      </div>

      <motion.div
        className="relative z-[1] flex w-full items-center justify-center lg:justify-end"
        initial={base}
        animate={visible}
        transition={{ delay: noMotion ? 0 : stagger * 4 }}
      >
        <TailoringDemoCard />
      </motion.div>
    </header>
  );
}
