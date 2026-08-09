"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { groupIntoWords } from "@/lib/seregaEmotional";
import { SEREGA_GENTLE_DEFAULTS } from "@/lib/seregaGentle";

export function SeregaGentle({
  text,
  className,
  as: Tag = "p",
  delayOffset = 0,
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "div";
  delayOffset?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const words = useMemo(() => groupIntoWords(text), [text]);
  const staggerSec = SEREGA_GENTLE_DEFAULTS.staggerMs / 1000;
  const durationSec = SEREGA_GENTLE_DEFAULTS.durationMs / 1000;

  let charIndex = 0;

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag aria-label={text} className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-pre">
          {word.map((grapheme) => {
            const delay = delayOffset + charIndex * staggerSec;
            charIndex += 1;
            return (
              <motion.span
                key={charIndex}
                aria-hidden
                className="inline-block"
                initial={{ opacity: 0, y: SEREGA_GENTLE_DEFAULTS.translateY }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: durationSec, ease: SEREGA_GENTLE_DEFAULTS.easing, delay }}
              >
                {grapheme}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
