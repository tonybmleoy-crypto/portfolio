import Image from "next/image";
import Link from "next/link";
import { ArrowLeft2, LampOn, Star } from "iconsax-react";
import { CaseStudy, Dictionary, Locale, Section, TextParagraph } from "@/lib/types";
import { homeHref } from "@/lib/paths";
import { CoverVideo } from "./CoverVideo";
import { FadeIn } from "./FadeIn";
import { ScrollToTop } from "./ScrollToTop";
import { VodokachkaFlow } from "./vodokachka/VodokachkaFlow";

function Paragraph({ p }: { p: TextParagraph }) {
  const text = typeof p === "string" ? p : p.text;
  const muted = typeof p === "string" ? false : p.muted;
  return <p className={muted ? "text-muted" : ""}>{text}</p>;
}

function SectionView({ section }: { section: Section }) {
  switch (section.type) {
    case "lead":
      return (
        <FadeIn>
          <p className="text-xl leading-relaxed sm:text-2xl">{section.body}</p>
        </FadeIn>
      );

    case "text":
      return (
        <FadeIn className="max-w-[640px]">
          {section.heading && (
            <h2 className="mb-3 text-2xl font-medium tracking-[-0.017em]">{section.heading}</h2>
          )}
          <div className="space-y-3 text-foreground leading-relaxed">
            {section.body.map((p, i) => (
              <Paragraph key={i} p={p} />
            ))}
          </div>
        </FadeIn>
      );

    case "list":
      return (
        <FadeIn className="max-w-[640px]">
          {section.heading && (
            <h2 className="mb-3 text-2xl font-medium tracking-[-0.017em]">{section.heading}</h2>
          )}
          {section.intro && (
            <p className="mb-3 leading-relaxed text-foreground">{section.intro}</p>
          )}
          <ul className="list-disc space-y-2 pl-5 leading-relaxed text-foreground">
            {section.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </FadeIn>
      );

    case "table":
      return (
        <FadeIn>
          {section.heading && (
            <h2 className="mb-3 text-2xl font-medium tracking-[-0.017em]">{section.heading}</h2>
          )}
          <div className="overflow-hidden rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-accent-blue text-white">
                    {section.columns.map((col, i) => (
                      <th key={i} className="px-4 py-3 font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-surface">
                  {section.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-border last:border-0">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-3 align-top">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      );

    case "insight":
      return (
        <FadeIn className="max-w-[640px]">
          <div className="flex gap-3 rounded-2xl border-l-4 border-accent-green px-6 py-5 shadow-card">
            <Star aria-hidden color="currentColor" variant="Linear" size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">{section.label}</p>
              <p className="mt-2 text-muted leading-relaxed">{section.body}</p>
            </div>
          </div>
        </FadeIn>
      );

    case "tips":
      return (
        <FadeIn className="max-w-[640px]">
          <div className="rounded-2xl border-l-4 border-accent-blue bg-accent-blue-tint px-6 py-5">
            <p className="font-medium">{section.heading}</p>
            <ul className="mt-2 space-y-1 text-sm text-foreground/80">
              {section.items.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
        </FadeIn>
      );

    case "quote":
      return (
        <FadeIn className="max-w-[640px] border-l-2 border-foreground pl-6">
          <p className="text-lg italic leading-relaxed">&ldquo;{section.text}&rdquo;</p>
          {section.author && (
            <p className="mt-3 text-sm text-muted">{section.author}</p>
          )}
        </FadeIn>
      );

    case "highlight":
      return (
        <FadeIn className="max-w-[640px]">
          <div className="flex gap-3 rounded-2xl bg-surface p-5 shadow-card">
            <LampOn aria-hidden color="currentColor" variant="Linear" size={20} className="mt-0.5 shrink-0" />
            <div>
              {section.label && (
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  {section.label}
                </p>
              )}
              <p className={section.label ? "mt-2 leading-relaxed" : "leading-relaxed"}>
                {section.body}
              </p>
            </div>
          </div>
        </FadeIn>
      );

    case "numbered":
      if (section.style === "cards") {
        const cols = section.items.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3";
        return (
          <FadeIn>
            {section.heading && (
              <h2 className="mb-3 text-2xl font-medium tracking-[-0.017em]">{section.heading}</h2>
            )}
            <div
              className={`grid grid-cols-1 gap-8 rounded-3xl bg-surface p-6 shadow-card sm:gap-6 sm:p-8 ${cols}`}
            >
              {section.items.map((item) => (
                <div key={item.number}>
                  <span className="text-sm font-medium text-muted">{item.number}</span>
                  <h3 className="mt-2 font-medium">{item.title}</h3>
                  <p className="mt-1.5 text-muted leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        );
      }
      return (
        <FadeIn className="max-w-[640px]">
          {section.heading && (
            <h2 className="mb-3 text-2xl font-medium tracking-[-0.017em]">{section.heading}</h2>
          )}
          <div className="space-y-5">
            {section.items.map((item) => (
              <div key={item.number} className="flex gap-5">
                <span className="text-sm font-medium text-muted">{item.number}</span>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1.5 text-muted leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      );

    case "image":
      return (
        <FadeIn>
          <div className="relative left-1/2 w-screen max-w-[1200px] -translate-x-1/2 px-6 sm:px-0">
            <div
              className={`relative flex w-full items-center justify-center overflow-hidden ${section.flush ? "rounded-[24px]" : "max-h-[720px] rounded-2xl"} ${section.shadow ? "shadow-card" : ""}`}
            >
              <Image
                src={section.src}
                alt={section.alt}
                width={section.width ?? 2400}
                height={section.height ?? 1500}
                className={`h-auto w-full object-contain ${section.flush ? "" : "max-h-[720px]"}`}
                sizes="(max-width: 1200px) 100vw, 1200px"
                quality={90}
              />
            </div>
            {section.caption && (
              <p className="mt-1.5 text-center text-sm text-muted">{section.caption}</p>
            )}
          </div>
        </FadeIn>
      );

    case "imageGrid":
      return (
        <FadeIn>
          <div
            className={`grid grid-cols-1 items-start gap-4 sm:grid-cols-2 ${section.size === "sm" ? "mx-auto max-w-sm sm:max-w-md" : ""}`}
          >
            {section.images.map((img, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl ${section.equalHeight ? "flex aspect-square items-center justify-center bg-surface p-4" : ""}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes={section.size === "sm" ? "(max-width: 640px) 50vw, 220px" : "(max-width: 640px) 100vw, 448px"}
                  className={section.equalHeight ? "h-full w-full object-contain" : "h-auto w-full"}
                  quality={90}
                />
              </div>
            ))}
          </div>
        </FadeIn>
      );

    case "prototype":
      return (
        <FadeIn className="flex flex-col items-center gap-5 py-4">
          <VodokachkaFlow />
          {section.caption && (
            <p className="max-w-[420px] text-center text-muted leading-relaxed">{section.caption}</p>
          )}
          {section.href && (
            <Link
              href={section.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.06] px-4 py-2 text-sm font-medium transition-[background-color,transform] duration-150 hover:bg-black/10 active:scale-[0.96] active:bg-black/[0.08]"
            >
              {section.hrefLabel ?? "Open fullscreen"}
            </Link>
          )}
        </FadeIn>
      );

    case "stats":
      return (
        <FadeIn>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {section.items.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-surface px-4 py-6 text-center shadow-card"
              >
                <p className="text-3xl font-medium tracking-[-0.021em] text-accent-green sm:text-4xl sm:tracking-[-0.025em]">
                  {stat.value}
                </p>
                <p className="text-sm leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      );

    default:
      return null;
  }
}

export function CaseStudyView({
  caseStudy,
  locale,
  dict,
}: {
  caseStudy: CaseStudy;
  locale: Locale;
  dict: Dictionary;
}) {
  const [firstSection, ...restSections] = caseStudy.sections;
  const leadSection = firstSection?.type === "lead" ? firstSection : null;
  const remainingSections = leadSection ? restSections : caseStudy.sections;

  return (
    <article className="mx-auto max-w-5xl px-6 pt-28 pb-20 sm:px-10 sm:pt-36">
      <FadeIn>
        <Link
          href={homeHref(locale)}
          className="inline-flex w-min items-center justify-center gap-1 whitespace-nowrap rounded-[28px] bg-white/45 px-4 py-2 text-sm text-foreground shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.6),inset_0px_-1px_1px_0px_rgba(16,16,18,0.08)] backdrop-blur-md backdrop-saturate-150 transition-[background-color,transform] duration-150 hover:bg-white/65 active:scale-[0.96] active:bg-white/75"
        >
          <ArrowLeft2 color="currentColor" size={16} variant="Linear" />
          {dict.nav.back}
        </Link>
      </FadeIn>

      {caseStudy.coverSide ? (
        <div className="mt-6 grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-10">
          <div>
            <FadeIn delay={0.05}>
              <h1 className="text-3xl font-medium tracking-[-0.021em] sm:text-4xl sm:tracking-[-0.028em]">
                {caseStudy.title}
              </h1>
            </FadeIn>
            {caseStudy.subtitle && (
              <FadeIn delay={0.1} className="mt-5">
                <p className="text-lg text-muted leading-relaxed">{caseStudy.subtitle}</p>
              </FadeIn>
            )}
            {leadSection && (
              <FadeIn delay={0.15} className="mt-5">
                <p className="leading-relaxed text-foreground/90">{leadSection.body}</p>
              </FadeIn>
            )}
          </div>
          <FadeIn delay={0.15} className="flex justify-center sm:justify-end">
            <Image
              src={caseStudy.coverImage}
              alt={caseStudy.title}
              width={caseStudy.coverWidth ?? 1600}
              height={caseStudy.coverHeight ?? 1000}
              sizes="(max-width: 640px) 70vw, 340px"
              className="h-[320px] w-auto max-w-full object-contain sm:h-[400px] md:h-[440px]"
              priority
              quality={90}
            />
          </FadeIn>
        </div>
      ) : (
        <>
      <div className="mt-6">
        <FadeIn delay={0.05}>
          <h1 className="text-3xl font-medium tracking-[-0.021em] sm:text-5xl sm:tracking-[-0.03em]">{caseStudy.title}</h1>
        </FadeIn>
        {caseStudy.subtitle && (
          <FadeIn delay={0.1} className="mt-5">
            <p className="max-w-[640px] text-lg text-muted leading-relaxed">{caseStudy.subtitle}</p>
          </FadeIn>
        )}
        {leadSection && (
          <FadeIn delay={0.15} className="mt-5">
            <p className="max-w-[640px] leading-relaxed text-foreground/90">{leadSection.body}</p>
          </FadeIn>
        )}
      </div>

      {caseStudy.coverPlain ? (
        <FadeIn delay={0.15} className="mt-8 flex justify-center">
          <Image
            src={caseStudy.coverImage}
            alt={caseStudy.title}
            width={caseStudy.coverWidth ?? 1600}
            height={caseStudy.coverHeight ?? 1000}
            sizes="(max-width: 768px) 100vw, 448px"
            className="h-[320px] w-auto max-w-full object-contain sm:h-[380px] md:h-[400px]"
            priority
            quality={90}
          />
        </FadeIn>
      ) : (
        <FadeIn delay={0.15} className="mt-10">
          <div className="relative left-1/2 w-screen max-w-[1200px] -translate-x-1/2 px-6 sm:px-0">
            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-[24px] shadow-card">
              {caseStudy.coverVideo ? (
                <CoverVideo
                  mp4={caseStudy.coverVideo.mp4}
                  webm={caseStudy.coverVideo.webm}
                  width={caseStudy.coverVideo.width}
                  height={caseStudy.coverVideo.height}
                  poster={caseStudy.coverImage}
                />
              ) : (
                <Image
                  src={caseStudy.coverImage}
                  alt={caseStudy.title}
                  width={caseStudy.coverWidth ?? 1600}
                  height={caseStudy.coverHeight ?? 1000}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="h-auto w-full object-contain"
                  priority
                  quality={90}
                />
              )}
            </div>
          </div>
        </FadeIn>
      )}
        </>
      )}

      <div className="mt-10 flex flex-col gap-8">
        {remainingSections.map((section, i) => (
          <SectionView key={i} section={section} />
        ))}
      </div>

      <ScrollToTop />
    </article>
  );
}
