"use client";

import posthog from "posthog-js";
import { canCollect, MEASUREMENT_VERSION, pageContext } from "./analytics-rules";

type EventName = "portfolio_viewed" | "case_viewed" | "case_card_seen" | "case_selected" | "case_auto_advanced" | "case_engaged" | "case_scroll_depth" | "contact_opened" | "contact_intent" | "resume_opened" | "social_opened";
type EventProperties = Record<string, string | number | boolean | null>;
type EntryMethod = "direct_or_external" | "link" | "auto_scroll" | "history_or_navigation";
let initialized = false;
let internal = false;
let test = false;
let pendingNavigation: { pathname: string; method: EntryMethod; at: number } | null = null;
const seenCards = new Set<string>();

export function resetCardImpressions() {
  seenCards.clear();
}

export function captureCardImpression(element: HTMLElement) {
  const properties: EventProperties = {
    target_case_slug: element.dataset.analyticsCard ?? null,
    placement: element.dataset.analyticsPlacement ?? "unknown",
    visibility_rule: "visible_50pct_1s_or_explicit_click",
  };
  const position = Number(element.dataset.analyticsPosition);
  if (position > 0) properties.card_position = position;
  const key = JSON.stringify(properties);
  if (seenCards.has(key)) return;
  seenCards.add(key);
  captureAnalytics("case_card_seen", properties);
}

function trafficType() {
  const query = new URLSearchParams(window.location.search);
  try {
    if (query.has("analytics_internal")) {
      internal = query.get("analytics_internal") === "1";
      window.localStorage.setItem("portfolio_analytics_internal", internal ? "1" : "0");
    } else internal = window.localStorage.getItem("portfolio_analytics_internal") === "1";
    if (query.has("analytics_test")) {
      test = query.get("analytics_test") === "1";
      window.sessionStorage.setItem("portfolio_analytics_test", test ? "1" : "0");
    } else test = window.sessionStorage.getItem("portfolio_analytics_test") === "1";
  } catch {
    // The URL still marks this visit when browser storage is unavailable.
    if (query.has("analytics_internal")) internal = query.get("analytics_internal") === "1";
    if (query.has("analytics_test")) test = query.get("analytics_test") === "1";
  }
  return test ? "test" : internal ? "internal" : "external";
}

export function initializeAnalytics() {
  if (typeof window === "undefined" || !canCollect(window.location.hostname, window.location.pathname)) return false;
  trafficType();
  if (initialized) return true;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key || !host) return false;
  try {
    posthog.init(key, {
      api_host: host,
      capture_pageview: "history_change",
      person_profiles: "identified_only",
      defaults: "2025-05-24",
      before_send: (event) => {
        if (!event || !canCollect(window.location.hostname, window.location.pathname)) return null;
        const { publicPage: _publicPage, ...context } = pageContext(window.location.pathname);
        void _publicPage;
        return {
          ...event,
          properties: {
            ...event.properties,
            ...context,
            measurement_version: MEASUREMENT_VERSION,
            analytics_traffic: trafficType(),
          },
        };
      },
    });
    initialized = true;
  } catch {
    // Analytics must never interrupt navigation or contact actions.
    return false;
  }
  return true;
}

export function captureAnalytics(event: EventName, properties: EventProperties = {}) {
  if (!initializeAnalytics()) return;
  try {
    posthog.capture(event, properties);
  } catch {
    // A blocked or unavailable collector must not affect the site.
  }
}

export function markCaseNavigation(href: string, method: "link" | "auto_scroll") {
  pendingNavigation = { pathname: new URL(href, window.location.origin).pathname, method, at: Date.now() };
}

export function takeEntryMethod(pathname: string, firstPage: boolean): EntryMethod {
  const pending = pendingNavigation;
  pendingNavigation = null;
  if (pending?.pathname === pathname && Date.now() - pending.at < 10_000) return pending.method;
  return firstPage ? "direct_or_external" : "history_or_navigation";
}

export function captureAnalyticsClick(event: MouseEvent) {
  if (event.button > 1 || !(event.target instanceof Element)) return;
  const element = event.target.closest<HTMLElement>("[data-analytics-event]");
  if (!element) return;
  const name = element.dataset.analyticsEvent;
  if (!["case_selected", "contact_intent", "resume_opened", "social_opened"].includes(name ?? "")) return;
  const properties: EventProperties = {
    placement: element.dataset.analyticsPlacement ?? "unknown",
    channel: element.dataset.analyticsChannel ?? null,
    action: "open_link",
  };
  if (name === "case_selected" && element instanceof HTMLAnchorElement) {
    const card = element.closest<HTMLElement>("[data-analytics-card]");
    if (card) captureCardImpression(card);
    properties.target_case_slug = pageContext(new URL(element.href).pathname).case_slug;
    const position = Number(element.dataset.analyticsPosition);
    if (position > 0) properties.card_position = position;
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && element.target !== "_blank") {
      markCaseNavigation(element.href, "link");
    }
  }
  captureAnalytics(name as EventName, properties);
}
