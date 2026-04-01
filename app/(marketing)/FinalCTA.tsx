"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SmartCTA } from "./SmartCTA";

const duration = 0.4;

export function FinalCTA() {
  const t = useTranslations("marketing");
  const reduceMotion = useReducedMotion();
  const noMotion = reduceMotion === true;

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

  return (
    <section aria-labelledby="final-cta-heading" className="relative py-16 sm:py-20">
      <motion.div
        className="section-glow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        aria-hidden="true"
      />
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{
          opacity: 0,
          filter: noMotion ? "blur(0px)" : "blur(8px)",
          scale: noMotion ? 1 : 0.95,
        }}
        whileInView={{
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          transition: {
            duration: noMotion ? 0 : 0.6,
            ease: [0.25, 0.4, 0.25, 1],
          },
        }}
        viewport={{ once: true }}
      >
        <h2
          id="final-cta-heading"
          className="text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          {t("finalCtaTitle")}
        </h2>
        <p className="mt-3 text-base text-slate-600">{t("finalCtaSubtitle")}</p>
        <SmartCTA label={t("finalCtaCta")} className="edu-cta-shimmer mt-6 min-h-[48px] px-8" />
      </motion.div>
    </section>
  );
}
