"use client";

/**
 * Dynamic landing background: mint/peach orbs with float + glow.
 * Respects prefers-reduced-motion (animations disabled via CSS).
 */
export function LandingBackground() {
  return (
    <div className="edu-dynamic-bg" aria-hidden="true">
      <div className="edu-dynamic-orb edu-dynamic-orb--mint edu-dynamic-orb--1" />
      <div className="edu-dynamic-orb edu-dynamic-orb--mint edu-dynamic-orb--2" />
      <div className="edu-dynamic-orb edu-dynamic-orb--peach edu-dynamic-orb--3" />
      <div className="edu-dynamic-orb edu-dynamic-orb--peach edu-dynamic-orb--4" />
      <div className="edu-dynamic-orb edu-dynamic-orb--cream edu-dynamic-orb--5" />
    </div>
  );
}
