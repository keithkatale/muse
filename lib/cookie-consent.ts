export const COOKIE_CONSENT_KEY = "muse-cookie-consent"
export const COOKIE_CONSENT_VERSION = "1"

export type CookieConsentChoice = "all" | "essential"

export type CookieConsentState = {
  choice: CookieConsentChoice
  version: string
  updatedAt: string
}

export function parseConsent(raw: string | null): CookieConsentState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as CookieConsentState
    if (
      parsed?.version === COOKIE_CONSENT_VERSION &&
      (parsed.choice === "all" || parsed.choice === "essential")
    ) {
      return parsed
    }
  } catch {
    return null
  }
  return null
}

export function getStoredConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null
  return parseConsent(localStorage.getItem(COOKIE_CONSENT_KEY))
}

export function saveConsent(choice: CookieConsentChoice): CookieConsentState {
  const state: CookieConsentState = {
    choice,
    version: COOKIE_CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent("muse:cookie-consent", { detail: state }))
  return state
}

export function hasAnalyticsConsent(): boolean {
  const consent = getStoredConsent()
  return consent?.choice === "all"
}
