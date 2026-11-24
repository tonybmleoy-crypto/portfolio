import { ViewTransition, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Chart, QuoteUp, Star1, TaskSquare, TickCircle } from "iconsax-react";
import type { CaseStudy, HomeContent, Section, TextParagraph } from "@/lib/types";
import { sectionId } from "@/lib/caseContents";
import { CoverVideo } from "../CoverVideo";
import { FadeIn } from "../FadeIn";
import { VodokachkaFlow } from "../vodokachka/VodokachkaFlow";
import { ZoomImage } from "./ZoomImage";

/**
 * The right column of a case page. Every block is exactly the column's width
 * (680px on desktop), and its look says what kind of information it is:
 * - narrative (the author's process and reasoning): plain text on the page
 * - research (insights, quotes): a card with a blue tag
 * - decision (key design decisions): a card with an orange tag
 * - outcome (metrics): green figures
 * - media: a surface frame with the picture rounded inside
 * Chapters are numbered (01, 02…) and give the case its skeleton.
 */

const card = "rounded-[28px] bg-surface p-6 shadow-card lg:rounded-[32px] lg:p-8";
const frame = "rounded-[28px] bg-surface p-2 shadow-card lg:rounded-[32px] lg:p-3";
const inner = "overflow-hidden rounded-[20px]";
const anchor = "scroll-mt-24 lg:scroll-mt-6";
const columnSizes = "(max-width: 1024px) 100vw, 656px";

type Labels = HomeContent["caseNav"];

