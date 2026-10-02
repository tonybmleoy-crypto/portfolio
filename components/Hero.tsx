import Image from "next/image";
import { Link21 } from "iconsax-react";
import { HomeContent } from "@/lib/types";
import { SocialLinks } from "@/lib/content";
import { FadeIn } from "./FadeIn";
import { MagneticButton } from "./MagneticButton";
import { Squircle } from "./Squircle";

export function Hero({ content, socialLinks }: { content: HomeContent; socialLinks: SocialLinks }) {
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

      {content.products.items.length > 0 && (
        <FadeIn delay={0.15} className="mt-6 max-w-[367px]">
          <p className="text-sm font-medium">{content.products.label}</p>
          <div className="mt-3 flex flex-col gap-3">
            {content.products.items.map((product) => (
              <a
                key={product.name}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-3xl shadow-card transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Squircle radius={24} className="flex gap-2 bg-surface p-3">
                  <Link21 aria-hidden color="currentColor" variant="Linear" size={24} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-2xl font-medium tracking-[-0.017em]">{product.name}</span>
                      <span className="rounded-full bg-accent-green px-2 py-1 text-xs font-medium text-white">
                        {product.badge}
                      </span>
                    </div>
                    <p className="mt-1 leading-6 tracking-[-0.011em]">{product.tagline}</p>
                  </div>
                </Squircle>
              </a>
            ))}
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.2} className="mt-6">
        <MagneticButton label={content.ctaLabel} href={socialLinks.telegram} />
      </FadeIn>
    </section>
  );
}
