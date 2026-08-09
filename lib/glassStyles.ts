import type { CSSProperties } from "react";

export const navFont: CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

export const outerPillStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.75) 100%)",
  boxShadow: "0px 8px 24px rgba(0,0,0,0.05)",
};

export const innerPillStyle: CSSProperties = {
  background: "rgba(255,255,255,0.45)",
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  boxShadow: "inset 0px 1px 0px 0px rgba(255,255,255,0.6)",
};

export const navLinkClass =
  "rounded-full px-4 py-2.5 text-sm font-medium tracking-[0.01em] text-[rgba(20,20,25,0.55)] transition-[color,background-color,box-shadow,transform] duration-150 hover:bg-white/50 hover:text-[rgb(10,10,12)] hover:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.7),0px_4px_14px_-4px_rgba(148,160,181,0.3)] active:scale-[0.96] active:bg-white/60";
