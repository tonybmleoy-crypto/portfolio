"use client";

import { useEffect, useRef, useState, ViewTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { holdScroll } from "@/lib/scrollHold";

/** How far to keep scrolling past the end to open the next case (wheel delta px / finger px). */
const WHEEL_DISTANCE = 700;
const TOUCH_DISTANCE = 160;

/**
 * The next case at the end of a case page. The card is a link; past the end of
 * the page, scrolling on (wheel or a finger pulling up) fills the bar under it
 * and opens the next case, so reading goes on without hunting for a link.
 * Letting go before it fills drains it back. On the way the card morphs into
 * the next page's cover (React <ViewTransition>), so there is no cut.
 */
export function NextCase({
  slug,
  href,
  heading,
  hint,
  children,
}: {
  slug: string;
  href: string;
  heading: string;
  hint: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [pull, setPull] = useState(0);
  const pullRef = useRef(0);
  const leaving = useRef(false);

  useEffect(() => {
    router.prefetch(href);
    const atEnd = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const set = (value: number) => {
      pullRef.current = Math.max(0, Math.min(1, value));
      setPull(pullRef.current);
      if (pullRef.current >= 1 && !leaving.current) {
        leaving.current = true;
        // The wheel or finger is still moving; keep that from scrolling the
        // next case past its beginning once it opens at the top.
        holdScroll();
        router.push(href);
      }
    };

    let drain = 0;
    const scheduleDrain = () => {
      window.clearTimeout(drain);
      drain = window.setTimeout(() => {
        if (!leaving.current) set(0);
      }, 450);
    };

    const onWheel = (e: WheelEvent) => {
      if (leaving.current) return;
      if (e.deltaY > 0 && atEnd()) {
        set(pullRef.current + e.deltaY / WHEEL_DISTANCE);
        scheduleDrain();
      } else if (e.deltaY < 0 && pullRef.current > 0) {
        set(0);
      }
    };

    let startY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      startY = atEnd() ? e.touches[0].clientY : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (startY === null || leaving.current) return;
      set((startY - e.touches[0].clientY) / TOUCH_DISTANCE);
    };
    const onTouchEnd = () => {
      startY = null;
      if (!leaving.current) set(0);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.clearTimeout(drain);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [href, router]);

  return (
    <section className="mt-12 flex flex-col gap-4 lg:mt-16 lg:gap-6">
      <h2 className="px-2 text-[28px] font-medium leading-9 tracking-[-0.025em] lg:text-[32px] lg:leading-10">{heading}</h2>
      <div style={{ transform: `translateY(${-pull * 16}px)` }} className="transition-transform duration-200 ease-out">
        {/* Same name as the next page's cover: the card grows up into it. */}
        <ViewTransition name={`case-${slug}`} share="case-morph" default="none">
          <div>{children}</div>
        </ViewTransition>
      </div>
      <div className="flex flex-col items-center gap-3 pb-4 pt-2" aria-hidden>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-[color:var(--fill-quiet)]">
          <div
            className="h-full rounded-full bg-[color:var(--progress)] transition-[width] duration-150 ease-out"
            style={{ width: `${pull * 100}%` }}
          />
        </div>
        <p className="text-sm text-muted">{hint}</p>
      </div>
    </section>
  );
}
