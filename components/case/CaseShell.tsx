import type { SocialLinks } from "@/lib/content";
import type { CaseStudy, Dictionary, Locale } from "@/lib/types";
import { homeHref, workHref } from "@/lib/paths";
import { caseContents } from "@/lib/caseContents";
import { ContactDialog } from "../home/ContactDialog";
import { KoiBackground } from "../home/KoiBackground";
import { ProjectCardView } from "../home/ProjectCardView";
import { CaseBody } from "./CaseBody";
import { CaseCard } from "./CaseCard";
import { CaseContents } from "./CaseContents";
import { CaseNavBar } from "./CaseNavBar";
import { NextCase } from "./NextCase";

/**
 * A case page on the home page's grid: a 400px column on the left that sticks
 * (the case card and its contents, where the profile card sits on the home
 * page) and the 680px reading column on the right. Every block of the case is
 * exactly the column's width.
 *
 * No footer: the page ends on the next case card, and scrolling on from
 * there opens it. Contacts stay one tap away in the floating bar.
 */
export function CaseShell({
  caseStudy,
  locale,
  dict,
  socialLinks,
}: {
  caseStudy: CaseStudy;
  locale: Locale;
  dict: Dictionary;
  socialLinks: SocialLinks;
}) {
  const home = dict.home;
  const contents = caseContents(caseStudy);
  const cases = home.projects.filter((p) => p.available && dict.caseStudies[p.slug]);
  const index = cases.findIndex((p) => p.slug === caseStudy.slug);
  const project = cases[index];
  const next = cases.length > 1 ? cases[(index + 1) % cases.length] : undefined;
  const products = new Map(home.products.items.map((p) => [p.name.toLowerCase(), p]));

  return (
    <>
      <KoiBackground />
      <div className="relative z-10 mx-auto w-full max-w-[1120px] flex-1 px-4 pb-28 lg:px-6 lg:pb-32 xl:px-0">
        <div className="flex flex-col gap-4 pt-4 lg:flex-row lg:items-start lg:gap-10 lg:pt-6">
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-48px)] lg:w-[400px] lg:shrink-0">
            <CaseCard caseStudy={caseStudy} project={project} locale={locale} backLabel={home.caseNav.back} />
            <div className="hidden min-h-0 lg:flex">
              <CaseContents items={contents} label={home.caseNav.contents} variant="side" />
            </div>
          </aside>

          <main className="min-w-0 flex-1 lg:max-w-[680px]">
            {contents.length > 0 && (
              <div className="sticky top-3 z-20 mb-4 lg:hidden">
                <CaseContents items={contents} label={home.caseNav.contents} variant="bar" />
              </div>
            )}
            <CaseBody caseStudy={caseStudy} content={home} />
            {next && (
              <NextCase slug={next.slug} href={workHref(locale, next.slug)} heading={home.caseNav.next} hint={home.caseNav.keepScrolling}>
                <ProjectCardView
                  project={next}
                  content={home}
                  href={workHref(locale, next.slug)}
                  product={products.get(next.slug)}
                  hideButton
                />
              </NextCase>
            )}
          </main>
        </div>

        <ContactDialog socialLinks={socialLinks} labels={home.contactDialog} />
      </div>
      <CaseNavBar
        homeHref={homeHref(locale)}
        labels={{ home: home.caseNav.back, top: home.caseNav.top, cta: home.ctaLabel }}
      />
    </>
  );
}
