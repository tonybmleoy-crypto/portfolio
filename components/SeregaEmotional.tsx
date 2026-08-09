"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { SEREGA_EMOTIONAL_DEFAULTS, buildFrames, frameFromAmount, groupIntoWords } from "@/lib/seregaEmotional";

// React/framer-motion port of the serega-emotional motion contract
// (see .claude/skills/serega-emotional/SKILL.md). Ported rather than using
// the reference assets/motion/serega-emotional.js verbatim because that file
// targets the standalone "motion" package's imperative animate(), while this
// project uses framer-motion's React components.

export function SeregaEmotional({
  text,
  className,
  as: Tag = "span",
  delayOffset = 0,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
  delayOffset?: number;
}) {
  const settings = SEREGA_EMOTIONAL_DEFAULTS;
  const prefersReducedMotion = useReducedMotion();
  const words = useMemo(() => groupIntoWords(text), [text]);
  const frames = useMemo(() => buildFrames(settings), [settings]);
  const stagger = settings.staggerFrames / settings.frameRate;
  const startFrame = frameFromAmount(1, settings);

  let charIndex = 0;

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag aria-label={text} className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-pre">
          {word.map((grapheme) => {
            const delay = delayOffset + (charIndex + 1) * stagger;
            charIndex += 1;
            return (
              <motion.span
                key={charIndex}
                aria-hidden
                className="inline-block"
                style={{ transformOrigin: "50% 70%" }}
                initial={{
                  opacity: startFrame.opacity,
                  filter: `blur(${startFrame.blur}px)`,
                  y: startFrame.y,
                  scaleY: startFrame.scaleY,
                  rotate: startFrame.rotate,
                }}
                whileInView={{
                  opacity: frames.opacity,
                  filter: frames.blur.map((b) => `blur(${b}px)`),
                  y: frames.y,
                  scaleY: frames.scaleY,
                  rotate: frames.rotate,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: settings.settleDuration / 1000,
                  times: frames.times,
                  ease: "linear",
                  delay,
                }}
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
