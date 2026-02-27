import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import type { GenerateRequest, GenerateResponse, GeneratedImage } from "@/lib/types"
import { GALLERY_ITEMS } from "@/lib/mock-data"

const ASPECT_RATIOS: Record<string, { width: number; height: number }> = {
  "3:4": { width: 864, height: 1184 },
  "1:1": { width: 1024, height: 1024 },
  "4:3": { width: 1184, height: 864 },
  "16:9": { width: 1344, height: 768 },
}

// Fallback for mock mode
let callCount = 0

export async function POST(request: Request) {
  const body: GenerateRequest = await request.json()
  const { enhancedPrompt, aspectRatio, count, quality } = body

  const dims = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS["3:4"]
  const apiKey = process.env.GOOGLE_AI_API_KEY

  console.log("🔑 API Key status:", apiKey ? `Found (${apiKey.substring(0, 10)}...)` : "NOT FOUND")
  console.log("📝 Prompt:", enhancedPrompt.substring(0, 50) + "...")
  console.log("📐 Aspect ratio:", aspectRatio)
  console.log("⚡ Quality:", quality)

  // If no API key, fall back to mock mode
  if (!apiKey) {
    console.warn("⚠️  GOOGLE_AI_API_KEY not found - using mock images")
    console.warn("⚠️  Make sure .env.local exists in project root and restart the server")
    
    // Simulate progressive loading with mock images
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
          controller.enqueue(encoder.encode(JSON.stringify(image) + '\n'))
        }
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  }

  try {
    console.log("🚀 Initializing Gemini API...")
    const genAI = new GoogleGenerativeAI(apiKey)
    
    const modelName = quality === "premium" 
      ? "gemini-3-pro-image-preview" 
      : "gemini-2.5-flash-image"
    
    console.log("🤖 Using model:", modelName)
    const model = genAI.getGenerativeModel({ model: modelName })

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const totalImages = count || 4
        console.log(`🎨 Generating ${totalImages} images in parallel (2 at a time)...`)
        
        // Generate images in batches of 2
        for (let batch = 0; batch < Math.ceil(totalImages / 2); batch++) {
          const batchStart = batch * 2
          const batchSize = Math.min(2, totalImages - batchStart)
          
          // Generate 2 images in parallel
          const promises = Array.from({ length: batchSize }, async (_, i) => {
            const imageIndex = batchStart + i
            try {
              console.log(`  📸 Generating image ${imageIndex + 1}/${totalImages}...`)
              const result = await model.generateContent({
                contents: [{
                  role: "user",
                  parts: [{ text: enhancedPrompt }]
                }],
                generationConfig: {
                  responseModalities: ["IMAGE"],
                  imageConfig: {
                    aspectRatio: aspectRatio,
                    ...(quality === "premium" && { imageSize: "2K" })
                  }
                }
              })

              const response = result.response
              const candidates = response.candidates
              
              if (candidates && candidates.length > 0) {
                const parts = candidates[0].content.parts
                
                for (const part of parts) {
                  if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
                    const base64Data = part.inlineData.data
                    const dataUrl = `data:${part.inlineData.mimeType};base64,${base64Data}`
                    
                    const image: GeneratedImage = {
                      id: `gen-${Date.now()}-${imageIndex}`,
                      url: dataUrl,
                      prompt: enhancedPrompt,
                      width: dims.width,
                      height: dims.height,
                    }
                    
                    console.log(`  ✅ Image ${imageIndex + 1} generated successfully`)
                    return image
                  }
                }
              }
              
              throw new Error("No image in response")
            } catch (error) {
              console.error(`Error generating image ${imageIndex}:`, error)
              // Fall back to mock image
              const item = GALLERY_ITEMS[imageIndex % GALLERY_ITEMS.length]
              return {
                id: `gen-${Date.now()}-${imageIndex}`,
                url: item.url,
                prompt: enhancedPrompt,
                width: dims.width,
                height: dims.height,
              }
            }
          })

          // Wait for both images in this batch and stream them as they complete
          const results = await Promise.allSettled(promises)
          
          for (const result of results) {
            if (result.status === 'fulfilled' && result.value) {
              controller.enqueue(encoder.encode(JSON.stringify(result.value) + '\n'))
            }
          }
        }
        
        console.log(`✅ All images generated`)
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
    
  } catch (error) {
    console.error("Gemini API error:", error)
    
    // Fall back to mock mode on error
    callCount++
    const offset = (callCount * 3) % GALLERY_ITEMS.length
    const images: GeneratedImage[] = Array.from({ length: count || 4 }, (_, i) => {
      const item = GALLERY_ITEMS[(offset + i) % GALLERY_ITEMS.length]
      return {
        id: `gen-${Date.now()}-${i}`,
        url: item.url,
        prompt: enhancedPrompt,
        width: dims.width,
        height: dims.height,
      }
    })

    return NextResponse.json({ images })
  }
}
