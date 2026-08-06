import Image from "next/image";
import Link from "next/link";
import { CaseStudy, Dictionary, Locale, Section, TextParagraph } from "@/lib/types";
import { homeHref } from "@/lib/paths";
import { FadeIn } from "./FadeIn";

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
        <FadeIn>
          {section.heading && (
            <h2 className="mb-3 text-2xl font-medium tracking-tight">{section.heading}</h2>
          )}
          <div className="space-y-3 text-foreground leading-relaxed">
            {section.body.map((p, i) => (
              <Paragraph key={i} p={p} />
            ))}
          </div>
        </FadeIn>
      );

    case "table":
      return (
        <FadeIn>
          {section.heading && (
            <h2 className="mb-3 text-2xl font-medium tracking-tight">{section.heading}</h2>
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
        <FadeIn>
          <div className="flex gap-3 rounded-2xl border-l-4 border-accent-green px-6 py-5 shadow-card">
            <span aria-hidden className="mt-0.5 text-lg">✦</span>
            <div>
              <p className="font-medium">{section.label}</p>
              <p className="mt-2 text-muted leading-relaxed">{section.body}</p>
            </div>
          </div>
        </FadeIn>
      );

    case "tips":
      return (
        <FadeIn>
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
        <FadeIn className="border-l-2 border-foreground pl-6">
          <p className="text-lg italic leading-relaxed">&ldquo;{section.text}&rdquo;</p>
          {section.author && (
            <p className="mt-3 text-sm text-muted">— {section.author}</p>
          )}
        </FadeIn>
      );

    case "highlight":
      return (
        <FadeIn>
          <div className="flex gap-3 rounded-2xl bg-surface p-5 shadow-card">
            <span aria-hidden className="mt-0.5 text-lg">💡</span>
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
      return (
        <FadeIn>
          {section.heading && (
            <h2 className="mb-3 text-2xl font-medium tracking-tight">{section.heading}</h2>
          )}
          <div className="space-y-5">
            {section.items.map((item) => (
              <div key={item.number} className="flex gap-5">
                <span className="text-sm font-mono text-muted">{item.number}</span>
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
          <div className="relative w-full overflow-hidden rounded-2xl bg-black/5">
            <Image
              src={section.src}
              alt={section.alt}
              width={1600}
              height={1000}
              className="h-auto w-full object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
          {section.caption && (
            <p className="mt-1.5 text-sm text-muted">{section.caption}</p>
          )}
        </FadeIn>
      );

    case "imageGrid":
      return (
        <FadeIn>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {section.images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/5"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 448px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
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
                <p className="text-3xl font-medium tracking-tight text-accent-green sm:text-4xl">
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
  return (
    <article className="mx-auto max-w-4xl px-6 pt-28 pb-20 sm:px-10 sm:pt-36">
      <FadeIn>
        <Link
          href={homeHref(locale)}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← {dict.nav.back}
        </Link>
      </FadeIn>
      <FadeIn delay={0.05} className="mt-6">
        <h1 className="text-3xl font-medium tracking-tight sm:text-5xl">{caseStudy.title}</h1>
      </FadeIn>
      {caseStudy.subtitle && (
        <FadeIn delay={0.1} className="mt-5">
          <p className="text-lg text-muted leading-relaxed">{caseStudy.subtitle}</p>
        </FadeIn>
      )}

      <FadeIn className="mt-10">
        <div className="relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl bg-black/5 shadow-card ring-1 ring-black/[0.06] sm:h-[420px] md:h-[520px]">
          <Image
            src={caseStudy.coverImage}
            alt={caseStudy.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-contain"
            priority
          />
        </div>
      </FadeIn>

      <div className="mt-10 flex flex-col gap-8">
        {caseStudy.sections.map((section, i) => (
          <SectionView key={i} section={section} />
        ))}
      </div>
    </article>
  );
}
