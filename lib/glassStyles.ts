import type { CSSProperties } from "react";

/** The name in the header and footer: same family as the rest of the site. */
export const navFont: CSSProperties = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
};

/*
 * Chrome bars and panels (header, footer, menus, player) share the look of the
 * home tabs and corner buttons: a 1px hairline and a solid card fill, no shadow
 * or glass highlight. The outer element paints the hairline through a 1px
 * padding (`p-px`); the inner one sits on top with a radius 1px smaller.
 */
export const outerPillStyle: CSSProperties = {
  background: "var(--border)",
};

export const innerPillStyle: CSSProperties = {
  background: "var(--surface)",
};

export const navLinkClass = "nav-link";
