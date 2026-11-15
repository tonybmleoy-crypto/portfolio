import type { CaseStudy } from "@/lib/types";

export interface ContentsItem {
  id: string;
  label: string;
}

/** Anchor id of the section at this index in `caseStudy.sections`. */
export function sectionId(index: number): string {
  return `s-${index}`;
}

/**
 * The case's table of contents. A case split into chapters lists its chapters;
 * otherwise every text section with a heading is an entry.
 */
export function caseContents(caseStudy: CaseStudy): ContentsItem[] {
  const chapters = caseStudy.sections.flatMap((s, i) => (s.type === "chapter" ? [{ id: sectionId(i), label: s.title }] : []));
  if (chapters.length) return chapters;
  return caseStudy.sections.flatMap((s, i) =>
    s.type === "text" && s.heading ? [{ id: sectionId(i), label: s.heading.replace(/[:.]\s*$/, "") }] : [],
  );
}
