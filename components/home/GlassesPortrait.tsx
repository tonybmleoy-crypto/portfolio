"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { BEFORE_DARK_EVENT, type BeforeDarkDetail } from "@/lib/themeTransition";

/**
 * Light-theme portrait clips: Anton puts sunglasses on, and takes them off.
 *
 * Both sit exactly over the photo inside the light Figma composition (83×111
 * at 23,20 in the 130×140 box).
 * - "On": its poster is the last frame (glasses on), so a visitor who arrives
 *   in the light theme just sees him in glasses. Switching from dark to light
 *   plays it once; it rests on the last frame.
 * - "Off": the first two seconds of "on", reversed. When the theme toggle is
 *   about to go dark it asks first (runBeforeDark); this plays while the page
 *   is still light, and the theme switches once it ends. The dark theme has its
 *   own photo, so the glasses must come off before the switch.
 * With reduced motion neither plays and the theme switches at once.
 *
 * The clips' sides and bottom fade out, so the hands and the hoodie never end
 * in a hard line; the box's radial mask fades the rest.
 */
const clipStyle: CSSProperties = {
  maskImage:
    "linear-gradient(to bottom, #000 72%, transparent), linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to bottom, #000 72%, transparent), linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

const OFF_SPEED = 1.3;

export function GlassesPortrait() {
  const onRef = useRef<HTMLVideoElement>(null);
  const offRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const on = onRef.current;
    const off = offRef.current;
    if (!on || !off) return;
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let wasDark = root.getAttribute("data-theme") === "dark";

    const show = (which: "on" | "off") => {
      on.style.opacity = which === "on" ? "1" : "0";
      off.style.opacity = which === "off" ? "1" : "0";
    };

    // Dark → light: put the glasses on.
    const observer = new MutationObserver(() => {
      const isDark = root.getAttribute("data-theme") === "dark";
      if (wasDark && !isDark) {
        show("on");
        if (!reduceMotion.matches) {
          on.currentTime = 0;
          // Muted inline autoplay is allowed; if refused, the poster (glasses
          // on) stays, which is the end state anyway.
          on.play().catch(() => {});
        }
      }
      wasDark = isDark;
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    // Light → dark: take them off first, then let the theme switch.
    const onBeforeDark = (e: Event) => {
      const visible = root.getAttribute("data-theme") !== "dark" && on.offsetParent !== null;
      if (!visible || reduceMotion.matches) return;
      const { wait } = (e as CustomEvent<BeforeDarkDetail>).detail;
      wait(
        new Promise<void>((resolve) => {
          on.pause();
          off.currentTime = 0;
          off.playbackRate = OFF_SPEED;
          show("off");
          off.addEventListener("ended", () => resolve(), { once: true });
          off.play().catch(() => resolve());
        }),
      );
    };
    window.addEventListener(BEFORE_DARK_EVENT, onBeforeDark);

    return () => {
      observer.disconnect();
      window.removeEventListener(BEFORE_DARK_EVENT, onBeforeDark);
    };
  }, []);

  const className = "absolute left-[23px] top-5 h-[111px] w-[83px] object-cover";
  return (
    <>
      <video
        ref={onRef}
        src="/images/home/portrait-glasses.mp4"
        poster="/images/home/portrait-glasses.jpg"
        muted
        playsInline
        preload="auto"
        aria-hidden
        className={className}
        style={clipStyle}
      />
      <video
        ref={offRef}
        src="/images/home/portrait-glasses-off.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden
        className={className}
        style={{ ...clipStyle, opacity: 0 }}
      />
    </>
  );
}
