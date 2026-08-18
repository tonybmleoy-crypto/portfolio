import { Dictionary, Locale } from "@/lib/types";
import { home as homeRu } from "./ru/home";
import { fintrack as fintrackRu } from "./ru/fintrack";
import { rentag as rentagRu } from "./ru/rentag";
import { sevenpr as sevenprRu } from "./ru/sevenpr";
import { vodokachka as vodokachkaRu } from "./ru/vodokachka";
import { home as homeEn } from "./en/home";
import { fintrack as fintrackEn } from "./en/fintrack";
import { rentag as rentagEn } from "./en/rentag";
import { sevenpr as sevenprEn } from "./en/sevenpr";
import { vodokachka as vodokachkaEn } from "./en/vodokachka";

export const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    nav: { cv: "CV", behance: "Behance", linkedin: "LinkedIn", telegram: "Telegram", back: "Назад" },
    home: homeRu,
    caseStudies: { fintrack: fintrackRu, rentag: rentagRu, "7pr": sevenprRu, vodokachka: vodokachkaRu },
  },
  en: {
    nav: { cv: "CV", behance: "Behance", linkedin: "LinkedIn", telegram: "Telegram", back: "Back" },
    home: homeEn,
    caseStudies: { fintrack: fintrackEn, rentag: rentagEn, "7pr": sevenprEn, vodokachka: vodokachkaEn },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export interface Track {
  title: string;
  /** Band or project name shown under the title. */
  artist?: string;
  /** Audio file under /public, e.g. "/audio/track.mp3". */
  src: string;
  /** Optional square cover art under /public. */
  cover?: string;
}

/** Set the track to show the player. Leave it null and the player stays hidden. */
export const MUSIC_TRACK: Track | null = {
  title: "BRUTALISM",
  artist: "Eyes Of Yokai",
  src: "/audio/brutalism.mp3",
  cover: "/audio/brutalism-cover.jpg",
};

/** Streaming profiles shown under the player. */
export const MUSIC_LINKS: { label: string; href: string }[] = [
  { label: "Spotify", href: "https://open.spotify.com/album/03t1UCi1VABVGiEO1W5FZi" },
];

export const SOCIAL_LINKS = {
  telegram: "https://t.me/tonybml",
  telegramHandle: "@tonybml",
  cv: {
    ru: "https://drive.google.com/file/d/1yDsvn-dnZXsYthBaRwGL5iyTLMFofitj/view?usp=sharing",
    en: "https://drive.google.com/file/d/1wl-Fr-ryGZDkexVXBSbkI3Vblk3Bv_gA/view?usp=sharing",
  },
  behance: "https://www.behance.net/cyberpapaz",
  linkedin: "https://www.linkedin.com/in/anton-lopatin-88a2a3396",
  email: "tonybmleoy@gmail.com",
  phone: "+7 (922) 041-05-21",
};
