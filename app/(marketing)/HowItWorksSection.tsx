"use client";

import { Search, Wand2, FileText } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface Step {
  number: number;
  icon: ReactNode;
  titleKey: string;
  descKey: string;
}

const stagger = 0.15;
const duration = 0.4;

/* ── Animated SVG beam connector ───────────────────── */

function AnimatedBeam() {
  return (
    <div className="mt-5 hidden flex-1 self-center md:block" style={{ minWidth: "2rem" }}>
      <svg width="100%" height="4" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
        <motion.line
          x1="0" y1="2" x2="100" y2="2"
          stroke="rgb(52 211 153)"
          strokeWidth="2"
          strokeDasharray="100"
          strokeDashoffset={100}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

export function HowItWorksSection() {
  const t = useTranslations("marketing");
  const reduceMotion = useReducedMotion();
  const noMotion = reduceMotion === true;

  const steps: Step[] = [
    {
      number: 1,
      icon: <Search className="mx-auto mt-3 h-6 w-6 text-emerald-600" aria-hidden="true" />,
      titleKey: "howItWorksStep1Title",
      descKey: "howItWorksStep1Desc",
    },
    {
      number: 2,
      icon: <Wand2 className="mx-auto mt-3 h-6 w-6 text-emerald-600" aria-hidden="true" />,
      titleKey: "howItWorksStep2Title",
      descKey: "howItWorksStep2Desc",
    },
    {
      number: 3,
      icon: <FileText className="mx-auto mt-3 h-6 w-6 text-emerald-600" aria-hidden="true" />,
      titleKey: "howItWorksStep3Title",
      descKey: "howItWorksStep3Desc",
    },
  ];

  const base = {
    opacity: 0,
    y: noMotion ? 0 : 40,
    scale: noMotion ? 1 : 0.95,
  };
  const visible = {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: noMotion ? 0 : duration,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  };

  return (
    <section aria-labelledby="how-it-works-heading" className="py-16 sm:py-20">
      <motion.h2
        id="how-it-works-heading"
        className="text-center text-2xl font-bold text-slate-900 sm:text-3xl"
        initial={base}
        whileInView={visible}
        viewport={{ once: true }}
      >
        {t("howItWorksTitle")}
      </motion.h2>

      <div className="mt-12 flex items-start justify-center gap-0">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-start">
            <motion.div
              className="flex w-full max-w-xs flex-col items-center text-center"
              initial={base}
              whileInView={visible}
              viewport={{ once: true }}
              transition={{
                delay: noMotion ? 0 : stagger * i,
                duration: noMotion ? 0 : duration,
              }}
            >
              <motion.div
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700"
                whileInView={noMotion ? undefined : { scale: [1, 1.15, 1] }}
                viewport={{ once: true }}
                transition={{
                  delay: noMotion ? 0 : stagger * i + 0.3,
                  duration: 0.4,
                }}
              >
                <span aria-hidden="true">{step.number}</span>
                <span className="sr-only">Step {step.number}</span>
              </motion.div>
              {step.icon}
              <h3 className="mt-3 text-center text-sm font-semibold text-slate-900">
                {t(step.titleKey)}
              </h3>
              <p className="mx-auto mt-1 max-w-xs text-center text-sm text-slate-600">
                {t(step.descKey)}
              </p>
            </motion.div>
            {i < steps.length - 1 && <AnimatedBeam />}
          </div>
        ))}
      </div>
    </section>
  );
}
