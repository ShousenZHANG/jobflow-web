"use client";

import {
  CheckCircle2,
  Clock,
  FileText,
  Link2,
  MapPin,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, revealOnce, stagger } from "./lib/motion";

// Features — asymmetric 6-column grid (1 xwide + 1 wide + 4 standard) that
// mirrors Landing.html. The xwide card is the anchor feature (match
// scoring); smaller cards describe the supporting capabilities.

interface Feature {
  icon: LucideIcon;
  title: string;
  blurb: string;
  /** Grid column span at ≥md breakpoint (6-col base). */
  span: 2 | 3 | 4;
}

const FEATURES: Feature[] = [
  {
    icon: MapPin,
    title: "Match scoring, honest",
    blurb:
      "Every JD is parsed and scored against your profile on a 0–100 scale. See exactly which skills match, which don't, and what to do about the gaps. No inflated numbers, no gamification.",
    span: 4,
  },
  {
    icon: CheckCircle2,
    title: "ATS-safe",
    blurb:
      "Output parses cleanly through Workday, Greenhouse, Lever, iCIMS.",
    span: 2,
  },
  {
    icon: Star,
    title: "Evidence-grounded",
    blurb:
      "Every bullet cites a real line from your past experience. No hallucinated claims.",
    span: 2,
  },
  {
    icon: Clock,
    title: "4-second tailor",
    blurb: "Streamed generation. See the resume form in real time.",
    span: 2,
  },
  {
    icon: FileText,
    title: "LaTeX-quality PDFs",
    blurb:
      "Typeset output with proper kerning, widow control, and typography — not a Word doc in disguise. EN or CN.",
    span: 3,
  },
  {
    icon: Link2,
    title: "Bring your own LLM",
    blurb:
      "Use Joblit's inference, or plug in your own Gemini / Claude / OpenAI key. Your cost, your latency, your choice.",
    span: 3,
  },
];

const SPAN_CLASS: Record<Feature["span"], string> = {
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
};

export function Features() {
  return (
    <motion.section
      data-testid="landing-features"
      id="product"
      className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10"
      variants={fadeUp}
      {...revealOnce}
    >
      <div className="mb-14 text-center">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-emerald-700">
          Why Joblit
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Built for the{" "}
          <em className="font-serif italic text-brand-emerald-700">
            signal-to-noise
          </em>{" "}
          problem.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
          Every feature shaves friction off a real step of the hunt — not
          nice-to-haves, table stakes for job seekers in 2026.
        </p>
      </div>

      <motion.ul
        variants={stagger}
        className="grid gap-5 md:grid-cols-6"
        role="list"
      >
        {FEATURES.map(({ icon: Icon, title, blurb, span }) => (
          <motion.li
            key={title}
            variants={fadeUp}
            className={
              "group relative flex flex-col rounded-2xl border border-border/60 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md " +
              SPAN_CLASS[span]
            }
          >
            <span
              className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-emerald-50 ring-1 ring-brand-emerald-100 text-brand-emerald-700"
              aria-hidden
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div className="text-base font-semibold text-foreground">
              {title}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {blurb}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}
