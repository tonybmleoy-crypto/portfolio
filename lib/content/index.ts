import { CaseStudy, Dictionary, HomeContent, Locale, ProjectCard } from "@/lib/types";
import { readOverrides } from "@/lib/admin/overrides";
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

function applyProjectOverrides(project: ProjectCard, locale: Locale): ProjectCard {
  const o = readOverrides().projects?.[project.slug];
  if (!o) return project;
  return {
    ...project,
    available: o.available ?? project.available,
    image: o.image ?? project.image,
    tag: o.tag ?? project.tag,
    timeline: o.timeline ?? project.timeline,
    users: o.users ?? project.users,
    description: o.description?.[locale] ?? project.description,
  };
}

function applyHomeOverrides(home: HomeContent, locale: Locale): HomeContent {
  const o = readOverrides().home;
  return {
    ...home,
    bio: o?.bio?.[locale] ?? home.bio,
    projects: home.projects.map((p) => applyProjectOverrides(p, locale)),
    about: {
      ...home.about,
      bio: o?.aboutBio?.[locale] ? o.aboutBio[locale]!.split(/\n{2,}/).filter(Boolean) : home.about.bio,
    },
  };
}

function applyCaseStudyOverrides(caseStudy: CaseStudy, locale: Locale): CaseStudy {
  const o = readOverrides().cases?.[caseStudy.slug];
  if (!o) return caseStudy;
  return {
    ...caseStudy,
    title: o.title ?? caseStudy.title,
    coverImage: o.coverImage ?? caseStudy.coverImage,
    coverWidth: o.coverWidth ?? caseStudy.coverWidth,
    coverHeight: o.coverHeight ?? caseStudy.coverHeight,
    subtitle: o.subtitle?.[locale] ?? caseStudy.subtitle,
  };
}

export function getDictionary(locale: Locale): Dictionary {
  const base = dictionaries[locale];
  return {
    ...base,
    home: applyHomeOverrides(base.home, locale),
    caseStudies: Object.fromEntries(
      Object.entries(base.caseStudies).map(([slug, cs]) => [slug, applyCaseStudyOverrides(cs, locale)]),
    ),
  };
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

const DEFAULT_MUSIC_LINKS: { label: string; href: string }[] = [
  { label: "Spotify", href: "https://open.spotify.com/album/03t1UCi1VABVGiEO1W5FZi" },
];

/** Streaming profiles shown under the player. */
export function getMusicLinks(): { label: string; href: string }[] {
  return readOverrides().musicLinks ?? DEFAULT_MUSIC_LINKS;
}

const DEFAULT_SOCIAL_LINKS = {
  telegram: "https://t.me/tonybml",
  telegramHandle: "@tonybml",
  cv: {
    ru: "https://drive.google.com/file/d/1f2unPZRwIX3vbDOvnKzSUKHJeyANUXZA/view?usp=sharing",
    en: "https://drive.google.com/file/d/10BLA0X578HJ5qZVQ8-3Z_xd70Ja14lJt/view?usp=sharing",
  },
  behance: "https://www.behance.net/cyberpapaz",
  linkedin: "https://www.linkedin.com/in/anton-lopatin-88a2a3396",
  email: "tonybmleoy@gmail.com",
  phone: "+7 (922) 041-05-21",
};

export type SocialLinks = typeof DEFAULT_SOCIAL_LINKS;

/**
 * Server-only: reads content-overrides.json via `fs`. Call this from a
 * Server Component (a page, not a "use client" file) and pass the plain
 * result down as props — importing it directly from client-side code pulls
 * `node:fs` into the browser bundle and the build fails.
 */
export function getSocialLinks(): SocialLinks {
  const o = readOverrides().social;
  return {
    telegram: o?.telegram ?? DEFAULT_SOCIAL_LINKS.telegram,
    telegramHandle: DEFAULT_SOCIAL_LINKS.telegramHandle,
    cv: {
      ru: o?.cv?.ru ?? DEFAULT_SOCIAL_LINKS.cv.ru,
      en: o?.cv?.en ?? DEFAULT_SOCIAL_LINKS.cv.en,
    },
    behance: o?.behance ?? DEFAULT_SOCIAL_LINKS.behance,
    linkedin: o?.linkedin ?? DEFAULT_SOCIAL_LINKS.linkedin,
    email: o?.email ?? DEFAULT_SOCIAL_LINKS.email,
    phone: o?.phone ?? DEFAULT_SOCIAL_LINKS.phone,
  };
}
