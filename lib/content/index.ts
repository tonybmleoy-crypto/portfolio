import { Dictionary, Locale } from "@/lib/types";
import { home as homeRu } from "./ru/home";
import { fintrack as fintrackRu } from "./ru/fintrack";
import { rentag as rentagRu } from "./ru/rentag";
import { sevenpr as sevenprRu } from "./ru/sevenpr";
import { home as homeEn } from "./en/home";
import { fintrack as fintrackEn } from "./en/fintrack";
import { rentag as rentagEn } from "./en/rentag";
import { sevenpr as sevenprEn } from "./en/sevenpr";

export const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    nav: { cv: "CV", behance: "Behance", linkedin: "LinkedIn", telegram: "Telegram", back: "Назад" },
    home: homeRu,
    caseStudies: { fintrack: fintrackRu, rentag: rentagRu, "7pr": sevenprRu },
  },
  en: {
    nav: { cv: "CV", behance: "Behance", linkedin: "LinkedIn", telegram: "Telegram", back: "Back" },
    home: homeEn,
    caseStudies: { fintrack: fintrackEn, rentag: rentagEn, "7pr": sevenprEn },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export const SOCIAL_LINKS = {
  telegram: "https://t.me/tonybml",
  telegramHandle: "@tonybml",
  cv: {
    ru: "https://drive.google.com/file/d/1yDsvn-dnZXsYthBaRwGL5iyTLMFofitj/view?usp=sharing",
    en: "https://drive.google.com/file/d/1wl-Fr-ryGZDkexVXBSbkI3Vblk3Bv_gA/view?usp=sharing",
  },
  behance: "https://www.behance.net/cyberpapaz",
  linkedin: "https://www.behance.net/",
  email: "tonybmleoy@gmail.com",
  phone: "+7 (922) 041-05-21",
};
