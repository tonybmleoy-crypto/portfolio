import { Locale } from "@/lib/types";

const NBSP = " ";

/**
 * Short words that must stay on the same line as the word after them.
 * Russian: prepositions, conjunctions and particles of 1-3 letters.
 * English: articles and 1-2 letter function words.
 */
const GLUE_WORDS: Record<Locale, string> = {
  ru: "в|во|к|ко|с|со|у|о|об|обо|и|а|но|на|по|из|за|от|до|не|ни|да|для|при|про|над|под|без|или|же|бы|ли",
  en: "a|an|the|i|in|on|at|to|of|by|or|as|is|it|up|so|we|my|no|and|but|for",
};

const GLUE_AFTER_WORD: Record<Locale, RegExp> = {
  ru: new RegExp(`(?<![\\p{L}\\p{N}])(${GLUE_WORDS.ru}) (?=\\S)`, "giu"),
  en: new RegExp(`(?<![\\p{L}\\p{N}])(${GLUE_WORDS.en}) (?=\\S)`, "giu"),
};

/**
 * Keeps short words, numbers, dashes, arrows and key combos from being
 * stranded at the end of a line, by swapping the space that follows them for
 * a non-breaking one. Leaves URLs, paths and anything without a space alone.
 */
export function typograph(text: string, locale: Locale): string {
  if (!text.includes(" ") || /^(\/|https?:\/\/|mailto:)/.test(text)) return text;

  let out = text;
  // Run twice so chains like "в на" or "и в" are all caught (the first pass skips the overlap).
  for (let i = 0; i < 2; i++) out = out.replace(GLUE_AFTER_WORD[locale], `$1${NBSP}`);

  return (
    out
      // "слово — слово": keep the dash with the word before it.
      .replace(/ ([—–]) /g, `${NBSP}$1 `)
      // "13 с", "4 годами": a number stays with its unit or noun.
      .replace(/(\d) (?=\p{L})/gu, `$1${NBSP}`)
      // "Ctrl + Alt + V" and "0 → 1" read as one unit.
      .replace(/ ([+→]) /g, `${NBSP}$1${NBSP}`)
  );
}

/** Applies `typograph` to every sentence-like string in a content tree. */
export function typographTree<T>(value: T, locale: Locale): T {
  if (typeof value === "string") return typograph(value, locale) as T;
  if (Array.isArray(value)) return value.map((item) => typographTree(item, locale)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, typographTree(item, locale)]),
    ) as T;
  }
  return value;
}
