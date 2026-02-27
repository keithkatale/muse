"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ArrowRight, RotateCcw, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGeneration } from "@/lib/contexts"
import { cn } from "@/lib/utils"
import type { GenerateResponse } from "@/lib/types"

const DIRECTION_TAGS = [
  { id: "warmer", label: "Warmer", modifier: "with warmer golden tones" },
  { id: "cooler", label: "Cooler", modifier: "with cooler blue tones" },
  { id: "more-dramatic", label: "More Dramatic", modifier: "with more dramatic contrast and lighting" },
  { id: "more-subtle", label: "More Subtle", modifier: "with softer, more subtle tones" },
  { id: "more-detailed", label: "More Detailed", modifier: "with more intricate detail and texture" },
  { id: "more-abstract", label: "More Abstract", modifier: "in a more abstract, less literal style" },
  { id: "brighter", label: "Brighter", modifier: "with brighter, more luminous lighting" },
  { id: "darker", label: "Darker", modifier: "with deeper, moodier shadows" },
]

export function ResultsPanel() {
  const router = useRouter()
  const {
    currentImages,
    selectedImage, setSelectedImage,
    isGenerating, setIsGenerating,
    activeModifiers, setActiveModifiers,
    enhancedPrompt,
    setCurrentImages, addToHistory,
    aspectRatio,
    quality,
    generationHistory,
  } = useGeneration()

  const handleRefine = useCallback(
    async (modifier?: string) => {
      if (isGenerating) return
      setIsGenerating(true)

      const modifiers = modifier
        ? [...activeModifiers, modifier]
        : activeModifiers

      if (modifier) setActiveModifiers(modifiers)

      const refinedPrompt = [
        enhancedPrompt,
        ...modifiers.map(
          (m) => DIRECTION_TAGS.find((t) => t.id === m)?.modifier || ""
        ),
      ]
        .filter(Boolean)
        .join(". ")

      try {
        const genRes = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            enhancedPrompt: refinedPrompt,
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

        // Clear existing images
        setCurrentImages([])
        setSelectedImage(null)

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
        console.error("Refinement failed:", error)
      } finally {
        setIsGenerating(false)
      }
    },
    [isGenerating, setIsGenerating, activeModifiers, setActiveModifiers, enhancedPrompt, aspectRatio, quality, setCurrentImages, addToHistory, setSelectedImage]
  )

  const handleContinue = useCallback(() => {
    if (!selectedImage) return
    router.push(`/configure/${selectedImage.id}`)
  }, [selectedImage, router])

  // Empty state
  if (currentImages.length === 0 && !isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-24"
      >
        <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="font-serif text-xl text-foreground">Your art will appear here</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Describe what you imagine or pick a starting concept
        </p>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <AnimatePresence mode="wait">
          {isGenerating
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[3/4] overflow-hidden rounded-lg bg-muted"
                >
                  <div className="h-full w-full animate-pulse bg-gradient-to-br from-muted via-muted-foreground/5 to-muted" />
                </motion.div>
              ))
            : currentImages.map((img, i) => (
                <motion.button
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  onClick={() =>
                    setSelectedImage(
                      selectedImage?.id === img.id ? null : img
                    )
                  }
                  className={cn(
                    "group relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all",
                    selectedImage?.id === img.id
                      ? "border-accent ring-2 ring-accent/20"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={`Generated variant ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                  {selectedImage?.id === img.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent"
                    >
                      <Check className="h-3.5 w-3.5 text-accent-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
        </AnimatePresence>
      </div>

      {/* Refinement Controls */}
      {currentImages.length > 0 && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Refine Direction
            </p>
            <div className="flex flex-wrap gap-2">
              {DIRECTION_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleRefine(tag.id)}
                  className={cn(
                    "rounded-full border border-border px-3 py-1.5 text-xs transition-all hover:border-accent/50 hover:bg-accent/5",
                    activeModifiers.includes(tag.id)
                      ? "border-accent bg-accent/10 text-foreground font-medium"
                      : "bg-card text-muted-foreground"
                  )}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              onClick={() => {
                setActiveModifiers([])
                handleRefine()
              }}
              variant="outline"
              size="sm"
              className="rounded-full border-border text-foreground hover:bg-card"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Try Different Composition</span>
              <span className="sm:hidden">Try Different</span>
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!selectedImage}
              size="sm"
              className="sm:ml-auto rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
            >
              <span className="hidden sm:inline">Continue to Print Options</span>
              <span className="sm:hidden">Continue</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Generation History */}
          {generationHistory.length > 1 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                History ({generationHistory.length} generations)
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {generationHistory.map((batch, batchIdx) => (
                  <button
                    key={batchIdx}
                    onClick={() => {
                      setCurrentImages(batch)
                      setSelectedImage(null)
                    }}
                    className="flex shrink-0 gap-1 rounded-md border border-border bg-card p-1.5 transition-all hover:border-accent/30"
                  >
                    {batch.slice(0, 2).map((img) => (
                      <div key={img.id} className="relative h-8 w-8 overflow-hidden rounded-sm">
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
