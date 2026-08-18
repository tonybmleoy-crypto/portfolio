import type { CSSProperties } from "react";

export const navFont: CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

export const outerPillStyle: CSSProperties = {
  background: "var(--glass-outer-bg)",
  boxShadow: "var(--glass-outer-shadow)",
};

export const innerPillStyle: CSSProperties = {
  background: "var(--glass-inner-bg)",
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  boxShadow: "var(--glass-inner-inset)",
};

export const navLinkClass = "nav-link";
