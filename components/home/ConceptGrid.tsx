"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Concept, HomeContent, Locale } from "@/lib/types";
import { workHref } from "@/lib/paths";

const PAGE = 24;

/**
 * Square-cell grid of concepts. Renders a page of 24 and reveals the next one
 * when a sentinel comes within a screen of the viewport. Tag chips filter the
 * list. While the list is empty it shows an empty state instead.
 */
export function ConceptGrid({ locale, concepts, labels }: { locale: Locale; concepts: Concept[]; labels: HomeContent["playground"] }) {
  const [tag, setTag] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  const sentinel = useRef<HTMLDivElement>(null);

  const tags = useMemo(() => [...new Set(concepts.flatMap((c) => c.tags))], [concepts]);
  const list = useMemo(() => (tag ? concepts.filter((c) => c.tags.includes(tag)) : concepts), [concepts, tag]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || shown >= list.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setShown((n) => n + PAGE);
      },
      { rootMargin: "0px 0px 100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, list.length]);

  if (concepts.length === 0) {
    return (
      <div className="rounded-[28px] bg-surface p-8 shadow-card lg:rounded-[36px]">
        <h2 className="text-2xl font-medium tracking-[-0.021em]">{labels.emptyTitle}</h2>
        <p className="mt-3 max-w-[480px] leading-6 text-muted">{labels.emptyBody}</p>
      </div>
    );
  }

  return (
    <div>
      {tags.length > 1 && (
        <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0">
          {[null, ...tags].map((t) => (
            <button
              key={t ?? "all"}
              type="button"
              onClick={() => {
                setTag(t);
                setShown(PAGE);
              }}
              aria-pressed={tag === t}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                tag === t ? "bg-foreground text-background" : "bg-[color:var(--fill-quiet)] hover:bg-[color:var(--fill-quiet-hover)]"
              }`}
            >
              {t ?? labels.allTag}
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-4">
        {list.slice(0, shown).map((c) => {
          const tile = (
            <>
              <Image src={c.image} alt="" fill sizes="(max-width: 1024px) 50vw, 216px" className="object-cover" />
              <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent from-45% to-black/70 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="font-medium text-white">{c.title}</span>
                <span className="mt-1 text-xs text-white/60">{c.meta}</span>
              </span>
            </>
          );
          const cls = "group relative block aspect-square overflow-hidden rounded-2xl bg-[color:var(--fill-quiet)] lg:rounded-[20px]";
          return (
            <li key={c.slug}>
              {c.caseSlug ? (
                <Link href={workHref(locale, c.caseSlug)} className={cls} aria-label={c.title}>
                  {tile}
                </Link>
              ) : (
                <div className={cls} role="img" aria-label={c.title}>
                  {tile}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div ref={sentinel} />
    </div>
  );
}
