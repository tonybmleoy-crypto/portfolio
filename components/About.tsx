import Image from "next/image";
import { Call, Send2, Sms } from "iconsax-react";
import { HomeContent } from "@/lib/types";
import type { SocialLinks, Track } from "@/lib/content";
import { FadeIn } from "./FadeIn";
import { MusicPlayer } from "./MusicPlayer";
import { Squircle } from "./Squircle";

export function About({
  content,
  socialLinks,
  musicTrack,
  musicLinks,
}: {
  content: HomeContent;
  socialLinks: SocialLinks;
  musicTrack: Track | null;
  musicLinks: { label: string; href: string }[];
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 sm:px-10">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_320px] sm:gap-11">
        <FadeIn>
          <h2 className="text-2xl font-medium tracking-[-0.017em]">{content.about.heading}</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-foreground/90">
            {content.about.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {musicTrack && (
            <div className="mt-6">
              <MusicPlayer track={musicTrack} links={musicLinks} />
            </div>
          )}
        </FadeIn>

        <FadeIn delay={0.1}>
          {/* Shadow lives on this plain-radius shell; clip-path on Squircle below
              would otherwise cut the shadow off at the box edge. */}
          <div className="relative aspect-[2/3] w-full rounded-2xl shadow-card">
            <Squircle radius={16} className="absolute inset-0 overflow-hidden">
              <Image
                src="/images/home/stage.jpg"
                alt="Anton Lopatin on stage"
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover"
                quality={90}
              />
            </Squircle>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.15} className="mt-11">
        <h3 className="text-2xl font-medium tracking-[-0.017em]">{content.about.contactHeading}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <a
            href={`tel:${socialLinks.phone.replace(/[^+\d]/g, "")}`}
            className="flex items-center gap-2 transition-[opacity,transform] duration-150 hover:opacity-70 active:scale-[0.96] active:opacity-60"
          >
            <Call color="currentColor" size={20} variant="Linear" />
            {socialLinks.phone}
          </a>
          <a
            href={`mailto:${socialLinks.email}`}
            className="flex items-center gap-2 transition-[opacity,transform] duration-150 hover:opacity-70 active:scale-[0.96] active:opacity-60"
          >
            <Sms color="currentColor" size={20} variant="Linear" />
            {socialLinks.email}
          </a>
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition-[opacity,transform] duration-150 hover:opacity-70 active:scale-[0.96] active:opacity-60"
          >
            <Send2 color="currentColor" size={20} variant="Linear" />
            {socialLinks.telegramHandle}
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
