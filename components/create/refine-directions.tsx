"use client"

import { useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useGeneration } from "@/lib/contexts"
import { cn } from "@/lib/utils"

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

export function RefineDirections({ promptActive }: { promptActive: boolean }) {
  const {
    currentImages,
    isGenerating,
    setIsGenerating,
    activeModifiers,
    setActiveModifiers,
    enhancedPrompt,
    setCurrentImages,
    addToHistory,
    setSelectedImage,
    aspectRatio,
    quality,
  } = useGeneration()

  const handleRefine = useCallback(
    async (modifier?: string) => {
      if (isGenerating) return
      setIsGenerating(true)

      const modifiers = modifier ? [...activeModifiers, modifier] : activeModifiers
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

        if (!genRes.body) throw new Error("No response body")

        const reader = genRes.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        const allImages: Parameters<typeof addToHistory>[0] = []

        setCurrentImages([])
        setSelectedImage(null)

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim()
            if (line) {
              try {
                const image = JSON.parse(line)
                allImages.push(image)
                setCurrentImages([...allImages])
              } catch {
                // skip malformed line
              }
            }
          }
          buffer = lines[lines.length - 1]
        }

        if (allImages.length > 0) {
          addToHistory(allImages, { aspectRatio, quality })
        }
      } catch (error) {
        console.error("Refinement failed:", error)
      } finally {
        setIsGenerating(false)
      }
    },
    [
      isGenerating,
      setIsGenerating,
      activeModifiers,
      setActiveModifiers,
      enhancedPrompt,
      aspectRatio,
      quality,
      setCurrentImages,
      addToHistory,
      setSelectedImage,
    ]
  )

  const visible = currentImages.length > 0 && !isGenerating && promptActive

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute bottom-full left-0 right-0 z-0 mb-2 flex max-w-full gap-1.5 px-2 pb-1.5 overflow-x-auto no-scrollbar flex-nowrap justify-start sm:flex-wrap sm:justify-center sm:overflow-x-visible sm:px-1 sm:gap-2"
          style={{ transformOrigin: "bottom center" }}
        >
          {DIRECTION_TAGS.map((tag) => {
            const isSelected = activeModifiers.includes(tag.id)
            return (
              <button
                key={tag.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleRefine(tag.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3 sm:py-1.5 sm:text-xs shrink-0",
                  isSelected
                    ? "border-muse-peach bg-muse-peach text-muse-brown font-semibold shadow-sm"
                    : "border-muse-taupe/30 bg-transparent text-muted-foreground hover:border-muse-peach/50 hover:text-foreground"
                )}
              >
                {tag.label}
              </button>
            )
          })}
          <button
            type="button"
            aria-label="New composition"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setActiveModifiers([])
              handleRefine()
            }}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-muse-taupe/30 bg-transparent text-muted-foreground transition-all hover:border-muse-peach/50 hover:text-foreground sm:size-8"
          >
            <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
