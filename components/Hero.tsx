import Image from "next/image";
import { HomeContent } from "@/lib/types";
import { SOCIAL_LINKS } from "@/lib/content";
import { FadeIn } from "./FadeIn";
import { MagneticButton } from "./MagneticButton";
import { Squircle } from "./Squircle";

export function Hero({ content }: { content: HomeContent }) {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 pb-20 sm:px-10 sm:pt-36">
      <div className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
        <FadeIn className="max-w-xl">
          <h1 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-3xl font-medium tracking-[-0.021em] sm:text-4xl sm:tracking-[-0.025em]">
            Anton Lopatin
            <span className="text-xl text-muted sm:text-2xl">{content.role}</span>
          </h1>
          <p className="mt-4 leading-relaxed text-foreground/90">{content.bio}</p>
        </FadeIn>

        <FadeIn delay={0.1} className="w-40 shrink-0 sm:w-56">
          <div className="relative aspect-[245/229] rounded-2xl shadow-card">
            <Squircle radius={16} className="absolute inset-0 overflow-hidden">
              <Image
                src="/images/home/profile.png"
                alt="Anton Lopatin"
                fill
                sizes="224px"
                className="object-cover"
                priority
                quality={90}
              />
            </Squircle>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.2} className="mt-10">
        <MagneticButton label={content.ctaLabel} href={SOCIAL_LINKS.telegram} />
      </FadeIn>
    </section>
  );
}
