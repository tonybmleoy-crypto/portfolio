import type { CSSProperties, ReactNode } from "react";

/**
 * A rounded container.
 *
 * This used to clip itself with a smoothed (Figma-style) squircle path. The
 * cards around it draw their hairline ring and shadow with box-shadow, which
 * follows a plain border-radius, so at every corner the ring poked out from
 * under the clipped fill. It now rounds with a plain border-radius of the same
 * size, so fill, ring and shadow share one shape. Children that must be clipped
 * (images) still need `overflow-hidden` in `className`, as before.
 */
export function Squircle({
  radius,
  className,
  style,
  children,
}: {
  radius: number;
  /** Kept for compatibility with existing call sites; ignored. */
  smoothing?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div className={className} style={{ borderRadius: radius, ...style }}>
      {children}
    </div>
  );
}
