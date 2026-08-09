// Pure math for the serega-emotional motion contract
// (see .claude/skills/serega-emotional/SKILL.md). Kept dependency- and
// "use client"-free so seregaEmotionalDuration can be called from Server
// Components; the actual animated rendering lives in components/SeregaEmotional.tsx.

export const SEREGA_EMOTIONAL_DEFAULTS = {
  frameRate: 60,
  staggerFrames: 1.5,
  linearDuration: 180,
  settleDuration: 680,
  frequency: 1,
  decay: 10,
  positionY: 32,
  scaleY: 0.78,
  rotation: 12,
  maxBlur: 10,
  sampleRate: 60,
};

export type SeregaEmotionalSettings = typeof SEREGA_EMOTIONAL_DEFAULTS;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function splitGraphemes(value: string): string[] {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), ({ segment }) => segment);
  }
  return Array.from(value);
}

export function groupIntoWords(text: string): string[][] {
  const words: string[][] = [];
  let word: string[] | null = null;
  let followsWhitespace = false;

  for (const grapheme of splitGraphemes(text)) {
    const isWhitespace = /^\s+$/u.test(grapheme);
    if (!word || (!isWhitespace && followsWhitespace)) {
      word = [];
      words.push(word);
    }
    word.push(grapheme);
    followsWhitespace = isWhitespace;
  }

  return words;
}

export function selectorAmount(localTimeMs: number, settings: SeregaEmotionalSettings) {
  const linearDuration = settings.linearDuration / 1000;
  const time = localTimeMs / 1000;

  if (time <= 0) return 1;
  if (time < linearDuration) return 1 - time / linearDuration;

  const springTime = time - linearDuration;
  const angularFrequency = settings.frequency * Math.PI * 2;
  return (
    ((-1 / linearDuration) * Math.sin(springTime * angularFrequency)) /
    (Math.exp(settings.decay * springTime) * angularFrequency)
  );
}

export function frameFromAmount(amount: number, settings: SeregaEmotionalSettings) {
  const positiveAmount = Math.max(0, amount);
  return {
    opacity: clamp(1 - amount, 0, 1),
    blur: settings.maxBlur * positiveAmount,
    y: settings.positionY * amount,
    scaleY: 1 + (settings.scaleY - 1) * amount,
    rotate: settings.rotation * amount,
  };
}

export function buildFrames(settings: SeregaEmotionalSettings) {
  const sampleCount = Math.max(2, Math.round((settings.settleDuration * settings.sampleRate) / 1000));
  const opacity: number[] = [];
  const blur: number[] = [];
  const y: number[] = [];
  const scaleY: number[] = [];
  const rotate: number[] = [];
  const times: number[] = [];

  for (let index = 0; index <= sampleCount; index += 1) {
    const progress = index / sampleCount;
    const localTime = settings.settleDuration * progress;
    const amount = index === sampleCount ? 0 : selectorAmount(localTime, settings);
    const frame = frameFromAmount(amount, settings);

    opacity.push(frame.opacity);
    blur.push(frame.blur);
    y.push(frame.y);
    scaleY.push(frame.scaleY);
    rotate.push(frame.rotate);
    times.push(progress);
  }

  return { opacity, blur, y, scaleY, rotate, times };
}

// Total time (seconds) for a text's reveal to fully settle, so a second
// instance can be chained to start right after this one finishes.
export function seregaEmotionalDuration(
  text: string,
  settings: SeregaEmotionalSettings = SEREGA_EMOTIONAL_DEFAULTS
) {
  const charCount = splitGraphemes(text).length;
  const stagger = settings.staggerFrames / settings.frameRate;
  return charCount * stagger + settings.settleDuration / 1000;
}
