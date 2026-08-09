"use client";

import { motion } from "framer-motion";
import { navFont } from "@/lib/glassStyles";

const variants = {
  rest: {
    background: "linear-gradient(180deg, rgba(30,30,34,0.92) 0%, rgba(10,10,12,0.92) 100%)",
    color: "#ffffff",
    boxShadow: "inset 0px 1px 0px 0px rgba(255,255,255,0.18), 0px 4px 14px -4px rgba(0,0,0,0.22)",
  },
  hover: {
    background: "#ffffff",
    color: "#0A0A0C",
    boxShadow: "inset 0px 1px 0px 0px rgba(255,255,255,0.7), 0px 8px 22px -6px rgba(16,16,18,0.18)",
  },
};

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
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96, transition: { type: "spring", bounce: 0, duration: 0.15 } }}
      variants={variants}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      style={navFont}
      className={`inline-flex items-center justify-center rounded-full text-sm font-medium tracking-[0.01em] ${padding} ${className ?? ""}`}
    >
      {label}
    </motion.a>
  );
}
