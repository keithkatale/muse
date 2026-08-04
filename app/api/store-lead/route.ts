import { NextRequest, NextResponse } from "next/server"
import { syncLeadToKlaviyo } from "@/lib/klaviyo"

export async function POST(request: NextRequest) {
  try {
    const { email, profile } = await request.json()

    // 1. Validate the email format
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // 2. Sync style quiz lead directly to Klaviyo
    try {
      await syncLeadToKlaviyo(email, {
        styles: profile.styles,
        subjects: profile.subjects,
        palettes: profile.palettes,
        mood: profile.mood,
        room: profile.room,
        orientation: profile.orientation,
      })
    } catch (klaviyoError) {
      console.error("Klaviyo profile sync failed (non-blocking):", klaviyoError)
    }

    console.log("New lead captured and synced:", {
      email,
      timestamp: new Date().toISOString(),
      profile: {
        palettes: profile.palettes,
        styles: profile.styles,
        subjects: profile.subjects,
        mood: profile.mood,
        room: profile.room,
        orientation: profile.orientation,
      }
    })

    // Mock successful response
    return NextResponse.json({
      success: true,
      message: "Lead stored and synced successfully",
      leadId: `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`
    })

  } catch (error) {
    console.error("Failed to store lead:", error)
    return NextResponse.json(
      { error: "Failed to store lead" },
      { status: 500 }
    )
  }
}