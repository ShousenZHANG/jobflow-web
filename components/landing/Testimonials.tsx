"use client";

import { motion } from "framer-motion";
import { fadeUp, revealOnce, stagger } from "./lib/motion";

// Testimonials — 3 quote cards. Uses a large serif opening quote glyph
// to anchor each card visually (matches Landing.html `.quote::before`).

interface Quote {
  initial: string;
  text: string;
  name: string;
  role: string;
  accent?: "emerald" | "teal" | "amber";
}

const QUOTES: Quote[] = [
  {
    initial: "S",
    text:
      "I spent three weekends a month tweaking resumes for specific roles. Joblit does it in four seconds, and the bullets are actually mine — it pulls evidence from my past work, not thin air.",
    name: "Sarah K.",
    role: "Staff Engineer · offer at Linear",
    accent: "emerald",
  },
  {
    initial: "M",
    text:
      "The match score is honest. It told me a role was 52% and to skip it. That alone saved me an entire Saturday.",
    name: "Marcus T.",
    role: "Product Designer · Notion",
    accent: "teal",
  },
  {
    initial: "A",
    text:
      "The autofill extension just works. I applied to 14 jobs on one coffee break. The PDFs look better than anything I was making in Word.",
    name: "Ana R.",
    role: "ML Engineer · 3 offers in 6 weeks",
    accent: "amber",
  },
];

const ACCENT_BG: Record<NonNullable<Quote["accent"]>, string> = {
  emerald: "bg-brand-emerald-100 text-brand-emerald-700",
  teal: "bg-[theme(colors.tier-good-bg)] text-[theme(colors.tier-good-fg)]",
  amber: "bg-[theme(colors.tier-fair-bg)] text-[theme(colors.tier-fair-fg)]",
};

export function Testimonials() {
  return (
    <motion.section
      data-testid="landing-testimonials"
      className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10"
      variants={fadeUp}
      {...revealOnce}
    >
      <div className="mb-12 text-center">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-emerald-700">
          Candidates
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Less time applying.{" "}
          <em className="font-serif italic text-brand-emerald-700">
            More time interviewing.
          </em>
        </h2>
      </div>

      <motion.ul
        variants={stagger}
        className="grid gap-6 md:grid-cols-3"
        role="list"
      >
        {QUOTES.map((q) => (
          <motion.li
            key={q.name}
            variants={fadeUp}
            className="group flex flex-col rounded-2xl border border-border/60 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <span
              aria-hidden
              className="mb-2 font-serif text-5xl leading-none text-brand-emerald-600/80"
            >
              &ldquo;
            </span>
            <p className="flex-1 text-base leading-relaxed text-foreground/90">
              {q.text}
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
              <span
                className={
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold " +
                  ACCENT_BG[q.accent ?? "emerald"]
                }
                aria-hidden
              >
                {q.initial}
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {q.name}
                </div>
                <div className="text-xs text-muted-foreground">{q.role}</div>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}
