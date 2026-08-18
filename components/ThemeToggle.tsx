"use client";

import { useEffect, useState } from "react";
import { Moon, Sun1 } from "iconsax-react";

export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before first paint (injected into <head>) so a visitor who picked dark
 * never sees a light flash. Kept in sync with the toggle below.
 */
export const themeInitScript = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark"){document.documentElement.setAttribute("data-theme","dark")}}catch(e){}})()`;

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
    setReady(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;

    if (next) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Private mode blocks storage. The choice still applies to this page.
    }
  }

  return (
    <button
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
