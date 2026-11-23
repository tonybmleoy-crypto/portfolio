import Image from "next/image";
import Link from "next/link";
import type { Concept, HomeContent, Locale } from "@/lib/types";
import { workHref } from "@/lib/paths";

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
export function ConceptGrid({ locale, concepts, labels }: { locale: Locale; concepts: Concept[]; labels: HomeContent["playground"] }) {
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
              role="img"
              aria-label={c.title}
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
                  <div className="relative flex h-full items-center justify-center gap-4">
                    {c.screens.map((src) => (
                      <Phone key={src} src={src} priority={i < 2} />
                    ))}
                  </div>
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
                tile
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** CSS iPhone: black bezel, titanium edge, Dynamic Island. Height-driven. */
function Phone({ src, priority }: { src: string; priority: boolean }) {
  return (
    <div className="relative aspect-[402/874] h-[84%] rounded-[30px] bg-[#0b0b0c] p-[5px] shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_28px_56px_-16px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
      <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-black">
        <Image src={src} alt="" fill sizes="190px" quality={90} className="object-cover object-top" priority={priority} />
      </div>
      <span className="absolute left-1/2 top-[11px] h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
    </div>
  );
}
