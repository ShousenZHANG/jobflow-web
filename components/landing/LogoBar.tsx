"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeIn, useReveal } from "./lib/motion";

// LogoBar — uniform premium typography across logos. Refined gray with
// subtle hover lift to brand emerald. Text-only by intent (real SVG
// wordmarks require legal sign-off); the typography itself is the design.

const LOGOS = ["Stripe", "Linear", "Vercel", "Figma", "Notion", "Airbnb"];

export function LogoBar() {
  const reveal = useReveal();
  const t = useTranslations("landing.logoBar");
  return (
    <motion.section
      {...reveal}
      data-testid="landing-logobar"
      className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 sm:py-16"
      variants={fadeIn}
    >
      <div className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">
        {t("kicker")}
      </div>
      <ul
        className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14"
        role="list"
      >
        {LOGOS.map((logo) => (
          <li
            key={logo}
            className="text-xl font-semibold tracking-tight text-foreground/35 transition-all duration-300 hover:-translate-y-px hover:text-foreground/85 sm:text-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {logo}
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
