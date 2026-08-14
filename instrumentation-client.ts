import posthog from "posthog-js"
import {
  COOKIE_CONSENT_KEY,
  hasAnalyticsConsent,
  parseConsent,
} from "@/lib/cookie-consent"

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

/**
 * Client-side PostHog bootstrap (Next.js App Router).
 * Capturing stays opted out until the user accepts analytics cookies.
 */
if (typeof window !== "undefined" && token) {
  posthog.init(token, {
    api_host: host,
    defaults: "2026-05-30",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    opt_out_capturing_by_default: true,
  })

  if (hasAnalyticsConsent()) {
    posthog.opt_in_capturing()
  }

  window.addEventListener("muse:cookie-consent", ((event: CustomEvent) => {
    const choice = event.detail?.choice
    if (choice === "all") {
      posthog.opt_in_capturing()
    } else {
      posthog.opt_out_capturing()
    }
  }) as EventListener)

  // In case consent was written without the custom event (older sessions)
  const stored = parseConsent(localStorage.getItem(COOKIE_CONSENT_KEY))
  if (stored?.choice === "all") {
    posthog.opt_in_capturing()
  }
}
