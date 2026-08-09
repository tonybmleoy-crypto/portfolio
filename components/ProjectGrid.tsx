"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HomeContent, Locale } from "@/lib/types";
import { workHref } from "@/lib/paths";
import { FadeIn } from "./FadeIn";

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProjectGrid({ locale, content }: { locale: Locale; content: HomeContent }) {
  return (
    <section className="mx-auto max-w-5xl px-6 sm:px-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {content.projects.map((project, i) => {
          const card = (
            <motion.div
              whileHover={project.available ? { y: -4 } : undefined}
              whileTap={project.available ? { scale: 0.985 } : undefined}
              transition={{ duration: 0.3 }}
              className="group relative flex h-full flex-col gap-5 rounded-[36px] bg-surface p-4 shadow-card"
            >
              <div className="relative aspect-[556/461] w-full overflow-hidden rounded-[28px] bg-black/10">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className={`object-cover ${project.available ? "" : "opacity-70 grayscale"}`}
                  quality={90}
                />
                {!project.available && (
                  <span className="absolute right-3 top-3 rounded-full bg-white/70 px-3 py-1 text-xs text-muted backdrop-blur-md backdrop-saturate-150">
                    {content.comingSoon}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-4 px-3 pb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-2xl font-medium tracking-[-0.017em]">{project.title}</h3>
                    <span aria-hidden className="size-1.5 rounded-full bg-foreground/30" />
                    <span className="text-2xl font-medium tracking-[-0.017em]">{project.tag}</span>
                  </div>
                  <p className="mt-3 line-clamp-3 leading-relaxed">{project.description}</p>
                </div>
                {project.available && (
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {project.timeline && (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-foreground/50">{content.timelineLabel}</span>
                          <span className="text-lg font-medium tracking-[-0.011em]">{project.timeline}</span>
                        </div>
                      )}
                      {project.users && (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-foreground/50">{content.usersLabel}</span>
                          <span className="text-lg font-medium tracking-[-0.011em]">{project.users}</span>
                        </div>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.06] py-3 pl-4 pr-3 text-sm font-medium transition-colors group-hover:bg-black/10">
                      {content.viewCase}
                      <ChevronIcon />
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );

          return (
            <FadeIn key={project.slug} delay={i * 0.05} className="h-full">
              {project.available ? (
                <Link href={workHref(locale, project.slug)} className="block h-full">
                  {card}
                </Link>
              ) : (
                <div className="h-full cursor-default">{card}</div>
              )}
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
