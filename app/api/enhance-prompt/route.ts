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

  const subjectMap: Record<string, string> = {
    landscapes: "expansive natural landscapes and horizons",
    florals: "lush, detailed florals and botanicals",
    geometric: "bold geometric shapes and abstract forms",
    animals: "expressive animal portraits and silhouettes",
    architecture: "striking architectural forms and cityscapes",
    portraits: "intimate human portraits and figures",
    space: "cosmic space scenes with stars, planets, and nebulae",
    "still-life": "carefully composed still life arrangements",
  }

  const roomMap: Record<string, string> = {
    "living-room": "a living room focal wall above a sofa",
    bedroom: "a calming bedroom setting above a headboard",
    office: "a modern home office or studio backdrop",
    dining: "a dining room feature wall",
    nursery: "a soft, comforting nursery space",
    hallway: "a hallway or entryway gallery wall",
  }

  const aspectMap: Record<string, string> = {
    "3:4": "portrait orientation composition",
    "1:1": "square balanced composition",
    "4:3": "landscape orientation composition",
    "16:9": "wide panoramic composition",
  }

  const palettes = styleProfile.palettes.map((p) => paletteMap[p] || p).join(" and ")
  const styles = styleProfile.styles.map((s) => styleMap[s] || s).join(" blended with ")
  const subjects = styleProfile.subjects.map((s) => subjectMap[s] || s).join(" and ")
  const mood = styleProfile.mood ? moodMap[styleProfile.mood] || styleProfile.mood : ""
  const room = styleProfile.room ? roomMap[styleProfile.room] || styleProfile.room : ""
  const aspect = aspectMap[aspectRatio] || ""

  const baseSubject = subjects ? `Artwork featuring ${subjects}` : ""
  const roomContext = room ? `designed for display in ${room}` : ""
  const core = userInput || baseSubject

  const enhancedPrompt = [
    core,
    styles ? `in ${styles}` : "",
    palettes ? `using ${palettes}` : "",
    mood ? `evoking a ${mood}` : "",
    roomContext,
    aspect ? `composed for ${aspect}` : "",
    "Photographic, realistic, high detail. Professional composition, beautiful natural lighting. Suitable for wall art in households. Content only, no background environment or frame.",
  ]
    .filter(Boolean)
    .join(". ")

  const primarySubject = styleProfile.subjects[0] || "your chosen subject"
  const primaryStyle = styleProfile.styles[0] || "artistic"
  const baseSummary = userInput || `Art featuring ${primarySubject}`
  const conceptSummary = `${baseSummary} in ${primaryStyle} style`

  const response: EnhancePromptResponse = { enhancedPrompt, conceptSummary }
  return NextResponse.json(response)
}
