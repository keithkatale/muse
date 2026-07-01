"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGeneration, useStyleProfile } from "@/lib/contexts"
import { ResultsPanel } from "./results-panel"
import { MusePromptBox } from "./muse-prompt-box"
import { RefineDirections } from "./refine-directions"
import type { EnhancePromptResponse } from "@/lib/types"

export function AutoGenerationStudio() {
  const router = useRouter()
  const { profile, isQuizComplete } = useStyleProfile()
  const {
    prompt,
    setPrompt,
    currentImages,
    setEnhancedPrompt,
    setCurrentImages, 
    addToHistory,
    setSelectedImage,
    isGenerating, 
    setIsGenerating,
    aspectRatio,
    setAspectRatio,
    quality,
    setQuality,
    clearSession,
  } = useGeneration()

  const [isInitializingPrompt, setIsInitializingPrompt] = useState(false)
  const [promptFocused, setPromptFocused] = useState(false)

  // Set aspect ratio based on profile orientation (run once on mount if profile available)
  useEffect(() => {
    if (profile?.orientation && !aspectRatio) {
      const orientationToAspectRatio = {
        portrait: "3:4",
        landscape: "4:3"
      }
      setAspectRatio(orientationToAspectRatio[profile.orientation])
    }
  }, [profile?.orientation, setAspectRatio, aspectRatio])

  // Send selections to AI on mount to generate initial rich prompt (doesn't generate images automatically)
  const fetchInitialPrompt = useCallback(async () => {
    if (!profile || !isQuizComplete) return
    
    setIsInitializingPrompt(true)
    try {
      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: "", // Let the AI build the starting prompt entirely from the quiz profile
          styleProfile: profile,
          aspectRatio: aspectRatio || "3:4",
        }),
      })
      
      const data: EnhancePromptResponse = await res.json()
      setPrompt(data.enhancedPrompt)
      setEnhancedPrompt(data.enhancedPrompt)
    } catch (error) {
      console.error("Failed to fetch initial prompt:", error)
      const fallbackPrompt = createPromptFromProfile(profile)
      setPrompt(fallbackPrompt)
    } finally {
      setIsInitializingPrompt(false)
    }
  }, [profile, isQuizComplete, aspectRatio, setPrompt, setEnhancedPrompt])

  // Auto-fetch prompt on load if we have a profile and prompt is empty
  useEffect(() => {
    if (profile && isQuizComplete && !prompt && !isInitializingPrompt && currentImages.length === 0) {
      fetchInitialPrompt()
    }
  }, [profile, isQuizComplete, prompt, currentImages.length])

  const handleGenerate = useCallback(async () => {
    if (isGenerating || !prompt.trim()) return
    
    setIsGenerating(true)
    setSelectedImage(null)
    setCurrentImages([])

    try {
      // Step 1: Enhance the current prompt
      const enhanceRes = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: prompt,
          styleProfile: profile || {
            palettes: ["warm-sunset"],
            styles: ["realistic"],
            subjects: ["landscapes"],
            mood: "calm",
            room: "bedroom",
          },
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
        addToHistory(allImages, { aspectRatio, quality })
      }
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }, [profile, prompt, isGenerating, setIsGenerating, setSelectedImage, setCurrentImages, aspectRatio, setEnhancedPrompt, addToHistory, quality])

  // Redirect if no profile
  useEffect(() => {
    if (!profile || !isQuizComplete) {
      router.push("/discover")
    }
  }, [profile, isQuizComplete, router])

  if (!profile || !isQuizComplete) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No style profile found</p>
          <Button onClick={() => router.push("/discover")}>
            Take Style Quiz
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-73px)] flex-col bg-[#FEF8F2] dark:bg-background">
      {/* Header */}
      <div className="shrink-0 w-full border-b border-muse-taupe/10 px-4 py-3 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/discover")}
              className="text-muted-foreground hover:text-foreground hover:bg-muse-selected/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quiz
            </Button>
            <div className="hidden h-4 w-px bg-muse-taupe/20 sm:block" />
            <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Creation Canvas
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-muse-taupe">
              Your Style:
            </span>
            {profile.styles.map((s) => (
              <span
                key={s}
                className="rounded-md bg-muse-selected/40 px-2 py-0.5 font-medium capitalize text-muse-brown"
              >
                {s}
              </span>
            ))}
            {profile.mood && (
              <span className="rounded-md bg-muse-selected/40 px-2 py-0.5 font-medium capitalize text-muse-brown">
                {profile.mood}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Canvas */}
      <div className="relative min-h-0 flex-1">
        <ResultsPanel />
      </div>

      {/* Prompt + refine (refine rises from behind when prompt is active) */}
      <div className="shrink-0 border-t border-muse-taupe/10 px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mx-auto w-full max-w-3xl"
        >
          <RefineDirections promptActive={promptFocused} />
          <MusePromptBox
            value={prompt}
            onValueChange={setPrompt}
            onSend={handleGenerate}
            isGenerating={isGenerating}
            isInitializing={isInitializingPrompt}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            quality={quality}
            onQualityChange={setQuality}
            onFocusChange={setPromptFocused}
            placeholder="Edit your prompt or describe what you'd like to create…"
          />
        </motion.div>
      </div>
    </div>
  )
}

// Helper function to create a prompt from the user's profile
function createPromptFromProfile(profile: any): string {
  const { palettes, styles, subjects, mood } = profile
  
  let prompt = ""
  
  if (subjects.length > 0) {
    const primarySubject = subjects[0]
    const subjectMap: Record<string, string> = {
      landscapes: "a beautiful landscape scene",
      florals: "elegant flowers and botanical elements", 
      geometric: "geometric patterns and shapes",
      animals: "graceful animals in their natural habitat",
      architecture: "stunning architectural elements",
      portraits: "an artistic portrait",
      space: "cosmic and celestial imagery",
      "still-life": "a carefully composed still life"
    }
    prompt += subjectMap[primarySubject] || primarySubject
  }
  
  if (mood) {
    const moodMap: Record<string, string> = {
      calm: "with a peaceful and serene atmosphere",
      bold: "with vibrant energy and dynamic composition", 
      warm: "with warm, inviting tones",
      fresh: "with crisp, clean aesthetics",
      elegant: "with sophisticated and refined details",
      playful: "with whimsical and joyful elements"
    }
    prompt += " " + (moodMap[mood] || `with a ${mood} feeling`)
  }
  
  if (styles.length > 0) {
    const primaryStyle = styles[0]
    const styleMap: Record<string, string> = {
      abstract: "in an abstract artistic style",
      realistic: "with photorealistic detail",
      illustrated: "in an illustrated art style", 
      surreal: "with surreal and dreamlike qualities",
      minimal: "with clean, minimalist composition",
      retro: "with vintage and retro aesthetics"
    }
    prompt += ", " + (styleMap[primaryStyle] || `in ${primaryStyle} style`)
  }
  
  if (palettes.length > 0) {
    const primaryPalette = palettes[0]
    const paletteMap: Record<string, string> = {
      "warm-sunset": "using warm sunset colors",
      "cool-ocean": "using cool ocean tones", 
      "earth-stone": "using earthy, natural tones",
      botanical: "using natural green and botanical colors",
      monochrome: "in monochromatic tones",
      "vibrant-pop": "using vibrant, bold colors"
    }
    prompt += ", " + (paletteMap[primaryPalette] || `using ${primaryPalette.replace('-', ' ')} colors`)
  }
  
  return prompt
}