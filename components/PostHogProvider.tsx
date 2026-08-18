"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/**
 * Boots PostHog on the client. Renders nothing.
 *
 * Without NEXT_PUBLIC_POSTHOG_KEY it stays inert, so local development and
 * preview builds don't send events or fail.
 */
export function PostHogProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      // The App Router navigates without a page load; this captures those.
      capture_pageview: "history_change",
      // The site has no sign-in, so person profiles would only inflate usage.
      person_profiles: "identified_only",
      defaults: "2025-05-24",
    });

    // Exposed so the instance can be inspected from the browser console.
    (window as unknown as { posthog: typeof posthog }).posthog = posthog;
  }, []);

  return null;
}
