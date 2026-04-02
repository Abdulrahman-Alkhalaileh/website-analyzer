export interface BrandMarkProps {
  /** Pixel size (square). */
  size?: number;
  className?: string;
  title?: string;
}

/** Inline SVG mark aligned with the favicon (gradient approximated as solid for SSR-safe duplicate IDs). */
export function BrandMark({
  size = 40,
  className,
  title = "Instant Website Audit",
}: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width="32" height="32" rx="7" fill="#5B21B6" />
      <rect x="7" y="18" width="4" height="8" rx="1" fill="rgba(255,255,255,0.95)" />
      <rect x="14" y="12" width="4" height="14" rx="1" fill="rgba(255,255,255,0.95)" />
      <rect x="21" y="6" width="4" height="20" rx="1" fill="rgba(255,255,255,0.95)" />
    </svg>
  );
}
