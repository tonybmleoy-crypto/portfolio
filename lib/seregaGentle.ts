// Pure config for the serega-gentle motion contract
// (see .claude/skills/serega-gentle/SKILL.md). Kept "use client"-free so
// seregaGentleDuration can be called from Server Components.

import { splitGraphemes } from "./seregaEmotional";

export const SEREGA_GENTLE_DEFAULTS = {
  durationMs: 500,
  staggerMs: 15,
  translateY: 15,
  easing: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
};

// Total time (seconds) for a text's reveal to fully settle, so a following
// block can be chained to start right after this one finishes.
export function seregaGentleDuration(text: string) {
  const charCount = splitGraphemes(text).length;
  const staggerSec = SEREGA_GENTLE_DEFAULTS.staggerMs / 1000;
  const durationSec = SEREGA_GENTLE_DEFAULTS.durationMs / 1000;
  return Math.max(0, charCount - 1) * staggerSec + durationSec;
}
