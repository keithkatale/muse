import { NextResponse } from "next/server"
import type { EnhancePromptRequest, EnhancePromptResponse } from "@/lib/types"

// PRODUCTION: Replace with Claude API call
// POST https://api.anthropic.com/v1/messages
// Headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" }
// The LLM takes the user's input + style profile and creates an optimized Nano Banana prompt

export async function POST(request: Request) {
  const body: EnhancePromptRequest = await request.json()
  const { userInput, styleProfile, aspectRatio } = body

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Build enhanced prompt from style profile
  const paletteMap: Record<string, string> = {
    "warm-sunset": "warm golden, coral, and amber tones",
    "cool-ocean": "cool blues, teals, and aqua tones",
    "earth-stone": "earthy browns, tans, and warm neutrals",
    "botanical": "rich greens, sage, and natural leaf tones",
    "monochrome": "black, white, and grayscale tones",
    "vibrant-pop": "vivid, saturated, contrasting colors",
  }

  const styleMap: Record<string, string> = {
    abstract: "abstract expressionist style with flowing forms",
    realistic: "photorealistic with fine detail and natural lighting",
    illustrated: "watercolor illustration with soft edges",
    surreal: "surrealist dreamlike composition",
    minimal: "minimalist clean lines and negative space",
    retro: "vintage retro poster aesthetic with bold graphics",
  }

  const moodMap: Record<string, string> = {
    calm: "calm, serene, and meditative atmosphere",
    bold: "bold, dramatic, and high-contrast atmosphere",
    warm: "warm, cozy, and inviting atmosphere",
    fresh: "fresh, energetic, and vibrant atmosphere",
    elegant: "elegant, refined, and sophisticated atmosphere",
    playful: "playful, whimsical, and joyful atmosphere",
  }

  const aspectMap: Record<string, string> = {
    "3:4": "portrait orientation composition",
    "1:1": "square balanced composition",
    "4:3": "landscape orientation composition",
    "16:9": "wide panoramic composition",
  }

  const palettes = styleProfile.palettes.map((p) => paletteMap[p] || p).join(" and ")
  const styles = styleProfile.styles.map((s) => styleMap[s] || s).join(" blended with ")
  const mood = styleProfile.mood ? moodMap[styleProfile.mood] || styleProfile.mood : ""
  const aspect = aspectMap[aspectRatio] || ""

  const enhancedPrompt = [
    userInput,
    styles ? `in ${styles}` : "",
    palettes ? `using ${palettes}` : "",
    mood ? `evoking a ${mood}` : "",
    aspect ? `composed for ${aspect}` : "",
    "Photographic, realistic, high detail. Professional composition, beautiful natural lighting. Suitable for wall art in households. Content only, no background environment or frame.",
  ]
    .filter(Boolean)
    .join(". ")

  const conceptSummary = `${userInput} with ${styleProfile.styles[0] || "artistic"} style`

  const response: EnhancePromptResponse = { enhancedPrompt, conceptSummary }
  return NextResponse.json(response)
}
