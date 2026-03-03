"use client"

import { useCallback } from "react"
import { motion } from "framer-motion"
import { Sparkles, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useGeneration, useStyleProfile } from "@/lib/contexts"
import { useRotatingConcepts } from "@/lib/hooks/use-rotating-concepts"
import { ASPECT_RATIOS } from "@/lib/mock-data"
import type { EnhancePromptResponse, GenerateResponse } from "@/lib/types"
import { cn } from "@/lib/utils"

const ASPECT_OPTIONS = Object.entries(ASPECT_RATIOS).map(([key, val]) => ({
  id: key,
  label: val.label,
  ratio: key,
}))

export function PromptPanel() {
  const {
    prompt, setPrompt,
    setEnhancedPrompt,
    setCurrentImages, addToHistory,
    setSelectedImage,
    isGenerating, setIsGenerating,
    aspectRatio, setAspectRatio,
    quality, setQuality,
  } = useGeneration()
  const { profile, isQuizComplete } = useStyleProfile()
  const { concepts } = useRotatingConcepts(profile ?? null)

  const hasStyleProfile = !!profile && isQuizComplete

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return
    if (!hasStyleProfile && !prompt.trim()) return
    setIsGenerating(true)
    setSelectedImage(null)
    setCurrentImages([]) // Clear existing images

    try {
      // Use quiz profile when available; otherwise default to realistic/photographic
      const styleProfile = hasStyleProfile
        ? profile!
        : {
          palettes: ["warm-sunset"],
          styles: ["realistic"],
          subjects: ["landscapes"],
          mood: "calm",
          room: "living-room",
        }

      const enhanceRes = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: prompt,
          styleProfile,
          aspectRatio,
        }),
      })
      const enhanced: EnhancePromptResponse = await enhanceRes.json()
      setEnhancedPrompt(enhanced.enhancedPrompt)

      // Step 2: Generate images with streaming
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enhancedPrompt: enhanced.enhancedPrompt,
          aspectRatio,
          count: 4,
          quality,
        }),
      })

      if (!genRes.body) {
        throw new Error("No response body")
      }

      // Read the streaming response
      const reader = genRes.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      const allImages: any[] = []

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        
        // Process all complete lines
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim()
          if (line) {
            try {
              const image = JSON.parse(line)
              allImages.push(image)
              // Update UI immediately with new image
              setCurrentImages([...allImages])
            } catch (e) {
              console.error("Failed to parse image:", e)
            }
          }
        }
        
        // Keep the last incomplete line in the buffer
        buffer = lines[lines.length - 1]
      }

      // Add to history once all images are loaded
      if (allImages.length > 0) {
        addToHistory(allImages)
      }
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, isGenerating, setIsGenerating, setSelectedImage, setCurrentImages, aspectRatio, setEnhancedPrompt, addToHistory, quality, profile, hasStyleProfile])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col gap-6"
    >
      {/* Starting Concepts */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">Starting Concepts</p>
        <div className="grid grid-cols-2 gap-2">
          {concepts.map((concept) => (
            <button
              key={concept.id}
              onClick={() => setPrompt(concept.prompt)}
              className={cn(
                "rounded-lg border border-border bg-card p-3 text-left text-xs leading-relaxed text-foreground transition-all hover:border-accent/50 hover:bg-card/80",
                prompt === concept.prompt && "border-accent bg-accent/5"
              )}
            >
              {concept.title}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div>
        <p className="mb-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Describe Your Art {hasStyleProfile && "(optional)"}
        </p>
        {hasStyleProfile && (
          <p className="mb-3 text-[11px] text-muted-foreground">
            We&apos;ll use your style quiz selections as the base. Add details here only if you want to guide the scene further.
          </p>
        )}
        <Textarea
          placeholder="A serene mountain lake at sunrise with soft mist rising..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] resize-none rounded-lg border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-accent"
        />
      </div>

      {/* Aspect Ratio */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">Aspect Ratio</p>
        <div className="flex gap-2">
          {ASPECT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setAspectRatio(opt.id)}
              className={cn(
                "flex-1 rounded-lg border border-border py-2 text-xs transition-all",
                aspectRatio === opt.id
                  ? "border-accent bg-accent/10 text-foreground font-medium"
                  : "bg-card text-muted-foreground hover:border-accent/30"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Toggle */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">Quality</p>
        <div className="flex gap-2">
          <button
            onClick={() => setQuality("standard")}
            className={cn(
              "flex-1 rounded-lg border border-border py-2.5 text-xs transition-all",
              quality === "standard"
                ? "border-accent bg-accent/10 text-foreground font-medium"
                : "bg-card text-muted-foreground hover:border-accent/30"
            )}
          >
            Standard
          </button>
          <button
            onClick={() => setQuality("premium")}
            className={cn(
              "flex-1 rounded-lg border border-border py-2.5 text-xs transition-all",
              quality === "premium"
                ? "border-accent bg-accent/10 text-foreground font-medium"
                : "bg-card text-muted-foreground hover:border-accent/30"
            )}
          >
            Premium
          </button>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={(!hasStyleProfile && !prompt.trim()) || isGenerating}
        className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Wand2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Art
          </>
        )}
      </Button>
    </motion.div>
  )
}
