/**
 * JoblitMark — the canonical Joblit J-monogram, a single-path SVG with a
 * 64×64 viewBox. Source of truth for every in-product brand mark
 * (nav rails, login pages, OG renders). The path is identical to
 * design-system/jobflow/brand/joblit-mark-*.svg and must not be edited
 * without coordinating with brand.
 *
 * Default `color="currentColor"` lets the mark inherit the parent text
 * colour, which is how the design system intends it to be used in nav
 * rails that switch theme.
 */
interface JoblitMarkProps {
  size?: number;
  color?: string;
  className?: string;
  /** Override accessible label. Set null to hide from AT (decorative). */
  ariaLabel?: string | null;
}

export function JoblitMark({
  size = 28,
  color = "currentColor",
  className,
  ariaLabel = "Joblit",
}: JoblitMarkProps) {
  const ariaProps =
    ariaLabel === null
      ? { "aria-hidden": true as const }
      : { role: "img" as const, "aria-label": ariaLabel };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      {...ariaProps}
    >
      <path
        d="M 44 12 L 44 38 a 12 12 0 0 1 -12 12 a 12 12 0 0 1 -12 -12 L 20 36 a 8 8 0 0 0 8 8 a 8 8 0 0 0 8 -8 L 36 22 Z"
        fill={color}
      />
    </svg>
  );
}
