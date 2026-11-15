"use client";

import { useEffect, useRef, useState } from "react";
import { useSlidingPill } from "@/lib/useSlidingPill";
import type { ContentsItem } from "@/lib/caseContents";

/** The section whose top has passed this line (px from the viewport top) is the current one. */
const READ_LINE = 140;

function useActiveSection(items: ContentsItem[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= READ_LINE) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);
  return active;
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 520;

/**
 * Desktop contents under the case card. One motion only: the highlight stays
 * put at the top of the list and the list slides up under it, so the section
 * being read always sits in the highlight and what's ahead follows below.
 * Entries already read fade out as they slide past the top edge; the box
 * shrinks with the list, and the bottom fades out while entries are cut off.
 */
function SideContents({ items, label, active }: { items: ContentsItem[]; label: string; active: string | null }) {
  const listRef = useRef<HTMLUListElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const activeIndex = items.findIndex((item) => item.id === active);
  const [cut, setCut] = useState(false);
  // offset: how far the list has slid up; slot: the highlighted entry's height;
  // full: the whole list's height.
  const [box, setBox] = useState({ offset: 0, slot: 0, full: 0 });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const li = activeIndex >= 0 ? (list.children[activeIndex] as HTMLElement | undefined) : undefined;
      setBox({ offset: li?.offsetTop ?? 0, slot: li?.offsetHeight ?? 0, full: list.offsetHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeIndex]);

  // The aside caps the box's height; fade the bottom only when it does.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const check = () => setCut(el.clientHeight < box.full - box.offset - 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    el.addEventListener("transitionend", check);
    return () => {
      observer.disconnect();
      el.removeEventListener("transitionend", check);
    };
  }, [box]);

  const go = useJump();
  const remaining = box.full - box.offset;
  const transition = `${DURATION}ms ${EASE}`;

  return (
    <nav aria-label={label} className="flex min-h-0 w-full flex-col rounded-[28px] bg-surface p-2 shadow-card">
      <p className="px-4 pb-1 pt-3 text-sm text-muted">{label}</p>
      <div
        ref={boxRef}
        className="relative min-h-0 shrink overflow-hidden motion-reduce:!transition-none"
        style={{ height: box.full ? remaining : undefined, transition: `height ${transition}` }}
      >
        {/* The highlight: fixed at the top, only its height follows the entry. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 rounded-[20px] bg-foreground motion-reduce:!transition-none"
          style={{
            height: box.slot,
            opacity: activeIndex >= 0 ? 1 : 0,
            transition: `height ${transition}, opacity 200ms ease-out`,
          }}
        />
        <ul
          ref={listRef}
          className="relative motion-reduce:!transition-none"
          style={{ transform: `translateY(${-box.offset}px)`, transition: `transform ${transition}` }}
        >
          {items.map((item, i) => {
            const read = i < activeIndex;
            const current = i === activeIndex;
            return (
              <li
                key={item.id}
                aria-hidden={read || undefined}
                className="motion-reduce:!transition-none"
                style={{ opacity: read ? 0 : 1, transition: `opacity ${read ? 260 : DURATION}ms ease-out` }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  tabIndex={read ? -1 : undefined}
                  aria-current={current ? "location" : undefined}
                  className={`flex min-h-10 items-center rounded-[20px] px-4 py-2.5 text-sm font-medium leading-5 transition-[color,background-color] duration-300 ${
                    current ? "text-background" : "hover:bg-[color:var(--fill-quiet)]"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        {/* Bottom fade while the rest doesn't fit. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[color:var(--surface)] to-transparent transition-opacity duration-300"
          style={{ opacity: cut ? 1 : 0 }}
        />
      </div>
    </nav>
  );
}

function useJump() {
  return (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };
}

/**
 * Contents of the case.
 * - "side": the list under the case card on desktop (see SideContents).
 * - "bar": one scrollable row that sticks to the top of the column on phones,
 *   with the home tabs' sliding pill; it keeps the current entry in view.
 */
export function CaseContents({ items, label, variant }: { items: ContentsItem[]; label: string; variant: "side" | "bar" }) {
  const active = useActiveSection(items);
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const go = useJump();
  useSlidingPill(listRef, pillRef, variant === "bar" ? active : null);

  useEffect(() => {
    if (variant !== "bar" || !active) return;
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !link) return;
    list.scrollTo({ left: link.offsetLeft - 16, behavior: "smooth" });
  }, [active, variant]);

  if (items.length === 0) return null;
  if (variant === "side") return <SideContents items={items} label={label} active={active} />;

  return (
    <nav aria-label={label} className="rounded-full bg-surface p-1">
      <ul ref={listRef} className="relative flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Slides inside the row (see useSlidingPill): the row is sticky, and a
            page-relative animation would fly in from wherever the page was. */}
        <span ref={pillRef} aria-hidden className="absolute inset-y-0 left-0 rounded-full bg-foreground opacity-0" />
        {items.map((item) => {
          const current = item.id === active;
          return (
            // Grow to share the row when everything fits (like the home tabs);
            // never shrink, so a long list scrolls instead of squeezing.
            <li key={item.id} data-active={current} className="relative shrink-0 grow">
              <a
                href={`#${item.id}`}
                data-id={item.id}
                onClick={go(item.id)}
                aria-current={current ? "location" : undefined}
                className={`flex h-10 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-300 ${
                  current ? "text-background" : "hover:bg-[color:var(--fill-quiet)]"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
