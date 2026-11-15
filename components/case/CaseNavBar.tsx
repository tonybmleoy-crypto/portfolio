"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { openContact } from "@/lib/contact";

/** Shown once this share of the page has been scrolled. */
const SHOW_AT = 0.15;
/** "Обсудим?" joins the bar from this share on: the reader has reached the end. */
const CTA_AT = 0.9;

/* Icons exported from Figma (987:1514): "home" and "chevron-up", 24px, filled. */
function HomeIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1415 1.06882C11.8034 0.944724 12.4864 0.965975 13.1415 1.13132L13.3055 1.17624C14.1203 1.42317 14.8316 1.94268 15.5751 2.47214L15.704 2.56491L19.8036 5.48093L19.8973 5.54733L20.3348 5.86081C20.7649 6.17523 21.1681 6.50216 21.4921 6.91355L21.6258 7.09226C21.9265 7.5145 22.1544 7.98462 22.3006 8.4819L22.3661 8.73483C22.4965 9.32639 22.4914 9.93869 22.4911 10.5727V16.6421L22.4852 17.7202C22.4823 17.8873 22.478 18.0486 22.4715 18.2026L22.4452 18.645C22.3969 19.2352 22.288 19.8514 21.9823 20.4516C21.5915 21.2183 20.9969 21.8605 20.2674 22.3081L19.9462 22.4878C19.4959 22.7171 19.0372 22.8358 18.5868 22.9009L18.1395 22.9507C17.859 22.9736 17.5495 22.9849 17.2147 22.9907L16.1366 22.9966C15.2842 22.9965 14.5926 22.305 14.5926 21.4526V14.1997C14.5926 13.6252 14.5927 13.2477 14.5692 12.9594C14.5522 12.7516 14.5251 12.6342 14.4989 12.561L14.4735 12.5005C14.3944 12.3455 14.2799 12.2112 14.1405 12.1098L13.9921 12.019C13.926 11.9855 13.8098 11.9469 13.5331 11.9243C13.2448 11.9008 12.8675 11.8999 12.2928 11.8999H11.7215C11.1468 11.8999 10.7696 11.9007 10.4813 11.9243C10.2734 11.9413 10.1562 11.9674 10.0829 11.9936L10.0223 12.019C9.86708 12.0981 9.73322 12.2134 9.6317 12.353L9.54088 12.5005C9.50737 12.5664 9.46784 12.6825 9.44518 12.9594C9.42164 13.2477 9.42174 13.6252 9.42174 14.1997V21.4389C9.42174 22.2452 8.80855 22.908 8.0233 22.9878L7.86412 22.9966C7.29073 22.9966 6.76657 22.9964 6.30357 22.977L5.86119 22.9507C5.34456 22.9084 4.80823 22.8204 4.28014 22.5942L4.05455 22.4878C3.17817 22.0412 2.46504 21.3288 2.01842 20.4526C1.78959 20.0033 1.67079 19.5438 1.60533 19.0932L1.55455 18.645C1.53164 18.3643 1.52099 18.0541 1.51549 17.7192L1.50963 16.6421V10.5727C1.50927 9.8495 1.50228 9.15189 1.69908 8.4819L1.76646 8.26999C1.93635 7.78011 2.1878 7.3212 2.50865 6.91355L2.67662 6.71433C3.08328 6.26508 3.58549 5.91459 4.1024 5.54733L4.15709 5.50925C4.17321 5.49803 4.18556 5.48915 4.19713 5.48093L8.29674 2.56491L8.42564 2.47214L9.01646 2.05612C9.60487 1.65186 10.196 1.29889 10.8592 1.13132L11.1415 1.06882ZM12.7001 2.87644C12.2983 2.77509 11.8795 2.76227 11.4735 2.83835L11.3006 2.87644C10.9337 2.96909 10.581 3.169 10.0575 3.52683L9.47057 3.93894L9.33971 4.03171L5.2401 6.94773C5.22003 6.962 5.20073 6.97612 5.18541 6.98679L5.14537 7.01413C4.57859 7.41682 4.25106 7.65678 4.01744 7.91452L3.92271 8.02683C3.75375 8.24151 3.6168 8.47954 3.51549 8.7319L3.42564 8.98972C3.3165 9.36143 3.31002 9.77713 3.31041 10.5727V16.6421L3.31529 17.6899C3.32022 17.9959 3.33022 18.2627 3.34947 18.4985L3.38658 18.8354C3.43245 19.1505 3.50561 19.4068 3.62193 19.6352L3.73228 19.8315C4.0069 20.2793 4.40054 20.6444 4.87096 20.8842L4.98814 20.9389C5.26578 21.0581 5.58808 21.1224 6.00768 21.1567L6.38658 21.1792C6.7333 21.1935 7.13842 21.1944 7.62096 21.1948V14.1997C7.62096 13.6548 7.62033 13.1914 7.65123 12.813C7.68304 12.424 7.75306 12.0448 7.93736 11.6831L8.04967 11.4829C8.32828 11.0289 8.72774 10.6586 9.20494 10.4155L9.34166 10.352C9.66181 10.2148 9.99443 10.1572 10.3348 10.1294C10.7134 10.0985 11.1766 10.1001 11.7215 10.1001H12.2928C12.8378 10.1001 13.301 10.0985 13.6796 10.1294C14.0685 10.1611 14.4477 10.2313 14.8094 10.4155L15.0096 10.5278C15.4636 10.8063 15.8338 11.2059 16.077 11.6831L16.1405 11.8198C16.2777 12.1399 16.3353 12.4726 16.3631 12.813C16.394 13.1914 16.3934 13.6548 16.3934 14.1997V21.1948C17.0568 21.1941 17.5734 21.191 17.993 21.1567L18.3299 21.1186C18.6459 21.0729 18.9017 21.0005 19.1297 20.8842L19.326 20.7739C19.7737 20.4993 20.1389 20.1058 20.3788 19.6352L20.4335 19.518C20.5525 19.2405 20.616 18.9179 20.6503 18.4985L20.6737 18.1206C20.6792 17.986 20.6828 17.8422 20.6854 17.6889L20.6903 16.6421V10.5727L20.6883 10.0425C20.6824 9.65135 20.6636 9.37492 20.6102 9.1323L20.5741 8.98972C20.4969 8.72734 20.3831 8.47721 20.2362 8.24851L20.078 8.02683C19.8982 7.79856 19.6647 7.6026 19.286 7.32468L18.8544 7.01413L18.7606 6.94773L14.661 4.03171L14.5301 3.93894C13.7627 3.39239 13.3121 3.08257 12.8837 2.93112L12.7001 2.87644Z"
      />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.4134 7.88885C11.795 7.76494 12.2057 7.7649 12.5873 7.88885L12.7806 7.966C12.962 8.05224 13.1123 8.1636 13.2396 8.27166C13.4016 8.40922 13.5805 8.58916 13.7679 8.77654L18.7357 13.7433C19.0868 14.0948 19.087 14.6654 18.7357 15.0168C18.3843 15.368 17.8137 15.3679 17.4623 15.0168L12.4955 10.049C12.2872 9.84079 12.1685 9.72269 12.0755 9.64373C12.048 9.62034 12.0284 9.60599 12.0169 9.59783C12.0062 9.596 11.9955 9.59613 11.9847 9.59783C11.9733 9.60585 11.9535 9.61967 11.9251 9.64373C11.8322 9.72268 11.7136 9.84064 11.5052 10.049L6.53745 15.0168C6.18606 15.3676 5.61633 15.3677 5.26499 15.0168C4.91357 14.6654 4.91367 14.0948 5.26499 13.7433L10.2328 8.77654C10.4202 8.58915 10.5981 8.40921 10.7601 8.27166C10.9302 8.12724 11.1413 7.97728 11.4134 7.88885Z" />
    </svg>
  );
}

