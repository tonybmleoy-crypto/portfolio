import { ViewTransition } from "react";
import type { HomeContent, Locale } from "@/lib/types";
import { workHref } from "@/lib/paths";
import { FadeIn } from "../FadeIn";
import { ProjectCardView } from "./ProjectCardView";

/** Case studies, one per row. */
export function CaseList({ locale, content }: { locale: Locale; content: HomeContent }) {
  const products = new Map(content.products.items.map((p) => [p.name.toLowerCase(), p]));

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {content.projects.map((project, i) => {
        const product = products.get(project.slug);
        const href = workHref(locale, project.slug);
        return (
          <FadeIn key={project.slug} delay={Math.min(i, 2) * 0.05}>
            {/* One plain rounded shape for fill, ring and shadow (see ProfileCard). */}
            {/* Morphs into the case page's cover on open (see CaseBody). */}
            <ViewTransition name={`case-${project.slug}`} share="case-morph" default="none">
              <div>
                <ProjectCardView project={project} content={content} href={href} product={product} />
              </div>
            </ViewTransition>
          </FadeIn>
        );
      })}
    </div>
  );
}
