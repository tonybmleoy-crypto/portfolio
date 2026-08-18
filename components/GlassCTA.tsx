"use client";

import { motion } from "framer-motion";

export function GlassCTA({
  href,
  label,
  size = "md",
  className,
}: {
  href: string;
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const padding = size === "sm" ? "px-4 py-2" : "px-6 py-2.5";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileTap={{ scale: 0.96, transition: { type: "spring", bounce: 0, duration: 0.15 } }}
      className={`cta-pill inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-[0.01em] ${padding} ${className ?? ""}`}
    >
      {label}
    </motion.a>
  );
}
