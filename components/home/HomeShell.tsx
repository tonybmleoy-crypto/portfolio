import type { ReactNode } from "react";
import type { SocialLinks } from "@/lib/content";
import type { Dictionary, Locale } from "@/lib/types";
import { aboutHref, homeHref, playgroundHref } from "@/lib/paths";
import { concepts } from "@/lib/content/concepts";
import { SiteFooter } from "../SiteFooter";
import { ContactDialog } from "./ContactDialog";
import { KoiBackground } from "./KoiBackground";
import { ProfileCard } from "./ProfileCard";
import { SectionTabs } from "./SectionTabs";

/**
 * Shared frame of the home sections (cases, playground, about). Rendered by a
 * layout, so the profile card and tabs stay mounted while the right column
 * switches between pages.
 *
 * Desktop: the profile card and the tabs start on the same line, with the cases
 * under the tabs. Both stick 24px from the top, so they stay level while the
 * cases scroll, and nothing shifts between the two states.
 */
export function HomeShell({
  locale,
  dict,
  socialLinks,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  socialLinks: SocialLinks;
  children: ReactNode;
}) {
  const home = dict.home;
  const tabs = [
    { href: homeHref(locale), label: home.sectionsNav.projects, count: home.projects.length },
    { href: playgroundHref(locale), label: home.sectionsNav.playground, count: concepts.length },
    { href: aboutHref(locale), label: home.sectionsNav.about },
  ];

  return (
    <>
    {/* Pixel koi on a fixed canvas behind everything; the content sits above it (z-10). */}
    <KoiBackground />
    <div className="relative z-10 mx-auto w-full max-w-[1120px] flex-1 px-4 pb-16 lg:px-6 xl:px-0">
      {/* Language and theme live in the profile card's corner. */}
      <div className="flex flex-col gap-4 pt-4 lg:flex-row lg:items-start lg:gap-10 lg:pt-6">
        <aside className="lg:sticky lg:top-6 lg:w-[400px] lg:shrink-0">
          <ProfileCard locale={locale} content={home} socialLinks={socialLinks} />
        </aside>

        <div className="min-w-0 flex-1 lg:max-w-[680px]">
          <div className="sticky top-3 z-20 mb-4 lg:top-6 lg:mb-6">
            <SectionTabs tabs={tabs} />
          </div>
          {children}
        </div>
      </div>

      <ContactDialog socialLinks={socialLinks} labels={home.contactDialog} />
    </div>
    <SiteFooter locale={locale} dict={dict} socialLinks={socialLinks} />
    </>
  );
}
