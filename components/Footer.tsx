import { Dictionary } from "@/lib/types";
import { SOCIAL_LINKS } from "@/lib/content";
import { FadeIn } from "./FadeIn";
import { MagneticButton } from "./MagneticButton";

export function Footer({ dict }: { dict: Dictionary }) {
  const links = [
    { label: dict.nav.telegram, href: SOCIAL_LINKS.telegram },
    { label: dict.nav.cv, href: SOCIAL_LINKS.cv },
    { label: dict.nav.linkedin, href: SOCIAL_LINKS.linkedin },
    { label: dict.nav.behance, href: SOCIAL_LINKS.behance },
    { label: "Gmail", href: `mailto:${SOCIAL_LINKS.email}` },
  ];

  return (
    <footer className="mt-32 px-6 py-16 sm:px-10">
      <FadeIn className="mx-auto max-w-3xl text-center">
        <p className="text-2xl sm:text-3xl font-medium tracking-tight">
          {dict.home.contactTitle}
        </p>
        <MagneticButton label={dict.home.ctaLabel} href={SOCIAL_LINKS.telegram} className="mt-8" />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="mt-16 text-xs text-muted">
          © {new Date().getFullYear()} Anton Lopatin
        </p>
      </FadeIn>
    </footer>
  );
}
