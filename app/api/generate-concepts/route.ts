import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import type { StartingConcept, StyleProfile } from "@/lib/types"
import { STARTING_CONCEPTS } from "@/lib/mock-data"

const SYSTEM_PROMPT = `You are a creative assistant for an AI wall art app. Generate 6 diverse, inspiring image generation concepts.

Requirements:
- Each concept should work for photorealistic wall art suitable for homes
- Mix of subjects: pets (dogs, cats), objects, landscapes, still life, portraits, nature
- Titles: 2-5 words, catchy
- Prompts: 1-2 sentences, descriptive enough for AI image generation

Return ONLY a valid JSON array. No markdown, no explanation. Format:
[{"id":"concept-1","title":"...","prompt":"..."},{"id":"concept-2","title":"...","prompt":"..."},...]

Use unique, creative ideas. Avoid repeating common tropes.`

const PALETTE_LABELS: Record<string, string> = {
  "warm-sunset": "warm golden, coral, amber",
  "cool-ocean": "cool blues, teals, aqua",
  "earth-stone": "earthy browns, tans, neutrals",
  botanical: "greens, sage, leaf tones",
  monochrome: "black, white, grayscale",
  "vibrant-pop": "vivid, saturated colors",
}
const STYLE_LABELS: Record<string, string> = {
  abstract: "abstract expressionist",
  realistic: "photorealistic",
  illustrated: "watercolor illustration",
  surreal: "surrealist",
  minimal: "minimalist",
  retro: "vintage retro",
}
const SUBJECT_LABELS: Record<string, string> = {
  landscapes: "landscapes",
  florals: "florals and botanicals",
  geometric: "geometric and abstract forms",
  animals: "animals and pets",
  architecture: "architecture and cityscapes",
  portraits: "portraits and figures",
  space: "space and cosmic",
  "still-life": "still life",
}
const MOOD_LABELS: Record<string, string> = {
  calm: "calm, serene",
  bold: "bold, dramatic",
  warm: "warm, cozy",
  fresh: "fresh, energetic",
  elegant: "elegant, refined",
  playful: "playful, whimsical",
}
const ROOM_LABELS: Record<string, string> = {
  "living-room": "living room",
  bedroom: "bedroom",
  office: "office",
  dining: "dining room",
  nursery: "nursery",
  hallway: "hallway",
}

function buildProfileSummary(profile: StyleProfile): string {
  const parts: string[] = []
  if (profile.palettes?.length) {
    parts.push(`Color palettes: ${profile.palettes.map((p) => PALETTE_LABELS[p] || p).join(", ")}`)
  }
  if (profile.styles?.length) {
    parts.push(`Art styles: ${profile.styles.map((s) => STYLE_LABELS[s] || s).join(", ")}`)
  }
  if (profile.subjects?.length) {
    parts.push(`Subjects: ${profile.subjects.map((s) => SUBJECT_LABELS[s] || s).join(", ")}`)
  }
  if (profile.mood) {
    parts.push(`Mood: ${MOOD_LABELS[profile.mood] || profile.mood}`)
  }
  if (profile.room) {
    parts.push(`Room: ${ROOM_LABELS[profile.room] || profile.room}`)
  }
  return parts.join(". ")
}

async function generateConceptsWithGemini(userPrompt: string): Promise<StartingConcept[]> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) return []

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    })

    const text = result.response.text()
    if (!text) return []

    let parsed: Array<{ id: string; title: string; prompt: string }> = []
    try {
      const cleaned = text.replace(/```json\n?|\n?```/g, "").trim()
      parsed = JSON.parse(cleaned)
    } catch {
      const start = text.indexOf("[")
      const end = text.lastIndexOf("]")
      if (start !== -1 && end !== -1 && end > start) {
        try {
          parsed = JSON.parse(text.slice(start, end + 1))
        } catch {
          parsed = []
        }
      }
    }

    return (Array.isArray(parsed) ? parsed : []).slice(0, 6).map((c, i) => ({
      id: c?.id || `concept-${i + 1}`,
      title: c?.title || "Concept",
      prompt: c?.prompt || "",
      styles: ["realistic"],
      subjects: ["landscapes"],
      moods: ["calm"],
    })).filter((c) => c.prompt.length > 0) as StartingConcept[]
  } catch {
    console.warn("Generate concepts: Gemini request failed, using fallback concepts.")
    return []
  }
}

const fallbackConcepts = () => STARTING_CONCEPTS.slice(0, 6).map((c) => ({
  id: c.id,
  title: c.title,
  prompt: c.prompt,
  styles: c.styles,
  subjects: c.subjects,
  moods: c.moods,
}))

export async function GET() {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json({ concepts: fallbackConcepts() })
  }
  try {
    const concepts = await generateConceptsWithGemini(
      `${SYSTEM_PROMPT}\n\nGenerate 6 new creative concepts now.`
    )
    if (concepts.length === 0) {
      return NextResponse.json({ concepts: fallbackConcepts() })
    }
    return NextResponse.json({ concepts })
  } catch {
    return NextResponse.json({ concepts: fallbackConcepts() })
  }
}

export async function POST(request: Request) {
  let styleProfile: StyleProfile | null = null
  try {
    const body = await request.json()
    if (body?.styleProfile && typeof body.styleProfile === "object") {
      const p = body.styleProfile as StyleProfile
      if (Array.isArray(p.palettes) && Array.isArray(p.styles) && Array.isArray(p.subjects)) {
        styleProfile = p
      }
    }
  } catch {
    // no body or invalid JSON
  }

  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json({ concepts: fallbackConcepts() })
  }

  const userPrompt = styleProfile
    ? `${SYSTEM_PROMPT}\n\nImportant: The user has completed a style quiz. Generate 6 concepts that MATCH their choices:\n${buildProfileSummary(styleProfile)}\n\nEach concept must fit their selected palettes, styles, subjects, mood, and room. Return ONLY a valid JSON array with the same format as above.`
    : `${SYSTEM_PROMPT}\n\nGenerate 6 new creative concepts now.`

  try {
    const concepts = await generateConceptsWithGemini(userPrompt)
    if (concepts.length === 0) {
      return NextResponse.json({ concepts: fallbackConcepts() })
    }
    return NextResponse.json({ concepts })
  } catch {
    return NextResponse.json({ concepts: fallbackConcepts() })
  }
}
