"use client";

import { useReducedMotion } from "framer-motion";

/**
 * 简洁动态背景：暖色主风格，mint/peach/cream 三枚光球轻微浮动。
 * prefers-reduced-motion 时仅保留静态。
 */
export function LandingBackground() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="edu-dynamic-bg edu-dynamic-bg--static" aria-hidden="true">
        <div className="edu-dynamic-orb edu-dynamic-orb--mint edu-dynamic-orb--1" />
        <div className="edu-dynamic-orb edu-dynamic-orb--peach edu-dynamic-orb--2" />
      </div>
    );
  }

  return (
    <div className="edu-dynamic-bg" aria-hidden="true">
      <div className="edu-dynamic-orb edu-dynamic-orb--mint edu-dynamic-orb--1" />
      <div className="edu-dynamic-orb edu-dynamic-orb--peach edu-dynamic-orb--2" />
      <div className="edu-dynamic-orb edu-dynamic-orb--cream edu-dynamic-orb--3" />
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="edu-particle"
          aria-hidden="true"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            top: p.top,
            left: p.left,
            "--duration": p.duration,
            "--opacity": p.opacity,
            "--px": p.px, "--py": p.py,
            "--px2": p.px2, "--py2": p.py2,
            "--px3": p.px3, "--py3": p.py3,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

const PARTICLES = [
  { id: 1, size: 4, color: "rgba(52,211,153,0.3)", top: "12%", left: "8%", duration: "14s", opacity: "0.3", px: "12px", py: "-10px", px2: "-8px", py2: "14px", px3: "6px", py3: "-8px" },
  { id: 2, size: 3, color: "rgba(20,184,166,0.25)", top: "25%", left: "85%", duration: "16s", opacity: "0.25", px: "-14px", py: "10px", px2: "10px", py2: "-12px", px3: "-6px", py3: "8px" },
  { id: 3, size: 5, color: "rgba(251,191,36,0.2)", top: "40%", left: "15%", duration: "12s", opacity: "0.2", px: "10px", py: "14px", px2: "-12px", py2: "-8px", px3: "8px", py3: "10px" },
  { id: 4, size: 4, color: "rgba(52,211,153,0.3)", top: "55%", left: "72%", duration: "18s", opacity: "0.28", px: "-10px", py: "-14px", px2: "14px", py2: "10px", px3: "-8px", py3: "-6px" },
  { id: 5, size: 6, color: "rgba(20,184,166,0.25)", top: "18%", left: "45%", duration: "15s", opacity: "0.22", px: "14px", py: "12px", px2: "-10px", py2: "-14px", px3: "12px", py3: "8px" },
  { id: 6, size: 3, color: "rgba(251,191,36,0.2)", top: "70%", left: "30%", duration: "13s", opacity: "0.2", px: "-12px", py: "8px", px2: "10px", py2: "14px", px3: "-14px", py3: "-10px" },
  { id: 7, size: 5, color: "rgba(52,211,153,0.3)", top: "35%", left: "90%", duration: "17s", opacity: "0.25", px: "8px", py: "-12px", px2: "-14px", py2: "10px", px3: "10px", py3: "-14px" },
  { id: 8, size: 4, color: "rgba(20,184,166,0.25)", top: "78%", left: "60%", duration: "10s", opacity: "0.3", px: "-10px", py: "10px", px2: "12px", py2: "-8px", px3: "-6px", py3: "12px" },
];
