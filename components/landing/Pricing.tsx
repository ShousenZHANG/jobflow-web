"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, revealOnce, stagger } from "./lib/motion";

// Pricing — 3 tiers matching Landing.html `.prices`. Featured card lifts
// on hover (and is visibly elevated at rest via shadow-elevated-emerald)
// so Pro stands out without fighting the other cards.

interface Tier {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/mo",
    blurb:
      "For the casual search. Everything you need to run a clean, focused process.",
    features: [
      "Unlimited job fetch",
      "20 tailored resumes / month",
      "LaTeX PDF export",
      "Chrome extension",
    ],
    cta: "Get started",
    ctaHref: "/login",
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "/mo",
    blurb:
      "For an active search. Unlimited generations, priority models, all adapters.",
    features: [
      "Everything in Starter",
      "Unlimited tailored resumes",
      "Priority GPT-4 / Claude routing",
      "All ATS adapters (Workday, SF, etc.)",
      "Scheduled daily fetches",
    ],
    cta: "Start 14-day trial",
    ctaHref: "/login",
    featured: true,
  },
  {
    name: "Bring-your-own-LLM",
    price: "$6",
    cadence: "/mo",
    blurb:
      "Use your own model provider. Pay us for the product, not the tokens.",
    features: [
      "Everything in Pro",
      "Your OpenAI / Anthropic / Gemini key",
      "Fully local option on roadmap",
      "Email support",
    ],
    cta: "Connect key",
    ctaHref: "/login",
  },
];

export function Pricing() {
  return (
    <motion.section
      data-testid="landing-pricing"
      id="pricing"
      className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10"
      variants={fadeUp}
      {...revealOnce}
    >
      <div className="mb-14 text-center">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-emerald-700">
          Pricing
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Free to start.{" "}
          <em className="font-serif italic text-brand-emerald-700">
            Fair when you grow.
          </em>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          No credit card to sign up. Your data and your AI keys stay yours.
        </p>
      </div>

      <motion.ul
        variants={stagger}
        className="grid gap-6 md:grid-cols-3"
        role="list"
      >
        {TIERS.map((tier) => (
          <motion.li
            key={tier.name}
            variants={fadeUp}
            className={
              "relative flex flex-col rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1 " +
              (tier.featured
                ? "border-brand-emerald/40 bg-gradient-to-b from-brand-emerald-50/80 to-background shadow-[0_20px_40px_-12px_rgba(5,150,105,0.18)] md:-translate-y-2"
                : "border-border/60 bg-background shadow-sm")
            }
          >
            {tier.featured && (
              <span className="absolute right-5 top-5 rounded-full bg-brand-emerald-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                Most popular
              </span>
            )}
            <div className="text-lg font-semibold text-foreground">
              {tier.name}
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {tier.price}
              </span>
              <span className="text-sm text-muted-foreground">
                {tier.cadence}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{tier.blurb}</p>
            <ul className="mt-6 flex flex-1 flex-col gap-2.5">
              {tier.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-foreground/90"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-emerald-600"
                    strokeWidth={3}
                    aria-hidden
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={tier.ctaHref}
              className={
                "mt-8 inline-flex h-10 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors " +
                (tier.featured
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "border border-border bg-background text-foreground hover:bg-muted")
              }
            >
              {tier.cta}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}
