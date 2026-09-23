"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { getSvgPath } from "figma-squircle";

/**
 * A rounded container with Apple/Figma-style continuous corners instead of
 * a plain circular border-radius. Measures itself and clips with an exact
 * squircle path, so it stays correct as the element resizes.
 *
 * The `rounded-*` class you'd normally use should stay in `className` as a
 * fallback: it's what renders for the one frame before the first measurement
 * lands, so there's no flash of square corners.
 */
export function Squircle({
  radius,
  smoothing = 1,
  className,
  style,
  children,
}: {
  radius: number;
  /** 0 = plain rounded rect, 1 = full iOS-style continuous corner. */
  smoothing?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [clipPath, setClipPath] = useState<string>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      const cornerRadius = Math.min(radius, width / 2, height / 2);
      const d = getSvgPath({ width, height, cornerRadius, cornerSmoothing: smoothing });
      setClipPath(`path('${d}')`);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [radius, smoothing]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, clipPath, WebkitClipPath: clipPath }}
    >
      {children}
    </div>
  );
}
