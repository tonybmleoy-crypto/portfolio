import Image from "next/image";
import Link from "next/link";
import { ArrowRight2 } from "iconsax-react";
import type { HomeContent, Locale } from "@/lib/types";
import { workHref } from "@/lib/paths";
import { FadeIn } from "../FadeIn";

/**
 * Case studies, one per row. The title link is stretched over the whole card,
 * so the card is clickable while the product badge stays its own link.
 */
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
                      className="relative z-10 w-fit rounded-full bg-[color:var(--accent-green-strong)] px-2 py-1 text-xs font-medium text-[color:var(--on-accent-green)] transition-opacity hover:opacity-85 lg:hidden"
                    >
                      {product.badge}
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
                        className="relative z-10 hidden rounded-full bg-[color:var(--accent-green-strong)] px-2 py-1 text-xs font-medium text-[color:var(--on-accent-green)] transition-opacity hover:opacity-85 lg:inline-block"
                      >
                        {product.badge}
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
                      <span
                        aria-hidden
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[color:var(--fill-quiet)] py-3 pl-4 pr-3 text-sm font-medium transition-colors group-hover:bg-[color:var(--fill-quiet-hover)]"
                      >
                        {content.viewCase}
                        <ArrowRight2 color="currentColor" size={16} variant="Linear" />
                      </span>
                    </div>
                  )}
                </div>
            </article>
          </FadeIn>
        );
      })}
    </div>
  );
}
