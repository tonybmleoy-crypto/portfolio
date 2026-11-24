import type { SocialLinks } from "@/lib/content";
import type { Dictionary, Locale } from "@/lib/types";
import { navLinkClass } from "@/lib/glassStyles";

/**
 * Footer of the home sections (Figma: "Главная v2", node 1000:1696): no frame
 * or fill, as wide as the home container.
 *
 * Four contact links. The CV is left out: the profile card's "Резюме" button
 * already carries it. Mail is "Почта", not a service name.
 *
 * - Desktop: name and availability on the left, links on the right, their text
 *   edge on the container edge.
 * - Tablet and phone: the two stack, so the links never wrap onto a second
 *   line. On phones the four links spread across the full width, the first and
 *   last text edges on the container edges.
 */
export function SiteFooter({ dict, socialLinks }: { locale: Locale; dict: Dictionary; socialLinks: SocialLinks }) {
  const links = [
    { label: dict.nav.telegram, href: socialLinks.telegram, channel: "telegram" },
    { label: dict.nav.linkedin, href: socialLinks.linkedin, channel: "linkedin" },
    { label: dict.nav.behance, href: socialLinks.behance, channel: "behance" },
    { label: dict.nav.email, href: `mailto:${socialLinks.email}`, channel: "email" },
  ];

  return (
    // Same width and side padding as the home container (HomeShell), so the
    // name lines up with the profile card and the links with the cases column.
    <footer className="relative z-10 mx-auto flex w-full max-w-[1120px] flex-col gap-3 px-4 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-6 lg:py-10 xl:px-0">
      <div className="flex flex-col gap-1">
        <p className="font-medium leading-6 tracking-[-0.016em] text-foreground">{dict.home.footerName}</p>
        <p className="text-sm font-medium text-muted">{dict.home.contactTitle}</p>
      </div>
      {/* Negative margins put the link text, not the hover pill, on the edges. */}
      <nav aria-label="Contacts" className="-mx-3 flex items-center justify-between sm:-ml-4 sm:mr-0 sm:justify-start lg:-mr-4 lg:ml-0">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            data-analytics-event={link.channel === "telegram" || link.channel === "email" ? "contact_intent" : "social_opened"}
            data-analytics-channel={link.channel}
            data-analytics-placement="footer"
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer"
            className={`${navLinkClass} nav-link-tight`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
