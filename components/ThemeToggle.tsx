"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun1 } from "iconsax-react";

export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before first paint (injected into <head>) so a visitor who picked dark
 * never sees a light flash. Kept in sync with the toggle below.
 */
export const themeInitScript = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark"){document.documentElement.setAttribute("data-theme","dark")}}catch(e){}})()`;

function applyThemeAttribute(dark: boolean) {
  const root = document.documentElement;
  if (dark) {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    // Private mode blocks storage. The choice still applies to this page.
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
    setReady(true);
  }, []);

  function toggle() {
    const next = !dark;
    const button = buttonRef.current;
    const canAnimate =
      button &&
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canAnimate) {
      setDark(next);
      applyThemeAttribute(next);
      return;
    }

    // The circle grows from the button's own center, so it works wherever
    // this toggle is rendered — desktop chip or the compact mobile button.
    const { left, top, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const root = document.documentElement;
    root.style.setProperty("--theme-toggle-x", `${x}px`);
    root.style.setProperty("--theme-toggle-y", `${y}px`);
    root.style.setProperty("--theme-toggle-r", `${radius}px`);

    const transition = document.startViewTransition(() => {
      // startViewTransition needs the "after" DOM committed and painted
      // before it takes its snapshot. A plain setState is batched and may
      // not have flushed yet, so force it synchronously.
      flushSync(() => setDark(next));
      applyThemeAttribute(next);
    });

    // The browser can legitimately refuse to animate (tab backgrounded,
    // reduced-transparency mode, a second click landing mid-transition).
    // The DOM update above still applies either way; only the animation
    // is skipped, so this only needs to stop it from surfacing as an
    // unhandled rejection.
    transition.ready.catch(() => {});
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className={`flex shrink-0 items-center justify-center text-[color:var(--nav-link)] transition-[color,background-color,transform] duration-150 hover:bg-[color:var(--nav-link-hover-bg)] hover:text-[color:var(--nav-link-hover)] active:scale-[0.92] ${className ?? "h-9 w-9 rounded-full"}`}
    >
      {/* Render nothing until mounted so SSR markup matches the stored choice. */}
      {ready &&
        (dark ? (
          <Sun1 color="currentColor" variant="Linear" size={18} />
        ) : (
          <Moon color="currentColor" variant="Linear" size={18} />
        ))}
    </button>
  );
}
