/** Fire-and-forget client helper for Klaviyo lifecycle events. */
export type LifecycleEvent =
  | "started_quiz"
  | "quiz_progress"
  | "completed_quiz"
  | "added_to_cart"
  | "started_checkout"

export function trackLifecycle(payload: {
  email?: string | null
  event: LifecycleEvent
  profile?: Record<string, unknown>
  quizStep?: number
  quizStepLabel?: string
  items?: Array<Record<string, unknown>>
  checkoutUrl?: string
}) {
  const email = payload.email?.trim()
  if (!email || !email.includes("@")) return

  try {
    void fetch("/api/lifecycle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, email }),
      keepalive: true,
    })
  } catch {
    // non-blocking
  }
}
