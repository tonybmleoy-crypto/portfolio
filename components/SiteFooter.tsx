import type { SocialLinks } from "@/lib/content";
import type { Dictionary, Locale } from "@/lib/types";
import { navLinkClass } from "@/lib/glassStyles";

/**
 * Footer on every page (Figma: "Главная v2", node 1000:1696): no frame or fill,
 * as wide as the home container. Name and availability on the left, contact
 * links on the right (their text edge on the container edge); on phones the
 * two stack.
 */
export function SiteFooter({ locale, dict, socialLinks }: { locale: Locale; dict: Dictionary; socialLinks: SocialLinks }) {
  const links = [
    { label: dict.nav.telegram, href: socialLinks.telegram },
    { label: dict.nav.cv, href: socialLinks.cv[locale] },
    { label: dict.nav.linkedin, href: socialLinks.linkedin },
    { label: dict.nav.behance, href: socialLinks.behance },
    { label: "Gmail", href: `mailto:${socialLinks.email}` },
  ];

  return (
    // Same width and side padding as the home container (HomeShell), so the
    // name lines up with the profile card and the links with the cases column.
    <footer className="relative z-10 mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10 lg:px-6 xl:px-0">
      <div className="flex flex-col gap-1">
        <p className="font-medium leading-6 tracking-[-0.016em] text-foreground">{dict.home.footerName}</p>
        <p className="text-sm font-medium text-muted">{dict.home.contactTitle}</p>
      </div>
      <nav aria-label="Contacts" className="-ml-4 flex flex-wrap items-center sm:ml-0 sm:-mr-4">
        {links.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={navLinkClass}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
