import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import type { StartingConcept } from "@/lib/types"
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

export async function GET() {
  const apiKey = process.env.GOOGLE_AI_API_KEY

  if (!apiKey) {
    const fallback = STARTING_CONCEPTS.slice(0, 6).map((c) => ({
      id: c.id,
      title: c.title,
      prompt: c.prompt,
    }))
    return NextResponse.json({ concepts: fallback })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: `${SYSTEM_PROMPT}\n\nGenerate 6 new creative concepts now.` }],
      }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1024,
      },
    })

    const text = result.response.text()
    if (!text) throw new Error("Empty response")

    let parsed: Array<{ id: string; title: string; prompt: string }>
    try {
      const cleaned = text.replace(/```json\n?|\n?```/g, "").trim()
      parsed = JSON.parse(cleaned)
    } catch {
      throw new Error("Invalid JSON response")
    }

    const concepts: StartingConcept[] = (Array.isArray(parsed) ? parsed : []).slice(0, 6).map((c, i) => ({
      id: c?.id || `concept-${i + 1}`,
      title: c?.title || "Concept",
      prompt: c?.prompt || "",
      styles: ["realistic"],
      subjects: ["landscapes"],
      moods: ["calm"],
    })).filter((c) => c.prompt.length > 0)

    if (concepts.length === 0) {
      const fallback = STARTING_CONCEPTS.slice(0, 6)
      return NextResponse.json({ concepts: fallback })
    }

    return NextResponse.json({ concepts })
  } catch (error) {
    console.error("Generate concepts error:", error)
    const fallback = STARTING_CONCEPTS.slice(0, 6).map((c) => ({
      id: c.id,
      title: c.title,
      prompt: c.prompt,
      styles: c.styles,
      subjects: c.subjects,
      moods: c.moods,
    }))
    return NextResponse.json({ concepts: fallback })
  }
}
