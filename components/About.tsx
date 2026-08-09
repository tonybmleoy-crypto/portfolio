import Image from "next/image";
import { HomeContent } from "@/lib/types";
import { SOCIAL_LINKS } from "@/lib/content";
import { FadeIn } from "./FadeIn";

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.6c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 4 3 11.2c-.6.2-.6 1 0 1.3l4.4 1.6L9 19c.2.7 1 .8 1.5.3l2.6-2.6 4.4 3.3c.5.4 1.3.1 1.4-.5l3-14.6c.1-.6-.5-1.1-1-.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7.5 12.7 17 6.5l-7.8 7.7-.3 3.4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function About({ content }: { content: HomeContent }) {
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
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative aspect-[508/229] w-full overflow-hidden rounded-2xl shadow-card">
            <Image
              src="/images/home/profile.png"
              alt="Anton Lopatin"
              fill
              sizes="320px"
              className="object-cover"
              quality={90}
            />
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.15} className="mt-11">
        <h3 className="text-2xl font-medium tracking-[-0.017em]">{content.about.contactHeading}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <a
            href={`tel:${SOCIAL_LINKS.phone.replace(/[^+\d]/g, "")}`}
            className="flex items-center gap-2 transition-[opacity,transform] duration-150 hover:opacity-70 active:scale-[0.96] active:opacity-60"
          >
            <PhoneIcon />
            {SOCIAL_LINKS.phone}
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="flex items-center gap-2 transition-[opacity,transform] duration-150 hover:opacity-70 active:scale-[0.96] active:opacity-60"
          >
            <MailIcon />
            {SOCIAL_LINKS.email}
          </a>
          <a
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition-[opacity,transform] duration-150 hover:opacity-70 active:scale-[0.96] active:opacity-60"
          >
            <TelegramIcon />
            {SOCIAL_LINKS.telegramHandle}
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
