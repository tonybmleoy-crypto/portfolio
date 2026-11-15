import Image from "next/image";
import Link from "next/link";
import { ArrowRight2, ExportSquare } from "iconsax-react";
import type { HomeContent, ProjectCard } from "@/lib/types";

/**
 * One case card: cover, title, description, timeline and users. The title link
 * is stretched over the whole card, so the card is clickable while the product
 * badge stays its own link. Used in the home list and as the "next case" card.
 */
export function ProjectCardView({
  project,
  content,
  href,
  product,
  hideButton = false,
}: {
  project: ProjectCard;
  content: HomeContent;
  href: string;
  product?: HomeContent["products"]["items"][number];
  /** The "next case" card opens by scrolling on; the whole card is still a link. */
  hideButton?: boolean;
}) {
  return (
    <article className="group relative rounded-[28px] bg-surface p-2 shadow-card transition-transform duration-300 has-[a[data-card]:active]:scale-[0.99] lg:rounded-[36px] lg:p-3 [@media(hover:hover)]:hover:-translate-y-1">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[20px] bg-[color:var(--fill-quiet-hover)] lg:rounded-[24px]">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 656px"
            quality={90}
            className={`object-cover ${project.available ? "" : "opacity-70 grayscale"}`}
            style={{ objectPosition: project.coverPosition ?? "50% 50%" }}
          />
          {!project.available && (
            <span className="absolute right-3 top-3 rounded-full bg-[color:var(--float-bg)] px-3 py-1 text-xs text-muted backdrop-blur-md">
              {content.comingSoon}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 px-3 pb-3 pt-4 lg:px-4 lg:pb-2 lg:pt-5">
          {product && (
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hit-area relative z-10 inline-flex h-8 w-fit items-center gap-1 rounded-full bg-[color:var(--fill-quiet)] pl-3 pr-2.5 text-xs font-medium transition-colors hover:bg-[color:var(--fill-quiet-hover)] lg:hidden"
            >
              {product.badge}
              <ExportSquare color="currentColor" size={12} variant="Linear" aria-hidden />
            </a>
          )}
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-medium leading-7 tracking-[-0.021em]">
              {project.available ? (
                <Link href={href} data-card className="after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none">
                  {project.title} · {project.tag}
                </Link>
              ) : (
                <>
                  {project.title} · {project.tag}
                </>
              )}
            </h2>
            {product && (
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hit-area relative z-10 hidden h-8 w-fit items-center gap-1 rounded-full bg-[color:var(--fill-quiet)] pl-3 pr-2.5 text-xs font-medium transition-colors hover:bg-[color:var(--fill-quiet-hover)] lg:inline-flex"
              >
                {product.badge}
                <ExportSquare color="currentColor" size={12} variant="Linear" aria-hidden />
              </a>
            )}
          </div>
          <p className="max-w-[520px] leading-6 tracking-[-0.016em]">{project.description}</p>

          {project.available && (project.timeline || project.users) && (
            <div className="flex items-end justify-between gap-4 pt-2">
              <div className="flex gap-6">
                {project.timeline && (
                  <div>
                    <div className="text-sm text-muted">{content.timelineLabel}</div>
                    <div className="mt-1 text-xl font-medium tracking-[-0.016em]">{project.timeline}</div>
                  </div>
                )}
                {project.users && (
                  <div>
                    <div className="text-sm text-muted">{content.usersLabel}</div>
                    <div className="mt-1 text-xl font-medium tracking-[-0.016em]">{project.users}</div>
                  </div>
                )}
              </div>
              {!hideButton && (
                <span
                  aria-hidden
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[color:var(--fill-quiet)] py-3 pl-4 pr-3 text-sm font-medium transition-colors group-hover:bg-[color:var(--fill-quiet-hover)]"
                >
                  {content.viewCase}
                  <ArrowRight2 color="currentColor" size={16} variant="Linear" />
                </span>
              )}
            </div>
          )}
        </div>
    </article>  );
}