/* Figma: white 12% fill and 1px white 12% ring (tokens carry the light theme). */
const roundButton =
  "flex size-[50px] shrink-0 items-center justify-center rounded-full border border-[color:var(--navbar-btn-border)] bg-[color:var(--navbar-btn)] text-foreground transition-[background-color,transform,margin] duration-300 hover:bg-[color:var(--navbar-btn-hover)] active:scale-[0.94] lg:size-[58px]";

/**
 * Floating bar of a case page (Figma 987:1514). It appears after the first
 * 15% of the page with Home and Up; near the end "Обсудим?" slides in between
 * them. Its outline fills with the accent colour as the page is read.
 *
 * The bar sits over the content column (same grid as the page), so it never
 * covers the case card or the contents on the left.
 */
export function CaseNavBar({ homeHref, labels }: { homeHref: string; labels: { home: string; top: string; cta: string } }) {
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The outline is an SVG rect drawn to the bar's real size, which changes
  // while "Обсудим?" slides in.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize[0];
      setSize({ w: box.inlineSize, h: box.blockSize });
    });
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  const shown = progress >= SHOW_AT;
  const cta = progress >= CTA_AT;
  const toTop = () =>
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  const gradientId = useId();
  const stroke = 1.5;
  const w = Math.max(0, size.w - stroke);
  const h = Math.max(0, size.h - stroke);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 lg:bottom-6">
      <div className="mx-auto flex max-w-[1120px] px-4 lg:px-6 xl:px-0">
        <div className="hidden shrink-0 lg:block lg:w-[440px]" />
        <div className="flex min-w-0 flex-1 justify-center lg:max-w-[680px]">
          <div
            ref={barRef}
            inert={!shown}
            className={`relative flex items-center rounded-full bg-[color:var(--navbar-bg)] p-4 shadow-card backdrop-blur-2xl backdrop-saturate-150 transition-[opacity,translate] duration-300 ease-out lg:px-6 ${
              shown ? "pointer-events-auto translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <svg aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" width={size.w} height={size.h}>
              {/* Figma: 1px stroke, #FF8547 → #994F2B left to right. */}
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="var(--progress-from)" />
                  <stop offset="1" stopColor="var(--progress-to)" />
                </linearGradient>
              </defs>
              <rect x={stroke / 2} y={stroke / 2} width={w} height={h} rx={h / 2} fill="none" stroke="var(--navbar-btn-border)" strokeWidth={1} />
              <rect
                x={stroke / 2}
                y={stroke / 2}
                width={w}
                height={h}
                rx={h / 2}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={stroke}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - progress}
              />
            </svg>

            <Link href={homeHref} aria-label={labels.home} title={labels.home} className={`${roundButton} relative`}>
              <HomeIcon />
            </Link>

            {/* Grid 0fr → 1fr opens the real width, so the bar (and its
                outline) grows smoothly instead of jumping. */}
            <div
              className={`grid transition-[grid-template-columns,opacity] duration-300 ease-out ${cta ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"}`}
            >
              <div className="-my-3 min-w-0 overflow-hidden py-3">
                <div className="px-6">
                  <button
                    type="button"
                    onClick={openContact}
                    tabIndex={cta ? 0 : -1}
                    className="hero-pill h-12 whitespace-nowrap rounded-full px-6 text-base font-medium lg:h-[52px]"
                  >
                    {labels.cta}
                  </button>
                </div>
              </div>
            </div>

            <button type="button" onClick={toTop} aria-label={labels.top} title={labels.top} className={`${roundButton} relative ${cta ? "ml-0" : "ml-6"}`}>
              <ChevronUpIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
