"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureAnalytics, captureAnalyticsClick, captureCardImpression, initializeAnalytics, resetCardImpressions, takeEntryMethod } from "@/lib/analytics";
import { contentProgress, isCaseEngaged, pageContext } from "@/lib/analytics-rules";

/** Production-only analytics, plus explicit actions and foreground engagement. */
export function PostHogProvider() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    document.addEventListener("click", captureAnalyticsClick, true);
    document.addEventListener("auxclick", captureAnalyticsClick, true);
    return () => {
      document.removeEventListener("click", captureAnalyticsClick, true);
      document.removeEventListener("auxclick", captureAnalyticsClick, true);
    };
  }, []);

  useEffect(() => {
    if (!pathname || !initializeAnalytics()) return;
    const context = pageContext(pathname);
    const firstPage = previousPath.current === null;
    // Avoid duplicate funnel-entry events during React Strict Mode replay.
    if (previousPath.current !== pathname) {
      resetCardImpressions();
      const entryMethod = takeEntryMethod(pathname, firstPage);
      captureAnalytics("portfolio_viewed");
      if (context.case_slug) captureAnalytics("case_viewed", { entry_method: entryMethod });
      previousPath.current = pathname;
    }
    if (!context.case_slug) return;

    let foregroundMs = 0;
    let lastTick = performance.now();
    let active = document.visibilityState === "visible" && document.hasFocus();
    let maxProgress = 0;
    let engaged = false;
    const depths = new Set<number>();

    const sample = () => {
      // A route can change before React runs the previous effect's cleanup.
      if (window.location.pathname !== pathname) return;
      const now = performance.now();
      if (active) foregroundMs += Math.min(now - lastTick, 2_000);
      lastTick = now;
      active = document.visibilityState === "visible" && document.hasFocus();
      const body = document.querySelector<HTMLElement>("[data-case-content]");
      if (!body || !active) return;
      const rect = body.getBoundingClientRect();
      maxProgress = Math.max(maxProgress, contentProgress(rect.top, rect.height, window.innerHeight));
      for (const depth of [50, 90]) {
        if (maxProgress >= depth && !depths.has(depth)) {
          depths.add(depth);
          captureAnalytics("case_scroll_depth", { depth_percent: depth, foreground_seconds: Math.floor(foregroundMs / 1000) });
        }
      }
      if (!engaged && isCaseEngaged(foregroundMs, maxProgress)) {
        engaged = true;
        captureAnalytics("case_engaged", { foreground_seconds: Math.floor(foregroundMs / 1000), max_depth_percent: Math.floor(maxProgress), engagement_rule: "foreground_30s_depth_50_v1" });
      }
    };
    const timer = window.setInterval(sample, 1000);
    document.addEventListener("visibilitychange", sample);
    window.addEventListener("focus", sample);
    window.addEventListener("blur", sample);
    window.addEventListener("scroll", sample, { passive: true });
    sample();
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", sample);
      window.removeEventListener("focus", sample);
      window.removeEventListener("blur", sample);
      window.removeEventListener("scroll", sample);
    };
  }, [pathname]);

  useEffect(() => {
    if (!pathname || !initializeAnalytics() || typeof IntersectionObserver === "undefined") return;
    const observed = new Set<HTMLElement>();
    const pending = new Map<HTMLElement, number>();
    const visible = (element: HTMLElement) => {
      const r = element.getBoundingClientRect();
      const width = Math.max(0, Math.min(r.right, window.innerWidth) - Math.max(r.left, 0));
      const height = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
      return r.width * r.height > 0 && (width * height) / (r.width * r.height) >= 0.5;
    };
    const check = (element: HTMLElement) => {
      const active = document.visibilityState === "visible" && document.hasFocus();
      if (!active || !visible(element)) {
        window.clearTimeout(pending.get(element));
        pending.delete(element);
      } else if (!pending.has(element)) {
        pending.set(element, window.setTimeout(() => {
          pending.delete(element);
          if (window.location.pathname === pathname && element.isConnected && document.visibilityState === "visible" && document.hasFocus() && visible(element)) captureCardImpression(element);
        }, 1000));
      }
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => check(entry.target as HTMLElement));
    }, { threshold: [0, 0.5] });
    const discover = () => {
      document.querySelectorAll<HTMLElement>("[data-analytics-card]").forEach((element) => {
        if (!observed.has(element)) {
          observed.add(element);
          observer.observe(element);
        }
      });
    };
    const onVisibility = () => observed.forEach(check);
    const mutations = new MutationObserver(discover);
    mutations.observe(document.body, { childList: true, subtree: true });
    discover();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onVisibility);
    window.addEventListener("blur", onVisibility);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      pending.forEach((timer) => window.clearTimeout(timer));
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onVisibility);
      window.removeEventListener("blur", onVisibility);
    };
  }, [pathname]);

  return null;
}
