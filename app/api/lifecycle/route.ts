import { NextRequest, NextResponse } from "next/server"
import {
  cartItemsToKlaviyoItems,
  syncLeadToKlaviyo,
  trackAddedToCart,
  trackCompletedStyleQuiz,
  trackStartedCheckout,
  trackStartedStyleQuiz,
  trackStyleQuizProgress,
} from "@/lib/klaviyo"

type LifecycleEvent =
  | "started_quiz"
  | "quiz_progress"
  | "completed_quiz"
  | "added_to_cart"
  | "started_checkout"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const event = body.event as LifecycleEvent

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const profile = {
      styles: body.profile?.styles,
      subjects: body.profile?.subjects,
      palettes: body.profile?.palettes,
      mood: body.profile?.mood,
      room: body.profile?.room,
      orientation: body.profile?.orientation,
    }

    const items = Array.isArray(body.items)
      ? cartItemsToKlaviyoItems(body.items)
      : []

    switch (event) {
      case "started_quiz":
        await syncLeadToKlaviyo(email, profile)
        await trackStartedStyleQuiz(email, {
          quizStep: body.quizStep ?? 1,
          quizStepLabel: body.quizStepLabel ?? "Email",
          ...profile,
        })
        break

      case "quiz_progress":
        await syncLeadToKlaviyo(email, profile)
        await trackStyleQuizProgress(email, {
          quizStep: Number(body.quizStep) || 0,
          quizStepLabel: String(body.quizStepLabel || "Quiz"),
          ...profile,
        })
        break

      case "completed_quiz":
        await syncLeadToKlaviyo(email, profile)
        await trackCompletedStyleQuiz(email, profile)
        break

      case "added_to_cart":
        await trackAddedToCart({
          email,
          items,
          cartUrl: "/cart",
        })
        // Same drip as abandoned checkout — one flow, timer starts when they have items.
        await trackStartedCheckout({
          email,
          items,
          checkoutUrl: "/cart",
        })
        break

      case "started_checkout":
        await trackStartedCheckout({
          email,
          items,
          checkoutUrl: body.checkoutUrl,
          orderId: body.orderId,
        })
        break

      default:
        return NextResponse.json({ error: "Unknown event" }, { status: 400 })
    }

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error("Lifecycle track failed:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
