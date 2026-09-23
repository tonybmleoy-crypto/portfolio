"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dictionary, Locale } from "@/lib/types";
import { SocialLinks } from "@/lib/content";
import { homeHref } from "@/lib/paths";
import { navFont, outerPillStyle, innerPillStyle, navLinkClass } from "@/lib/glassStyles";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { GlassCTA } from "./GlassCTA";

export function Header({
  locale,
  dict,
  socialLinks,
}: {
  locale: Locale;
  dict: Dictionary;
  socialLinks: SocialLinks;
}) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: dict.nav.telegram, href: socialLinks.telegram },
    { label: dict.nav.cv, href: socialLinks.cv[locale] },
    { label: dict.nav.linkedin, href: socialLinks.linkedin },
    { label: dict.nav.behance, href: socialLinks.behance },
    { label: "Gmail", href: `mailto:${socialLinks.email}` },
  ];

  return (
    <header className="sticky top-4 z-50 flex justify-center px-4">
      {/* Desktop: the nav pill plus two standalone chips, all scrolling together. */}
      <div className="hidden items-stretch gap-2 lg:flex">
      <nav
        className="rounded-full p-[3px]"
        style={outerPillStyle}
      >
        <div
          className="flex items-center gap-1 rounded-full py-2 pr-2 pl-3.5"
          style={innerPillStyle}
        >
          <a
            href={homeHref(locale)}
            className="flex shrink-0 items-center pr-3 transition-transform duration-150 active:scale-[0.96]"
          >
            <span className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em] text-foreground" style={navFont}>
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
          <GlassCTA href={socialLinks.telegram} label={dict.home.ctaLabel} className="ml-1" />
        </div>
      </nav>

        <div className="rounded-[22px] p-[3px]" style={outerPillStyle}>
          <div className="flex h-full rounded-[19px]" style={innerPillStyle}>
            <LanguageSwitcher
              locale={locale}
              className="flex aspect-square h-full items-center justify-center rounded-[19px] text-sm font-medium tracking-[0.01em] text-[color:var(--nav-link)] transition-[color,background-color,transform] duration-150 hover:bg-[color:var(--nav-link-hover-bg)] hover:text-[color:var(--nav-link-hover)] active:scale-[0.92]"
            />
          </div>
        </div>

        <div className="rounded-[22px] p-[3px]" style={outerPillStyle}>
          <div className="flex h-full rounded-[19px]" style={innerPillStyle}>
            <ThemeToggle className="aspect-square h-full rounded-[19px]" />
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-[420px] lg:hidden">
        <div className="rounded-[26px] p-[3px]" style={outerPillStyle}>
          <div className="rounded-[23px]" style={innerPillStyle}>
            <div className="flex w-full items-center justify-between gap-2 py-2.5 pr-2.5 pl-4">
              <a
                href={homeHref(locale)}
                className="flex items-center transition-transform duration-150 active:scale-[0.96]"
              >
                <span className="text-sm font-semibold tracking-[-0.01em] text-foreground" style={navFont}>
                  Anton Lopatin
                </span>
              </a>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <GlassCTA href={socialLinks.telegram} label={dict.home.ctaLabel} size="sm" />
                <button
                  aria-label="Menu"
                  onClick={() => setOpen((v) => !v)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-150 active:scale-90"
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
