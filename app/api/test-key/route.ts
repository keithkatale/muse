import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.FAL_KEY

  return NextResponse.json({
    hasKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.substring(0, 10) + "..." : "Not found",
    message: apiKey
      ? "API key is configured"
      : "API key not found. Add FAL_KEY to .env.local (get one at https://fal.ai/dashboard/keys) and restart the server.",
  })
}
