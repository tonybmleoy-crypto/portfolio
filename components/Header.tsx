"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dictionary, Locale } from "@/lib/types";
import { SOCIAL_LINKS } from "@/lib/content";
import { homeHref } from "@/lib/paths";
import { navFont, outerPillStyle, innerPillStyle, navLinkClass } from "@/lib/glassStyles";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { GlassCTA } from "./GlassCTA";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: dict.nav.telegram, href: SOCIAL_LINKS.telegram },
    { label: dict.nav.cv, href: SOCIAL_LINKS.cv[locale] },
    { label: dict.nav.linkedin, href: SOCIAL_LINKS.linkedin },
    { label: dict.nav.behance, href: SOCIAL_LINKS.behance },
    { label: "Gmail", href: `mailto:${SOCIAL_LINKS.email}` },
  ];

  return (
    <header className="sticky top-4 z-50 flex justify-center px-4" style={navFont}>
      <nav
        className="hidden rounded-full p-[3px] sm:flex"
        style={outerPillStyle}
      >
        <div
          className="flex items-center gap-1 rounded-full py-2 pr-2 pl-3.5"
          style={innerPillStyle}
        >
          <a
            href={homeHref(locale)}
            className="flex items-center pr-3 transition-transform duration-150 active:scale-[0.96]"
          >
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-[rgb(10,10,12)]">
              Anton Lopatin
            </span>
          </a>

          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={navLinkClass}
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcher locale={locale} className={navLinkClass} />

          <GlassCTA href={SOCIAL_LINKS.telegram} label={dict.home.ctaLabel} className="ml-1" />
        </div>
      </nav>

      <div className="relative w-full max-w-[420px] sm:hidden">
        <div className="rounded-[26px] p-[3px]" style={outerPillStyle}>
          <div className="rounded-[23px]" style={innerPillStyle}>
            <div className="flex w-full items-center justify-between gap-2 py-2.5 pr-2.5 pl-4">
              <a
                href={homeHref(locale)}
                className="flex items-center transition-transform duration-150 active:scale-[0.96]"
              >
                <span className="text-sm font-semibold tracking-[-0.01em] text-[rgb(10,10,12)]">
                  Anton Lopatin
                </span>
              </a>
              <div className="flex items-center gap-2">
                <GlassCTA href={SOCIAL_LINKS.telegram} label={dict.home.ctaLabel} size="sm" />
                <button
                  aria-label="Menu"
                  onClick={() => setOpen((v) => !v)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-150 active:scale-90"
                >
                  <span className="relative block h-3.5 w-4">
                    <motion.span
                      animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
                      className="absolute left-0 top-0 h-[1.5px] w-full bg-[rgb(10,10,12)]"
                    />
                    <motion.span
                      animate={{ opacity: open ? 0 : 1 }}
                      className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-[rgb(10,10,12)]"
                    />
                    <motion.span
                      animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
                      className="absolute left-0 bottom-0 h-[1.5px] w-full bg-[rgb(10,10,12)]"
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[calc(100%+8px)] left-0 right-0 z-40 overflow-hidden rounded-[23px] p-[3px]"
              style={outerPillStyle}
            >
              <div className="rounded-[20px]" style={innerPillStyle}>
                <div className="flex flex-col gap-1 p-3">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`${navLinkClass} text-left`}
                    >
                      {link.label}
                    </a>
                  ))}
                  <LanguageSwitcher locale={locale} className={`${navLinkClass} inline-block w-fit`} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
