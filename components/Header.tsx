"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dictionary, Locale } from "@/lib/types";
import { SOCIAL_LINKS } from "@/lib/content";
import { LanguageSwitcher } from "./LanguageSwitcher";

const pillClass =
  "rounded-full border border-black/[0.08] bg-white/70 backdrop-blur-[35px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.04)]";
const linkClass = "text-base text-foreground hover:opacity-60 transition-opacity";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: dict.nav.telegram, href: SOCIAL_LINKS.telegram },
    { label: dict.nav.cv, href: SOCIAL_LINKS.cv },
    { label: dict.nav.linkedin, href: SOCIAL_LINKS.linkedin },
    { label: dict.nav.behance, href: SOCIAL_LINKS.behance },
    { label: "Gmail", href: `mailto:${SOCIAL_LINKS.email}` },
  ];

  return (
    <header className="sticky top-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-[460px] flex-col sm:w-fit">
        <div className={`flex items-center justify-between gap-6 px-6 py-4 sm:w-fit ${pillClass}`}>
          <nav className="hidden items-center gap-6 sm:flex">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={linkClass}>
                {link.label}
              </a>
            ))}
            <LanguageSwitcher locale={locale} className={linkClass} />
          </nav>

          <div className="flex w-full items-center justify-between gap-3 sm:hidden">
            <LanguageSwitcher locale={locale} className={linkClass} />
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center"
            >
              <span className="relative block h-3.5 w-4">
                <motion.span
                  animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
                  className="absolute left-0 top-0 h-[1.5px] w-full bg-foreground"
                />
                <motion.span
                  animate={{ opacity: open ? 0 : 1 }}
                  className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-foreground"
                />
                <motion.span
                  animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
                  className="absolute left-0 bottom-0 h-[1.5px] w-full bg-foreground"
                />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden sm:hidden"
            >
              <div className={`mt-2 flex flex-col gap-1 p-4 ${pillClass}`}>
                {links.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={`py-2 ${linkClass}`}>
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
