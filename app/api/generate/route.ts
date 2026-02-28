import { NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import type { GenerateRequest, GeneratedImage } from "@/lib/types"
import { GALLERY_ITEMS } from "@/lib/mock-data"

const ASPECT_RATIOS: Record<string, { width: number; height: number }> = {
  "3:4": { width: 864, height: 1184 },
  "1:1": { width: 1024, height: 1024 },
  "4:3": { width: 1184, height: 864 },
  "16:9": { width: 1344, height: 768 },
}

// Map app aspect ratio to fal Nano Banana Pro aspect_ratio (same enum: "3:4", "1:1", "4:3", "16:9")
// fal Nano Banana Pro model (Gemini 3 Pro Image)
const IMAGE_MODEL = "fal-ai/nano-banana-pro"

let callCount = 0

export async function POST(request: Request) {
  const body: GenerateRequest = await request.json()
  const { enhancedPrompt, aspectRatio, count, quality } = body

  const dims = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS["3:4"]
  const aspectRatioFal = aspectRatio as "3:4" | "1:1" | "4:3" | "16:9"
  const apiKey = process.env.FAL_KEY

  console.log("FAL_KEY status:", apiKey ? `Found (${apiKey.substring(0, 10)}...)` : "NOT FOUND")
  console.log("Prompt:", enhancedPrompt.substring(0, 50) + "...")
  console.log("Aspect ratio:", aspectRatio)
  console.log("Quality:", quality)

  if (!apiKey) {
    console.warn("FAL_KEY not found - using mock images")
    console.warn("Add FAL_KEY to .env.local (get one at https://fal.ai/dashboard/keys) and restart the server")

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        callCount++
        const offset = (callCount * 3) % GALLERY_ITEMS.length

        for (let i = 0; i < (count || 4); i++) {
          await new Promise((resolve) => setTimeout(resolve, 800))
          const item = GALLERY_ITEMS[(offset + i) % GALLERY_ITEMS.length]
          const image: GeneratedImage = {
            id: `gen-${Date.now()}-${i}`,
            url: item.url,
            prompt: enhancedPrompt,
            width: dims.width,
            height: dims.height,
          }
          controller.enqueue(encoder.encode(JSON.stringify(image) + "\n"))
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  }

  try {
    fal.config({ credentials: apiKey })

    const numImages = Math.min(count || 4, 4)
    const resolution = quality === "premium" ? "2K" : "1K"

    console.log("Generating", numImages, "images with", IMAGE_MODEL)

    const result = await fal.subscribe(IMAGE_MODEL, {
      input: {
        prompt: enhancedPrompt,
        aspect_ratio: aspectRatioFal,
        num_images: numImages,
        resolution: resolution as "1K" | "2K" | "4K",
      },
    })

    const data = result.data as {
      images: Array<{ url: string; width?: number; height?: number }>
      description?: string
    }
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const images = data?.images ?? []
        const baseId = `gen-${Date.now()}`
        for (let i = 0; i < images.length; i++) {
          const img = images[i]
          const generated: GeneratedImage = {
            id: `${baseId}-${i}`,
            url: img.url,
            prompt: enhancedPrompt,
            width: img.width ?? dims.width,
            height: img.height ?? dims.height,
          }
          controller.enqueue(encoder.encode(JSON.stringify(generated) + "\n"))
        }
        console.log("All images generated:", images.length)
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("fal API error:", error)

    callCount++
    const offset = (callCount * 3) % GALLERY_ITEMS.length
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        for (let i = 0; i < (count || 4); i++) {
          const item = GALLERY_ITEMS[(offset + i) % GALLERY_ITEMS.length]
          const image: GeneratedImage = {
            id: `gen-${Date.now()}-${i}`,
            url: item.url,
            prompt: enhancedPrompt,
            width: dims.width,
            height: dims.height,
          }
          controller.enqueue(encoder.encode(JSON.stringify(image) + "\n"))
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  }
}
