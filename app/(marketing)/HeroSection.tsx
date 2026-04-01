"use client";

import Link from "next/link";
import { useRef, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TailoringDemoCard } from "./TailoringDemoCard";

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

  const words = heroTitle.split(" ");

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
          <Badge className="edu-pill-pro">
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            {badgeLabel}
          </Badge>
        </motion.div>
        <h1
          className="edu-title mt-6 text-3xl leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.1]"
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className={`inline-block ${word.includes("AI") ? "bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent" : ""}`}
              initial={noMotion ? undefined : { opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: noMotion ? 0 : 0.4,
                delay: noMotion ? 0 : stagger + i * 0.06,
              }}
            >
              {word}{i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:mt-5 sm:text-lg sm:leading-7"
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
          <Button
            asChild
            size="lg"
            className="edu-cta-shimmer min-h-[48px] min-w-[44px] px-6"
          >
            <Link href="/login">
              {ctaLabel} <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </Button>
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
