import { Dictionary, Locale } from "@/lib/types";
import { SocialLinks } from "@/lib/content";
import { navFont, outerPillStyle, innerPillStyle, navLinkClass } from "@/lib/glassStyles";
import { FadeIn } from "./FadeIn";
import { GlassCTA } from "./GlassCTA";

export function Footer({
  locale,
  dict,
  socialLinks,
}: {
  locale: Locale;
  dict: Dictionary;
  socialLinks: SocialLinks;
}) {
  const links = [
    { label: dict.nav.telegram, href: socialLinks.telegram },
    { label: dict.nav.cv, href: socialLinks.cv[locale] },
    { label: dict.nav.linkedin, href: socialLinks.linkedin },
    { label: dict.nav.behance, href: socialLinks.behance },
    { label: "Gmail", href: `mailto:${socialLinks.email}` },
  ];

  return (
    <footer className="mt-32 px-4 pb-6 sm:px-6">
      <FadeIn className="mx-auto max-w-5xl">
        <div className="rounded-[28px] p-[3px] sm:rounded-[40px]" style={outerPillStyle}>
          <div className="rounded-[25px] sm:rounded-[37px]" style={innerPillStyle}>
            <div className="flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-11 sm:py-10">
              <div>
                <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground" style={navFont}>
                  Anton Lopatin
                </p>
                <p className="mt-1.5 text-sm text-muted">{dict.home.contactTitle}</p>
              </div>
              <GlassCTA
                href={socialLinks.telegram}
                label={dict.home.ctaLabel}
                className="self-start sm:self-auto"
              />
            </div>

            <div className="h-px w-full" style={{ backgroundColor: "var(--glass-divider)" }} />

            <div className="flex flex-col-reverse gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-11 sm:py-7">
              <p className="text-xs text-muted">
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
