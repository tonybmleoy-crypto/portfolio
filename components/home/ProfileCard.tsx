"use client";

import { ViewTransition } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExportSquare } from "iconsax-react";
import type { SocialLinks } from "@/lib/content";
import type { HomeContent, Locale } from "@/lib/types";
import { openContact } from "@/lib/contact";
import { GlassesPortrait } from "./GlassesPortrait";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { ThemeToggle } from "../ThemeToggle";

/** Theme and language: squares in the card's top-right corner (56px, 44px on phones). */
const cornerButton =
  "flex size-11 items-center justify-center rounded-[15px] border lg:size-14 lg:rounded-[19px] border-[color:var(--border)] text-[color:var(--nav-link)] transition-[color,background-color,transform] duration-150 hover:bg-[color:var(--nav-link-hover-bg)] hover:text-[color:var(--nav-link-hover)] active:scale-[0.94]";

const tap ={ scale: 0.96, transition: { type: "spring" as const, bounce: 0, duration: 0.15 } };

export function ProfileCard({ locale, content, socialLinks }: { locale: Locale; content: HomeContent; socialLinks: SocialLinks }) {
  return (
    // One plain rounded shape carries the fill, the hairline ring and the shadow.
    // A squircle clip here would leave the ring's round corner poking out.
    // overflow-hidden keeps the photo inside the rounded corner; it does not clip
    // the card's own box-shadow ring.
    <ViewTransition name="side-card" share="side-morph" default="none">
    <div className="flex flex-col gap-6 overflow-hidden rounded-[32px] bg-surface p-6 shadow-card lg:rounded-[36px] lg:p-8">
      <div>
        {/* Photo and the corner buttons share a row; the name and role sit below
            at the card's full width, so a longer role never runs into the buttons. */}
        <div className="flex items-start justify-between gap-3">
          {/* One Figma composition per theme (cut-out portrait with a soft glow),
              each exported on that theme's card colour with the same 20px margin,
              so both share one box and switching themes doesn't move the photo.
              The margin is pulled back so the name sits right under the photo. */}
          {(["dark", "light"] as const).map((theme) => (
            // The export cuts the glow off at its edges; the radial mask fades
            // them out, so no rectangle shows whatever the card's padding or radius.
            <div
              key={theme}
              className={`portrait-${theme} relative -mb-[9px] -ml-5 -mt-5 h-[140px] w-[130px] [mask-image:radial-gradient(closest-side,#000_72%,transparent)]`}
            >
              <Image
                src={`/images/home/portrait-${theme}.png`}
                alt={content.name}
                width={130}
                height={140}
                // Already exported at 3x for this exact box, so it is served as is.
                unoptimized
                fetchPriority="high"
                className="h-[140px] w-[130px] max-w-none"
              />
              {/* Light theme: he puts on sunglasses when the theme switches to light. */}
              {theme === "light" && <GlassesPortrait />}
            </div>
          ))}

          <div className="flex shrink-0 gap-2 lg:gap-3">
            <ThemeToggle className={cornerButton} />
            <LanguageSwitcher locale={locale} className={`${cornerButton} text-sm font-medium tracking-[0.01em]`} />
          </div>
        </div>

        <h1 className="text-[28px] font-medium leading-8 tracking-[-0.031em] lg:text-[32px]">{content.name}</h1>
        <p className="mt-1.5 text-xl font-medium leading-6 tracking-[-0.021em] text-muted lg:text-2xl">
          {content.role}
        </p>
      </div>

        <p className="leading-6 tracking-[-0.016em]">{content.bio}</p>

        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={openContact}
            whileTap={tap}
            className="hero-pill inline-flex h-[52px] items-center justify-center gap-3 rounded-full pl-8 pr-8 text-base font-medium max-lg:flex-1 [@media(hover:hover)]:pr-3.5"
          >
            {content.ctaLabel}
            <kbd
              aria-hidden
              className="hidden size-6 place-items-center rounded-lg bg-[color:var(--hero-kbd-bg)] font-sans text-xs [@media(hover:hover)]:inline-grid"
            >
              C
            </kbd>
          </motion.button>
          <motion.a
            href={socialLinks.cv[locale]}
            target="_blank"
            rel="noreferrer"
            whileTap={tap}
            // Same look as the theme and language buttons: hairline, no fill.
            className="inline-flex h-[52px] items-center justify-center gap-1.5 rounded-full border border-[color:var(--border)] pl-6 pr-5 text-base font-medium transition-colors hover:bg-[color:var(--nav-link-hover-bg)] max-lg:flex-1"
          >
            {content.resumeLabel}
            <ExportSquare color="currentColor" size={18} variant="Linear" />
          </motion.a>
        </div>
    </div>
    </ViewTransition>
  );
}
