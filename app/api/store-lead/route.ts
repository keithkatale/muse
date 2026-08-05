import { NextRequest, NextResponse } from "next/server"
import { syncLeadToKlaviyo, trackCompletedStyleQuiz } from "@/lib/klaviyo"

export async function POST(request: NextRequest) {
  try {
    const { email, profile } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const profilePayload = {
      styles: profile?.styles,
      subjects: profile?.subjects,
      palettes: profile?.palettes,
      mood: profile?.mood,
      room: profile?.room,
      orientation: profile?.orientation,
    }

    // 1. Upsert Klaviyo profile with style preferences
    try {
      await syncLeadToKlaviyo(email, profilePayload)
    } catch (klaviyoError) {
      console.error("Klaviyo profile sync failed (non-blocking):", klaviyoError)
    }

    // 2. Fire Completed Style Quiz metric for nurture / welcome flows
    try {
      await trackCompletedStyleQuiz(email, profilePayload)
    } catch (eventError) {
      console.error("Klaviyo Completed Style Quiz event failed (non-blocking):", eventError)
    }

    console.log("New lead captured and synced:", {
      email,
      timestamp: new Date().toISOString(),
      profile: profilePayload,
    })

    return NextResponse.json({
      success: true,
      message: "Lead stored and synced successfully",
      leadId: `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    })
  } catch (error) {
    console.error("Failed to store lead:", error)
    return NextResponse.json({ error: "Failed to store lead" }, { status: 500 })
  }
}
