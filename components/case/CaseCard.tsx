import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-react";
import type { CaseStudy, Locale, ProjectCard } from "@/lib/types";
import { homeHref } from "@/lib/paths";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { ThemeToggle } from "../ThemeToggle";

/** Same squares as the home profile card's corner (56px, 44px on phones). */
const cornerButton =
  "flex size-11 shrink-0 items-center justify-center rounded-[15px] border lg:size-14 lg:rounded-[19px] border-[color:var(--border)] text-[color:var(--nav-link)] transition-[color,background-color,transform] duration-150 hover:bg-[color:var(--nav-link-hover-bg)] hover:text-[color:var(--nav-link-hover)] active:scale-[0.94]";

/**
 * The case page's counterpart of the home profile card, in the same place and
 * shape: back to the cases, theme and language in the corner, then what this
 * case is.
 */
export function CaseCard({
  caseStudy,
  project,
  locale,
  backLabel,
}: {
  caseStudy: CaseStudy;
  project?: ProjectCard;
  locale: Locale;
  backLabel: string;
}) {
  const tags = [project?.tag, project?.timeline].filter(Boolean) as string[];
  return (
    <ViewTransition name="side-card" share="side-morph" default="none">
    <div className="flex flex-col gap-5 rounded-[32px] bg-surface p-6 shadow-card lg:rounded-[36px] lg:p-8">
      <div className="flex items-start justify-between gap-3">
        <Link href={homeHref(locale)} aria-label={backLabel} title={backLabel} className={cornerButton}>
          <ArrowLeft2 color="currentColor" size={20} variant="Linear" />
        </Link>
        <div className="flex gap-2 lg:gap-3">
          <ThemeToggle className={cornerButton} />
          <LanguageSwitcher locale={locale} className={`${cornerButton} text-sm font-medium tracking-[0.01em]`} />
        </div>
      </div>

      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className="rounded-full bg-[color:var(--fill-quiet)] px-3 py-1 text-xs font-medium leading-5">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div>
        <h1 className="text-[26px] font-medium leading-8 tracking-[-0.031em] lg:text-[28px] lg:leading-9">{caseStudy.title}</h1>
        {caseStudy.subtitle && <p className="mt-3 leading-6 tracking-[-0.016em] text-muted">{caseStudy.subtitle}</p>}
      </div>
    </div>
    </ViewTransition>
  );
}
