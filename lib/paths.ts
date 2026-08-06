import { Locale } from "@/lib/types";

export function homeHref(locale: Locale): string {
  return locale === "ru" ? "/" : "/en";
}

export function workHref(locale: Locale, slug: string): string {
  return locale === "ru" ? `/work/${slug}` : `/en/work/${slug}`;
}

export function alternateHref(locale: Locale, pathname: string): string {
  if (locale === "en") {
    return pathname === "/en" ? "/" : pathname.replace(/^\/en/, "") || "/";
  }
  return pathname === "/" ? "/en" : `/en${pathname}`;
}
