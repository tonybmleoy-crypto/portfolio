export const ANALYTICS_HOST = "lopatinanton.vercel.app";
export const MEASUREMENT_VERSION = "2";

export function pageContext(pathname: string) {
  const locale = /^\/en(?:\/|$)/.test(pathname) ? "en" : "ru";
  const path = (locale === "en" ? pathname.slice(3) : pathname).replace(/\/$/, "") || "/";
  const caseSlug = /^\/work\/([^/]+)$/.exec(path)?.[1];
  const publicPage = ["/", "/about", "/playground"].includes(path) || !!caseSlug;
  return { locale, page_path: path, case_slug: caseSlug ?? null, publicPage };
}

export function canCollect(hostname: string, pathname: string) {
  return hostname === ANALYTICS_HOST && pageContext(pathname).publicPage;
}

export function contentProgress(top: number, height: number, viewportHeight: number) {
  if (height <= 0) return 0;
  return Math.max(0, Math.min(100, ((viewportHeight - top) / height) * 100));
}

// A documented proxy for engagement, not a claim that somebody read the text.
export function isCaseEngaged(foregroundMs: number, maxProgress: number) {
  return foregroundMs >= 30_000 && maxProgress >= 50;
}
