"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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

  return (
    // No border or shadow. The solid card fill keeps cases from showing through
    // when the tabs stick over them.
    <nav aria-label="Sections" className="flex rounded-full bg-surface p-1 lg:inline-flex">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors max-lg:flex-1 ${
              active ? "text-background" : "hover:bg-[color:var(--fill-quiet)]"
            }`}
          >
            {active && (
              <motion.span
                layoutId="section-tab-pill"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              />
            )}
            <span className="relative">{tab.label}</span>
            {tab.count ? <span className={`relative ${active ? "opacity-55" : "text-muted"}`}>{tab.count}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
