"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowLeft, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useGeneration, useStyleProfile } from "@/lib/contexts"
import { ResultsPanel } from "./results-panel"
import type { EnhancePromptResponse } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ASPECT_RATIOS } from "@/lib/mock-data"

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
            room: "wall-1",
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
        addToHistory(allImages)
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
    <div className="flex flex-col min-h-[calc(100vh-73px)] bg-[#FEF8F2] dark:bg-background justify-between">
      {/* Top Header Row */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muse-taupe/10 pb-4"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/discover")}
              className="text-muted-foreground hover:text-foreground hover:bg-muse-selected/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quiz
            </Button>
            <div className="h-4 w-px bg-muse-taupe/20 hidden sm:block" />
            <h1 className="font-heading text-xl text-foreground font-semibold tracking-tight">
              Creation Canvas
            </h1>
          </div>

          {/* Quick Stats/Summary Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muse-taupe mr-1">Your Style:</span>
            {profile.styles.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-muse-selected/40 text-muse-brown rounded-md capitalize font-medium">
                {s}
              </span>
            ))}
            {profile.mood && (
              <span className="px-2 py-0.5 bg-muse-selected/40 text-muse-brown rounded-md capitalize font-medium">
                {profile.mood}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* UPPER PART - The Canvas Display */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 flex flex-col justify-center overflow-y-auto">
        <div className="w-full h-full flex flex-col justify-center">
          <ResultsPanel />
        </div>
      </div>

      {/* BOTTOM PART - The Prompt Console */}
      <div className="w-full max-w-4xl mx-auto px-6 pb-8 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", damping: 25 }}
          className="bg-white/80 dark:bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl shadow-[#564738]/5 p-5 relative overflow-hidden"
        >
          {/* Console Header / Controls replacing the AI prompt console text area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-border/10">
            {/* Aspect Ratio */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Aspect Ratio</span>
              <div className="flex gap-0.5 bg-[#FAF6F0] dark:bg-muted/30 p-0.5 rounded-lg border border-border/40">
                {Object.entries(ASPECT_RATIOS).map(([key, val]) => {
                  const isSelected = aspectRatio === key
                  return (
                    <button
                      key={key}
                      onClick={() => setAspectRatio(key)}
                      disabled={isGenerating || isInitializingPrompt}
                      className={cn(
                        "px-2.5 py-1 text-[11px] rounded-md transition-all duration-200",
                        isSelected 
                          ? "bg-white dark:bg-card text-foreground font-semibold shadow-sm" 
                          : "text-muted-foreground hover:text-foreground hover:bg-white/30"
                      )}
                    >
                      {val.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quality Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Quality</span>
              <div className="flex gap-0.5 bg-[#FAF6F0] dark:bg-muted/30 p-0.5 rounded-lg border border-border/40">
                {(["standard", "premium"] as const).map((q) => {
                  const isSelected = quality === q
                  return (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      disabled={isGenerating || isInitializingPrompt}
                      className={cn(
                        "px-2.5 py-1 text-[11px] rounded-md capitalize transition-all duration-200",
                        isSelected 
                          ? "bg-white dark:bg-card text-foreground font-semibold shadow-sm" 
                          : "text-muted-foreground hover:text-foreground hover:bg-white/30"
                      )}
                    >
                      {q}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Input Box Area */}
          <div className="relative">
            {isInitializingPrompt ? (
              <div className="h-[100px] md:h-[120px] flex flex-col justify-center items-center bg-[#FAF6F0]/40 dark:bg-muted/10 border border-dashed border-muse-taupe/30 rounded-xl animate-pulse text-center p-4">
                <Loader2 className="h-5 w-5 text-muse-taupe animate-spin mb-2" />
                <p className="text-xs font-semibold text-foreground">Drafting your personalized prompt...</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Translating your quiz profile into high-end art descriptors</p>
              </div>
            ) : (
              <div className="relative flex items-center">
                <Textarea
                  placeholder="Describe what you imagine in detail, or edit your quiz-generated prompt..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] md:min-h-[120px] bg-[#FAF6F0]/30 border-muse-taupe/10 rounded-xl resize-none placeholder:text-muted-foreground/50 focus-visible:ring-muse-peach text-sm pr-14 pb-12"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || isInitializingPrompt || !prompt.trim()}
                  size="icon"
                  className="absolute right-3 bottom-3 h-9 w-9 rounded-full bg-muse-peach hover:bg-muse-selected text-muse-brown border-none shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
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