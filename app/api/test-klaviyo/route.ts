import { NextResponse } from "next/server"
import { trackKlaviyoEvent } from "@/lib/klaviyo"

/**
 * Quick connectivity check for Klaviyo.
 * POST { "email": "you@example.com" } → fires a "Muse Test Event" metric.
 */
export async function GET() {
  const configured = Boolean(process.env.KLAVIYO_PRIVATE_API_KEY)
  return NextResponse.json({
    configured,
    message: configured
      ? "Klaviyo private key is set. POST { email } to fire a test event."
      : "Add KLAVIYO_PRIVATE_API_KEY to .env.local and restart the server.",
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = (body.email as string) || ""

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Provide a valid email" }, { status: 400 })
    }

    const result = await trackKlaviyoEvent({
      metric: "Muse Test Event",
      email,
      uniqueId: `test-${Date.now()}`,
      properties: {
        Source: "Muse /api/test-klaviyo",
        Timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      ...result,
      hint: result.success
        ? "Check Klaviyo → Analytics → Metrics → Muse Test Event (or the profile activity feed)."
        : "Check server logs and that KLAVIYO_PRIVATE_API_KEY has events:write scope.",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
