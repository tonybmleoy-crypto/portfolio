"use client";

import { useEffect, useRef } from "react";

/**
 * Light-theme portrait clip: Anton puts on sunglasses.
 *
 * Sits exactly over the photo inside the light Figma composition (83×111 at
 * 23,20 in the 130×140 box). Its poster is the last frame, glasses on, so a
 * visitor who arrives in the light theme just sees him in glasses. Switching
 * from dark to light plays the clip once from the start; it then rests on the
 * last frame. With reduced motion it never plays.
 *
 * Its own edges fade out (sides and bottom), so the hands and the hoodie never
 * end in a hard line; the box's radial mask fades the rest.
 */
export function GlassesPortrait() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let wasDark = root.getAttribute("data-theme") === "dark";

    const observer = new MutationObserver(() => {
      const isDark = root.getAttribute("data-theme") === "dark";
      if (wasDark && !isDark && !reduceMotion.matches) {
        video.currentTime = 0;
        // Autoplay of a muted inline clip is allowed; if a browser still
        // refuses, the poster (glasses on) stays, which is the end state anyway.
        video.play().catch(() => {});
      }
      wasDark = isDark;
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src="/images/home/portrait-glasses.mp4"
      poster="/images/home/portrait-glasses.jpg"
      muted
      playsInline
      preload="auto"
      aria-hidden
      className="absolute left-[23px] top-5 h-[111px] w-[83px] object-cover"
      style={{
        maskImage:
          "linear-gradient(to bottom, #000 72%, transparent), linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 72%, transparent), linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  );
}
