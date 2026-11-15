"use client";

import { motion } from "framer-motion";
import { openContact } from "@/lib/contact";

/**
 * Pill CTA in the header and footer. With `contact` it opens the contact
 * dialog (mounted by the page) instead of following a link.
 */
export function GlassCTA({
  href,
  contact = false,
  label,
  size = "md",
  className,
}: {
  href?: string;
  contact?: boolean;
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const padding = size === "sm" ? "px-4 py-2" : "px-6 py-2.5";
  const classes = `hit-area cta-pill inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-[0.01em] ${padding} ${className ?? ""}`;
  const whileTap = { scale: 0.96, transition: { type: "spring" as const, bounce: 0, duration: 0.15 } };

  if (contact) {
    return (
      <motion.button type="button" onClick={openContact} whileTap={whileTap} className={classes}>
        {label}
      </motion.button>
    );
  }

  return (
    <motion.a href={href} target="_blank" rel="noreferrer" whileTap={whileTap} className={classes}>
      {label}
    </motion.a>
  );
}