/** A small coloured label on top of a card: what kind of block this is. */
function Tag({ kind, icon, children }: { kind: "research" | "decision" | "result" | "neutral"; icon: ReactNode; children: ReactNode }) {
  const color =
    kind === "research"
      ? "bg-[color:var(--tag-research-bg)] text-[color:var(--tag-research)]"
      : kind === "decision"
        ? "bg-[color:var(--tag-decision-bg)] text-[color:var(--tag-decision)]"
        : kind === "result"
          ? "bg-[color:var(--tag-result-bg)] text-[color:var(--tag-result)]"
          : "bg-[color:var(--fill-quiet)] text-muted";
  return (
    <p className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-2 pr-2.5 text-xs font-medium leading-4 ${color}`}>
      {icon}
      {children}
    </p>
  );
}

function Paragraph({ p }: { p: TextParagraph }) {
  const text = typeof p === "string" ? p : p.text;
  const muted = typeof p === "string" ? false : p.muted;
  return <p className={muted ? "text-muted" : ""}>{text}</p>;
}

/** Titles drop to h3 inside a case split into chapters (h2), so the outline stays a tree. */
function Heading({ nested, children }: { nested: boolean; children: ReactNode }) {
  const Tag = nested ? "h3" : "h2";
  return <Tag className="mb-3 text-2xl font-medium leading-8 tracking-[-0.021em]">{children}</Tag>;
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="px-3 pb-2 pt-3 text-sm leading-5 text-muted lg:px-4">{children}</p>;
}

/** A card that leads with a tag. */
function TaggedCard({ tag, children }: { tag: ReactNode; children: ReactNode }) {
  return (
    <div className={card}>
      {tag}
      <div className="mt-4">{children}</div>
    </div>
  );
}

const iconProps = { color: "currentColor", variant: "Linear" as const, size: 14, "aria-hidden": true };

function SectionView({
  section,
  id,
  nested,
  chapter,
  labels,
}: {
  section: Section;
  id: string;
  nested: boolean;
  chapter: number;
  labels: Labels;
}) {
  switch (section.type) {
    case "lead":
      return <p className="px-2 text-xl leading-8 tracking-[-0.016em] lg:text-[22px] lg:leading-9">{section.body}</p>;

    case "chapter":
      return (
        <div id={id} className={`${anchor} flex flex-col gap-2 px-2 pt-8 lg:pt-14`}>
          <span className="text-sm font-medium tabular-nums text-muted">{String(chapter).padStart(2, "0")}</span>
          <h2 className="text-[28px] font-medium leading-9 tracking-[-0.025em] lg:text-[36px] lg:leading-[44px]">{section.title}</h2>
        </div>
      );

    case "text": {
      // A heading with no text of its own titles the blocks after it.
      if (section.body.length === 0) {
        return section.heading ? (
          <h2 id={id} className={`${anchor} px-2 pt-4 text-2xl font-medium leading-8 tracking-[-0.021em] lg:pt-6`}>
            {section.heading}
          </h2>
        ) : null;
      }
      const body = (
        <div className="space-y-4 text-[17px] leading-7 tracking-[-0.011em]">
          {section.body.map((p, i) => (
            <Paragraph key={i} p={p} />
          ))}
        </div>
      );
      if (section.tone) {
        const decision = section.tone === "decision";
        return (
          <div id={id} className={`${card} ${anchor}`}>
            <Tag
              kind={decision ? "decision" : "research"}
              icon={decision ? <TickCircle {...iconProps} /> : <Star1 {...iconProps} />}
            >
              {decision ? labels.decision : labels.insights}
            </Tag>
            {section.heading && (
              <h3 className="mb-3 mt-4 text-2xl font-medium leading-8 tracking-[-0.021em]">{section.heading}</h3>
            )}
            {!section.heading && <div className="mt-4" />}
            {body}
          </div>
        );
      }
      // Narrative: the author's own voice, straight on the page.
      return (
        <div id={id} className={`${anchor} px-2 py-2`}>
          {section.heading && <Heading nested={nested}>{section.heading}</Heading>}
          {body}
        </div>
      );
    }

    case "list":
      return (
        <div className="px-2 py-2">
          {section.heading && <Heading nested={nested}>{section.heading}</Heading>}
          {section.intro && <p className="mb-3 leading-relaxed">{section.intro}</p>}
          <ul className="list-disc space-y-2 pl-5 leading-relaxed marker:text-muted">
            {section.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );

    case "facts":
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {section.items.map((fact, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-[24px] bg-surface px-6 py-5 shadow-card">
              <p className="text-sm text-muted">{fact.label}</p>
              <p className="text-lg font-medium leading-snug tracking-[-0.011em]">{fact.value}</p>
            </div>
          ))}
        </div>
      );

    case "stats":
      return (
        <div className="grid grid-cols-2 gap-4">
          {section.items.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-[24px] bg-surface px-6 py-5 shadow-card">
              <p className="text-4xl font-medium tracking-[-0.025em] text-[color:var(--accent-green-strong)]">{stat.value}</p>
              <p className="text-sm leading-snug text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      );

    case "quote":
      return (
        <TaggedCard
          tag={
            <Tag kind="research" icon={<QuoteUp {...iconProps} />}>
              {labels.quote}
            </Tag>
          }
        >
          <figure>
            <blockquote className="text-xl leading-8 tracking-[-0.016em]">«{section.text}»</blockquote>
            {section.author && <figcaption className="mt-3 text-sm text-muted">{section.author}</figcaption>}
          </figure>
        </TaggedCard>
      );

    case "insight":
      return (
        <TaggedCard
          tag={
            <Tag kind="research" icon={<Star1 {...iconProps} />}>
              {section.label}
            </Tag>
          }
        >
          <p className="text-xl leading-8 tracking-[-0.016em]">{section.body}</p>
        </TaggedCard>
      );

    case "highlight":
      // An aside in the author's voice: narrative, set off by a rule.
      return (
        <div className="ml-2 border-l-2 border-[color:var(--border)] py-1 pl-5">
          {section.label && <p className="mb-1 text-sm text-muted">{section.label}</p>}
          <p className="text-[17px] leading-7 tracking-[-0.011em] text-muted">{section.body}</p>
        </div>
      );

    case "tips":
      return (
        <TaggedCard
          tag={
            <Tag
              kind={section.tone === "decision" ? "decision" : "neutral"}
              icon={section.tone === "decision" ? <TickCircle {...iconProps} /> : <TaskSquare {...iconProps} />}
            >
              {section.heading.replace(/:\s*$/, "")}
            </Tag>
          }
        >
          <ul className="list-disc space-y-2 pl-5 leading-relaxed marker:text-muted">
            {section.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </TaggedCard>
      );

    case "numbered":
      return (
        <div className={card}>
          {section.tone === "decision" && (
            <div className="mb-4">
              <Tag kind="decision" icon={<TickCircle {...iconProps} />}>
                {labels.decision}
              </Tag>
            </div>
          )}
          {section.heading && <Heading nested={nested}>{section.heading}</Heading>}
          <div className="divide-y divide-[color:var(--border)]">
            {section.items.map((item) => (
              <div key={item.number} className="flex gap-5 py-5 first:pt-2 last:pb-0">
                <span className="w-6 shrink-0 text-sm font-medium leading-6 text-muted">{item.number}</span>
                <div>
                  <h3 className="font-medium leading-6">{item.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "table":
      return (
        <div className={card}>
          {section.heading && <Heading nested={nested}>{section.heading}</Heading>}
          {/* Wide screens: a plain table. Phones: one block per row, each value
              under its column name, so no column is cut off. */}
          <table className="hidden w-full border-collapse text-left sm:table">
            <thead>
              <tr className="border-b border-[color:var(--border)] text-sm text-muted">
                {section.columns.map((col, i) => (
                  <th key={i} className="pb-3 pr-4 font-normal last:pr-0">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-[color:var(--border)] last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`py-3 pr-4 align-top leading-6 last:pr-0 ${ci === 0 ? "font-medium" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="divide-y divide-[color:var(--border)] sm:hidden">
            {section.rows.map((row, ri) => (
              <dl key={ri} className="space-y-2 py-4 first:pt-0 last:pb-0">
                {row.map((cell, ci) =>
                  ci === 0 ? (
                    <dt key={ci} className="font-medium">
                      {cell}
                    </dt>
                  ) : (
                    <dd key={ci}>
                      <span className="block text-sm text-muted">{section.columns[ci]}</span>
                      {cell}
                    </dd>
                  ),
                )}
              </dl>
            ))}
          </div>
        </div>
      );

    case "image":
      return (
        <figure className={frame}>
          <div className={inner}>
            <ZoomImage
              src={section.src}
              alt={section.alt}
              width={section.width ?? 2400}
              height={section.height ?? 1500}
              sizes={columnSizes}
              className="h-auto w-full"
              labels={labels}
            />
          </div>
          {section.caption && <Caption>{section.caption}</Caption>}
        </figure>
      );

    case "imageGrid":
      return (
        <div className={frame}>
          <div className={`grid items-start gap-2 lg:gap-3 ${section.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {section.images.map((img, i) => (
              <figure key={i}>
                <div
                  className={`${inner} ${section.equalHeight ? "flex aspect-square items-center justify-center bg-[color:var(--fill-quiet)] p-3" : ""}`}
                >
                  <ZoomImage
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(max-width: 1024px) 50vw, 328px"
                    className={section.equalHeight ? "h-full w-full object-contain" : "h-auto w-full"}
                    labels={labels}
                  />
                </div>
                {img.caption && <Caption>{img.caption}</Caption>}
              </figure>
            ))}
          </div>
        </div>
      );

    case "prototype":
      return (
        <div className={`${frame} flex flex-col items-center gap-5 py-8`}>
          <VodokachkaFlow />
          {section.caption && <p className="max-w-[420px] px-4 text-center leading-relaxed text-muted">{section.caption}</p>}
          {section.href && (
            <Link
              href={section.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--fill-quiet)] px-4 py-2 text-sm font-medium transition-[background-color,transform] duration-150 hover:bg-[color:var(--fill-quiet-hover)] active:scale-[0.96]"
            >
              {section.hrefLabel ?? "Open fullscreen"}
            </Link>
          )}
        </div>
      );

    default:
      return null;
  }
}

function Cover({ caseStudy }: { caseStudy: CaseStudy }) {
  if (caseStudy.coverVideo) {
    return (
      <div className={frame}>
        <div className={inner}>
          <CoverVideo
            mp4={caseStudy.coverVideo.mp4}
            webm={caseStudy.coverVideo.webm}
            width={caseStudy.coverVideo.width}
            height={caseStudy.coverVideo.height}
            poster={caseStudy.coverImage}
          />
        </div>
      </div>
    );
  }
  // Cut-out mockups (a phone on transparency) sit on a quiet panel at a fixed
  // height; full screenshots fill the frame.
  const plain = caseStudy.coverPlain || caseStudy.coverSide;
  return (
    <div className={frame}>
      <div className={`${inner} ${plain ? "flex justify-center bg-[color:var(--fill-quiet)] py-8" : ""}`}>
        <Image
          src={caseStudy.coverImage}
          alt={caseStudy.title}
          width={caseStudy.coverWidth ?? 1600}
          height={caseStudy.coverHeight ?? 1000}
          sizes={plain ? "360px" : columnSizes}
          preload
          quality={90}
          className={plain ? "h-[320px] w-auto lg:h-[400px]" : "h-auto w-full"}
        />
      </div>
    </div>
  );
}

/**
 * The outcome up front: the case's key figures right under the cover, for a
 * reader who gives the case half a minute. The full results stay at the end.
 */
function Summary({ caseStudy, labels }: { caseStudy: CaseStudy; labels: Labels }) {
  const stats = caseStudy.sections.find((s) => s.type === "stats");
  if (!stats || stats.type !== "stats") return null;
  return (
    <div className={card}>
      <Tag kind="result" icon={<Chart {...iconProps} />}>
        {labels.summary}
      </Tag>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {stats.items.map((stat, i) => (
          // Label before value in the markup (dt, dd), value on top on screen.
          // In a reversed column, justify-end is the top: every figure starts
          // on the same line however many lines its label takes.
          <div key={i} className="flex flex-col-reverse justify-end gap-1">
            <dt className="text-sm leading-5 text-muted">{stat.label}</dt>
            <dd className="text-[28px] font-medium leading-8 tracking-[-0.025em] text-[color:var(--accent-green-strong)]">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function CaseBody({ caseStudy, content }: { caseStudy: CaseStudy; content: HomeContent }) {
  const nested = caseStudy.sections.some((s) => s.type === "chapter");
  // Chapter number at each index: how many chapters up to and including it.
  const chapterAt = caseStudy.sections.map((_, i) => caseStudy.sections.slice(0, i + 1).filter((s) => s.type === "chapter").length);
  return (
    <div data-case-content data-case-slug={caseStudy.slug} className="flex flex-col gap-4 lg:gap-6">
      {/* No fade-in on the cover: it must be on screen in the first frame, where
          the card it came from (home list or "next case") morphs into it. */}
      <ViewTransition name={`case-${caseStudy.slug}`} share="case-morph" default="none">
        <div>
          <Cover caseStudy={caseStudy} />
        </div>
      </ViewTransition>
      <Summary caseStudy={caseStudy} labels={content.caseNav} />
      {caseStudy.sections.map((section, i) => (
        <FadeIn key={i}>
          <SectionView section={section} id={sectionId(i)} nested={nested} chapter={chapterAt[i]} labels={content.caseNav} />
        </FadeIn>
      ))}
    </div>
  );
}
