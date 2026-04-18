"use client";

import { Plus } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { fadeUp, revealOnce } from "./lib/motion";

// FAQ accordion. Controlled (single-open) because Landing.html only
// highlights one item at a time and leaves the rest closed. The plus icon
// rotates 45° to become an X when the item is open — a 120ms transform
// that reads as "close affordance" without being fussy.

interface QA {
  q: string;
  a: string;
}

const QAS: QA[] = [
  {
    q: "Is this just ChatGPT with extra steps?",
    a: "No. Joblit parses each JD into a structured schema, scores it against your profile, and grounds every bullet in real evidence from your past experience. The LLM is one part of the pipeline — the rest is structured extraction, ATS-safe formatting, and real integrations with job boards.",
  },
  {
    q: "Will my data be used to train models?",
    a: "No. Your profile and generated resumes are never used for training. If you bring your own LLM key, data goes direct to that provider under their terms — we never see it.",
  },
  {
    q: "How does the match score work?",
    a: "Each JD is parsed for required skills, years of experience, seniority, and domain. We match against your profile with a published rubric you can see and argue with. Strong (80+), Good (65–79), Fair (50–64), Weak (<50).",
  },
  {
    q: "Does the Chrome extension work on Workday / Greenhouse / Lever?",
    a: "Yes, plus iCIMS and SuccessFactors. We ship dedicated adapters per ATS so quirky fields (like Workday's multi-step forms and date pickers) behave correctly.",
  },
  {
    q: "Can I use my own OpenAI / Claude / Gemini key?",
    a: "Yes. Bring-your-own-LLM is a first-class path and costs less per month. You pay us for the product; you pay the provider for tokens directly.",
  },
  {
    q: "What if the generated bullets aren't accurate?",
    a: "Every bullet is grounded in a line you wrote in your profile. If you don't like a change, one click reverts it. You always own the final text.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <motion.section
      data-testid="landing-faq"
      id="faq"
      className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-10"
      variants={fadeUp}
      {...revealOnce}
    >
      <div className="mb-12 text-center">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-emerald-700">
          Questions
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Honest answers to{" "}
          <em className="font-serif italic text-brand-emerald-700">real</em>{" "}
          questions.
        </h2>
      </div>

      <ul className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-background">
        {QAS.map((qa, i) => {
          const open = openIndex === i;
          return (
            <li key={qa.q}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/50"
              >
                <span className="text-base font-semibold text-foreground">
                  {qa.q}
                </span>
                <span
                  className={
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-transform duration-200 " +
                    (open ? "rotate-45" : "")
                  }
                  aria-hidden
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="answer"
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.25, 0.4, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                      {qa.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}
