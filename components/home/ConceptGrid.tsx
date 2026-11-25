import Image from "next/image";
import Link from "next/link";
import type { Concept, HomeContent, Locale } from "@/lib/types";
import { workHref } from "@/lib/paths";
import { ConceptZoom } from "./ConceptZoom";

/** Static class names so Tailwind keeps them. */
const SPAN: Record<Concept["span"], string> = {
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
  7: "sm:col-span-7",
  8: "sm:col-span-8",
  12: "sm:col-span-12",
};

/**
 * Bento grid of concepts on a 12-column track. From sm up every tile is the
 * same height, set as a share of the grid's own width (cqw), and every phone
 * takes the same share of that height: the mockups stay one size and the
 * tiles keep their proportions at any width. Rows differ only in how they
 * split the 12 columns. On phones the grid is one column; a scene tile is
 * square there.
 */
export function ConceptGrid({
  locale,
  concepts,
  labels,
  zoomLabels,
}: {
  locale: Locale;
  concepts: Concept[];
  labels: HomeContent["playground"];
  /** Same wording as the case image zoom. */
  zoomLabels: { zoom: string; closeZoom: string };
}) {
  if (concepts.length === 0) {
    return (
      <div className="rounded-[28px] bg-surface p-8 shadow-card lg:rounded-[36px]">
        <h2 className="text-2xl font-medium tracking-[-0.021em]">{labels.emptyTitle}</h2>
        <p className="mt-3 max-w-[480px] leading-6 text-muted">{labels.emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-12 lg:gap-4">
        {concepts.map((c, i) => {
          const size = c.kind === "scene" ? "aspect-square sm:aspect-auto" : "h-[400px]";
          const tile = (
            <div
              role={c.live?.some(Boolean) ? undefined : "img"}
              aria-label={c.live?.some(Boolean) ? undefined : c.title}
              className={`group relative overflow-hidden rounded-[20px] bg-[color:var(--fill-quiet)] sm:h-[64cqw] lg:rounded-[24px] ${size}`}
            >
              {c.kind === "scene" ? (
                <Image
                  src={c.screens[0]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 460px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  priority={i < 2}
                />
              ) : (
                <>
                  {/* Stage: the first screen, blurred, so each tile gets its own colour. */}
                  {c.stage ? (
                    <span className="absolute inset-0" style={{ background: c.stage }} />
                  ) : (
                    <>
                      <Image src={c.screens[0]} alt="" fill sizes="120px" className="scale-150 object-cover blur-2xl" />
                      <span className="absolute inset-0 bg-black/20" />
                    </>
                  )}
                  <div className="relative flex h-full items-center justify-center gap-4">{phones(c, false, i < 2, !c.caseSlug)}</div>
                </>
              )}
              {/* Hairline edge so dark tiles still read as tiles on a dark page. */}
              <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
            </div>
          );

          return (
            <li key={c.slug} className={SPAN[c.span]}>
              {c.caseSlug ? (
                <Link href={workHref(locale, c.caseSlug)} className="block">
                  {tile}
                </Link>
              ) : (
                <ConceptZoom title={c.title} labels={zoomLabels} tile={tile}>
                  {c.kind === "scene" ? (
                    <Image
                      src={c.screens[0]}
                      alt={c.title}
                      width={716}
                      height={736}
                      sizes="100vw"
                      quality={90}
                      className="h-auto w-[min(calc(100vw-32px),calc((100dvh-80px)*716/736),900px)] shrink-0 rounded-[24px]"
                    />
                  ) : (
                    phones(c, true, false, false)
                  )}
                </ConceptZoom>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * One mockup per screen; `live[n]` swaps screen n for a live HTML page. In a
 * tile that opens the zoom the live page is a preview that lets clicks through
 * to the tile; in the zoom view it is interactive.
 */
function phones(c: Concept, large: boolean, priority: boolean, preview: boolean) {
  return Array.from({ length: Math.max(c.screens.length, c.live?.length ?? 0) }, (_, n) => {
    const live = c.live?.[n];
    return (
      <Phone key={live ?? c.screens[n]} large={large}>
        {live ? (
          <LiveScreen src={live} title={c.title} preview={preview} />
        ) : (
          <Image src={c.screens[n]} alt="" fill sizes={large ? "414px" : "190px"} quality={90} className="object-cover object-top" priority={priority} />
        )}
      </Phone>
    );
  });
}

/**
 * CSS iPhone: black bezel, titanium edge, Dynamic Island. In a tile it takes
 * 84% of the tile height; `large` (the zoom view) is sized by width to fit the
 * screen, so on a phone two screens sit side by side and scroll.
 */
function Phone({ children, large = false }: { children: React.ReactNode; large?: boolean }) {
  const frame = large
    ? "w-[min(calc(100vw-32px),calc((100dvh-80px)*402/874),414px)] shrink-0 rounded-[56px] p-[10px]"
    : "h-[84%] rounded-[30px] p-[5px] group-hover:-translate-y-1.5";
  return (
    <div
      className={`relative aspect-[402/874] bg-[#0b0b0c] shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_28px_56px_-16px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out ${frame}`}
    >
      <div className={`relative h-full w-full overflow-hidden bg-black ${large ? "rounded-[46px]" : "rounded-[25px]"}`}>{children}</div>
      <span className={`absolute left-1/2 h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-black ${large ? "top-[22px]" : "top-[11px]"}`} />
    </div>
  );
}

/**
 * A live HTML screen inside the phone. The page scales itself to the frame
 * width and runs its motion only while it is on screen.
 */
function LiveScreen({ src, title, preview }: { src: string; title: string; preview: boolean }) {
  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      tabIndex={preview ? -1 : undefined}
      className={`absolute inset-0 h-full w-full border-0 bg-white ${preview ? "pointer-events-none" : ""}`}
    />
  );
}
