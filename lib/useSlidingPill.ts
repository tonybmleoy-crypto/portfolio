"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * A highlight that slides to the active item of a row of tabs.
 *
 * Positions come from the item's offsetLeft/offsetWidth inside the row, so
 * they don't depend on where the row is on the page. A page-relative layout
 * animation (framer's layoutId) breaks for sticky rows: when switching tabs
 * also scrolls the page, the old position is measured somewhere else on the
 * page and the highlight flies in from below.
 *
 * The row must be the pill's and the items' offsetParent (position: relative).
 * Items mark themselves with data-active="true". `key` changes when the active
 * item does. The first placement doesn't animate.
 */
export function useSlidingPill(
  rowRef: RefObject<HTMLElement | null>,
  pillRef: RefObject<HTMLElement | null>,
  key: unknown,
) {
  const placed = useRef(false);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const pill = pillRef.current;
    if (!row || !pill) return;

    const place = (animate: boolean) => {
      const item = row.querySelector<HTMLElement>('[data-active="true"]');
      if (!item) {
        pill.style.opacity = "0";
        return;
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      pill.style.transition = animate && !reduce ? `transform 400ms ${EASE}, width 400ms ${EASE}, opacity 150ms` : "none";
      pill.style.opacity = "1";
      pill.style.width = `${item.offsetWidth}px`;
      pill.style.transform = `translateX(${item.offsetLeft}px)`;
    };

    place(placed.current);
    placed.current = true;
    // Widths change with the viewport (tabs stretch on phones): follow without
    // animating. The observer also fires once right away; skip that one, or it
    // would cut the slide that just started.
    let width = row.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (row.offsetWidth === width) return;
      width = row.offsetWidth;
      place(false);
    });
    observer.observe(row);
    return () => observer.disconnect();
  }, [rowRef, pillRef, key]);
}
