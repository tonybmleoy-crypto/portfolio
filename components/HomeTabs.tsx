"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HomeContent, Locale } from "@/lib/types";
import { FadeIn } from "./FadeIn";
import { ProjectGrid } from "./ProjectGrid";
import { About } from "./About";

type Tab = "projects" | "about";

export function HomeTabs({ locale, content }: { locale: Locale; content: HomeContent }) {
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
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                tab === t.key ? "bg-foreground text-background" : "hover:bg-black/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </FadeIn>

      {tab === "projects" ? (
        <motion.div
          key="projects"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <ProjectGrid locale={locale} content={content} />
        </motion.div>
      ) : (
        <motion.div
          key="about"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <About content={content} />
        </motion.div>
      )}
    </>
  );
}
