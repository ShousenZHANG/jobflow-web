"use client";

type LoadingBubblesProps = {
  label?: string;
  className?: string;
};

export function LoadingBubbles({ label = "Loading", className }: LoadingBubblesProps) {
  const classes = ["edu-loading-bubbles", className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="status" aria-live="polite" aria-label={label}>
      <span className="edu-loading-bubbles__dot" />
      <span className="edu-loading-bubbles__dot" />
      <span className="edu-loading-bubbles__dot" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
