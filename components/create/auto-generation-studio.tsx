"use client"

import { useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGeneration, useStyleProfile } from "@/lib/contexts"
import { ResultsPanel } from "./results-panel"
import type { EnhancePromptResponse } from "@/lib/types"

export function AutoGenerationStudio() {
  const router = useRouter()
  const { profile, isQuizComplete } = useStyleProfile()
  const {
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
  } = useGeneration()

  // Set aspect ratio based on profile orientation
  useEffect(() => {
    if (profile?.orientation) {
      const orientationToAspectRatio = {
        portrait: "3:4",
        landscape: "4:3"
      }
      setAspectRatio(orientationToAspectRatio[profile.orientation])
    }
  }, [profile?.orientation, setAspectRatio])

  const generateFromProfile = useCallback(async () => {
    if (!profile || !isQuizComplete || isGenerating) return
    
    setIsGenerating(true)
    setSelectedImage(null)
    setCurrentImages([])

    try {
      // Create a prompt based on the user's profile selections
      const autoPrompt = createPromptFromProfile(profile)
      
      // Step 1: Enhance the auto-generated prompt
      const enhanceRes = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: autoPrompt,
          styleProfile: profile,
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
  }, [profile, isQuizComplete, isGenerating, setIsGenerating, setSelectedImage, setCurrentImages, aspectRatio, setEnhancedPrompt, addToHistory, quality])

  // Auto-generate on component mount (only if no images are already generated)
  useEffect(() => {
    if (profile && isQuizComplete && !isGenerating && currentImages.length === 0) {
      generateFromProfile()
    }
  }, [profile, isQuizComplete, currentImages.length]) // Only run when profile is available and no images exist yet

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
    <div className="min-h-[calc(100vh-73px)]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/discover")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quiz
            </Button>
          </div>
          
          <h1 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl text-balance">
            Your Personalized Art
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Generated based on your style preferences • {profile.email}
          </p>

          {/* Profile Summary */}
          <div className="mt-6 flex flex-wrap gap-2">
            {profile.palettes.map((palette) => (
              <span key={palette} className="px-3 py-1 bg-muse-selected text-muse-brown text-xs rounded-full">
                {palette.replace('-', ' ')}
              </span>
            ))}
            {profile.styles.map((style) => (
              <span key={style} className="px-3 py-1 bg-muse-selected text-muse-brown text-xs rounded-full">
                {style}
              </span>
            ))}
            {profile.subjects.slice(0, 2).map((subject) => (
              <span key={subject} className="px-3 py-1 bg-muse-selected text-muse-brown text-xs rounded-full">
                {subject}
              </span>
            ))}
            {profile.mood && (
              <span className="px-3 py-1 bg-muse-selected text-muse-brown text-xs rounded-full">
                {profile.mood} mood
              </span>
            )}
            {profile.orientation && (
              <span className="px-3 py-1 bg-muse-selected text-muse-brown text-xs rounded-full">
                {profile.orientation}
              </span>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col gap-6">
          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
          >
            <div className="text-sm text-muted-foreground">
              {isGenerating ? "Creating your personalized artwork..." : "4 unique variations generated"}
            </div>
            <Button
              onClick={generateFromProfile}
              loading={isGenerating}
              size="sm"
            >
              {isGenerating ? 'Generating' : 'Generate New Variations'}
            </Button>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ResultsPanel />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Helper function to create a prompt from the user's profile
function createPromptFromProfile(profile: any): string {
  const { palettes, styles, subjects, mood, room } = profile
  
  // Create a base prompt from the selections
  let prompt = ""
  
  // Add subject matter
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
  
  // Add mood
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
  
  // Add style influence
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
  
  // Add palette influence
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