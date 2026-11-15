"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSlidingPill } from "@/lib/useSlidingPill";

export interface SectionTab {
  href: string;
  label: string;
  count?: number;
}

/**
 * Section switcher above the right column. Each tab is a real link to its own
 * URL, so Back, shared links, search engines and analytics all see sections.
 */
export function SectionTabs({ tabs }: { tabs: SectionTab[] }) {
  const pathname = usePathname();
  const rowRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  useSlidingPill(rowRef, pillRef, pathname);

  return (
    // No border or shadow. The solid card fill keeps cases from showing through
    // when the tabs stick over them.
    <nav ref={rowRef} aria-label="Sections" className="relative flex rounded-full bg-surface p-1 lg:inline-flex">
      {/* The highlight slides inside the row (see useSlidingPill), so a page
          scroll during the switch can't throw it off. */}
      <span ref={pillRef} aria-hidden className="absolute bottom-1 left-0 top-1 rounded-full bg-foreground opacity-0" />
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            data-active={active}
            className={`relative flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors duration-300 max-lg:flex-1 ${
              active ? "text-background" : "hover:bg-[color:var(--fill-quiet)]"
            }`}
          >
            <span className="relative">{tab.label}</span>
            {tab.count ? <span className={`relative ${active ? "opacity-55" : "text-muted"}`}>{tab.count}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
