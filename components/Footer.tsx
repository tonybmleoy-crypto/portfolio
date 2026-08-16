import { Dictionary, Locale } from "@/lib/types";
import { SOCIAL_LINKS } from "@/lib/content";
import { navFont, outerPillStyle, innerPillStyle, navLinkClass } from "@/lib/glassStyles";
import { FadeIn } from "./FadeIn";
import { GlassCTA } from "./GlassCTA";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { label: dict.nav.telegram, href: SOCIAL_LINKS.telegram },
    { label: dict.nav.cv, href: SOCIAL_LINKS.cv[locale] },
    { label: dict.nav.linkedin, href: SOCIAL_LINKS.linkedin },
    { label: dict.nav.behance, href: SOCIAL_LINKS.behance },
    { label: "Gmail", href: `mailto:${SOCIAL_LINKS.email}` },
  ];

  return (
    <footer className="mt-32 px-4 pb-6 sm:px-6">
      <FadeIn className="mx-auto max-w-5xl">
        <div className="rounded-[28px] p-[3px] sm:rounded-[40px]" style={outerPillStyle}>
          <div className="rounded-[25px] sm:rounded-[37px]" style={innerPillStyle}>
            <div className="flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-11 sm:py-10">
              <div>
                <p className="text-[15px] font-semibold tracking-[-0.01em] text-[rgb(10,10,12)]" style={navFont}>
                  Anton Lopatin
                </p>
                <p className="mt-1.5 text-sm text-[rgba(20,20,25,0.55)]">{dict.home.contactTitle}</p>
              </div>
              <GlassCTA
                href={SOCIAL_LINKS.telegram}
                label={dict.home.ctaLabel}
                className="self-start sm:self-auto"
              />
            </div>

            <div className="h-px w-full" style={{ backgroundColor: "rgba(10,10,12,0.1)" }} />

            <div className="flex flex-col-reverse gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-11 sm:py-7">
              <p className="text-xs text-[rgba(20,20,25,0.55)]">
                © {new Date().getFullYear()} Anton Lopatin
              </p>
              <div className="-ml-4 flex flex-wrap items-center gap-1">
                {links.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={navLinkClass}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </footer>
  );
}
