"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, revealOnce, stagger } from "./lib/motion";

// Deep-dive #1 — resume studio before/after. Two stacked card mocks with
// placeholder bars representing bullet points. Highlight blocks on the
// "After" side are the emerald call-outs that appear after tailoring.

const BULLETS = [
  "Keyword density scored against the JD in real time",
  "One base profile → infinite targeted variants",
  "Side-by-side diff view with one-click accept / reject",
  "Exports clean ATS-safe PDF, DOCX, or plain text",
];

/** Pill-shaped skeleton bar used to mock resume bullet lines. */
function Bar({ width, highlight = false }: { width: string; highlight?: boolean }) {
  return (
    <div
      className={
        "h-2.5 rounded-full " +
        (highlight ? "bg-brand-emerald-500" : "bg-border/70")
      }
      style={{ width }}
      aria-hidden
    />
  );
}

export function DeepDiveResume() {
  return (
    <motion.section
      data-testid="landing-deepdive-resume"
      className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10"
      variants={fadeUp}
      {...revealOnce}
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div variants={stagger}>
          <motion.div
            variants={fadeUp}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-emerald-700"
          >
            Resume studio
          </motion.div>
          <motion.h3
            variants={fadeUp}
            className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Your resume, re-tailored per job.{" "}
            <em className="font-serif italic text-brand-emerald-700">
              Automatically.
            </em>
          </motion.h3>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-base leading-relaxed text-muted-foreground"
          >
            Stop maintaining 14 versions of the same resume. Joblit reads each
            JD, rewrites your summary and bullets to emphasize what matters,
            and keeps a clean diff so you know exactly what changed.
          </motion.p>
          <motion.ul variants={stagger} className="mt-6 flex flex-col gap-3">
            {BULLETS.map((b) => (
              <motion.li
                key={b}
                variants={fadeUp}
                className="flex items-start gap-2 text-sm text-foreground/90"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-emerald-600"
                  strokeWidth={3}
                  aria-hidden
                />
                {b}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 gap-3 rounded-3xl border border-border/60 bg-background p-5 shadow-[var(--shadow-card-emerald)]"
        >
          {/* Before */}
          <div className="flex flex-col gap-3 rounded-xl bg-muted/40 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Before
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Alex Chen
              </div>
              <div className="text-xs text-muted-foreground">
                Frontend Engineer · 5 yrs
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Bar width="90%" />
              <Bar width="70%" />
              <Bar width="50%" />
              <Bar width="90%" />
              <Bar width="70%" />
            </div>
          </div>

          {/* After */}
          <div className="flex flex-col gap-3 rounded-xl border border-brand-emerald-200 bg-brand-emerald-50/40 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-emerald-700">
                After · Stripe JD
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Alex Chen
              </div>
              <div className="text-xs text-brand-emerald-700">
                Senior Frontend Engineer
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Bar width="90%" highlight />
              <div className="rounded-md bg-brand-emerald-100 px-2 py-1.5 text-[11px] font-medium text-brand-emerald-800">
                Led React rewrite of dashboard (↓ 47% bundle)
              </div>
              <Bar width="70%" highlight />
              <Bar width="50%" />
              <div className="rounded-md bg-brand-emerald-100 px-2 py-1.5 text-[11px] font-medium text-brand-emerald-800">
                Design systems, A11y, perf
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
