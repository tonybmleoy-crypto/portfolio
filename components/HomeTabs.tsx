"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HomeContent, Locale } from "@/lib/types";
import { FadeIn } from "./FadeIn";
import { ProjectGrid } from "./ProjectGrid";
import { About } from "./About";
import type { SocialLinks, Track } from "@/lib/content";

type Tab = "projects" | "about";

export function HomeTabs({
  locale,
  content,
  socialLinks,
  musicTrack,
  musicLinks,
}: {
  locale: Locale;
  content: HomeContent;
  socialLinks: SocialLinks;
  musicTrack: Track | null;
  musicLinks: { label: string; href: string }[];
}) {
  const [tab, setTab] = useState<Tab>("projects");

  const tabs: { key: Tab; label: string }[] = [
    { key: "projects", label: content.sectionsNav.projects },
    { key: "about", label: content.sectionsNav.about },
  ];

  return (
    <>
      <FadeIn className="mx-auto flex max-w-5xl justify-center px-6 pb-8 sm:px-10">
        <nav className="inline-flex items-center gap-1 rounded-full bg-surface p-1 shadow-card">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                tab === t.key ? "text-background" : "hover:bg-[color:var(--fill-quiet)]"
              }`}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="home-tab-pill"
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </nav>
      </FadeIn>

      <AnimatePresence mode="wait" initial={false}>
        {tab === "projects" ? (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
          >
            <ProjectGrid locale={locale} content={content} />
          </motion.div>
        ) : (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
          >
            <About content={content} socialLinks={socialLinks} musicTrack={musicTrack} musicLinks={musicLinks} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
