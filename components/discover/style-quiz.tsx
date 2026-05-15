"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useStyleProfile } from "@/lib/contexts"
import type { StyleProfile, PaletteOption, StyleOption, SubjectOption, MoodOption, RoomOption, OrientationOption } from "@/lib/types"
import { EmailStep } from "./steps/email-step"
import { PaletteStep } from "./steps/palette-step"
import { StyleStep } from "./steps/style-step"
import { SubjectStep } from "./steps/subject-step"
import { MoodStep } from "./steps/mood-step"
import { RoomStep } from "./steps/room-step"
import { OrientationStep } from "./steps/orientation-step"

const TOTAL_STEPS = 7

export function StyleQuiz() {
  const router = useRouter()
  const { setProfile } = useStyleProfile()
  const [step, setStep] = useState(0)

  const [email, setEmail] = useState("")
  const [palettes, setPalettes] = useState<PaletteOption[]>([])
  const [styles, setStyles] = useState<StyleOption[]>([])
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [mood, setMood] = useState<MoodOption | null>(null)
  const [room, setRoom] = useState<RoomOption | null>(null)
  const [orientation, setOrientation] = useState<OrientationOption | null>(null)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const canProceed = () => {
    switch (step) {
      case 0: return email.length > 0 && validateEmail(email)
      case 1: return palettes.length >= 1
      case 2: return styles.length >= 1
      case 3: return subjects.length >= 1
      case 4: return mood !== null
      case 5: return room !== null
      case 6: return orientation !== null
      default: return false
    }
  }

  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    } else {
      // Create the complete profile and go directly to generation
      const profile: StyleProfile = { 
        email, 
        palettes, 
        styles, 
        subjects, 
        mood, 
        room, 
        orientation 
      }
      setProfile(profile)
      
      // Store lead information
      try {
        await fetch("/api/store-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, profile })
        })
      } catch (error) {
        console.error("Failed to store lead:", error)
        // Continue anyway - don't block the user experience
      }
      
      // Go directly to create page which will auto-generate based on profile
      router.push("/create")
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const stepLabels = [
    "Email", 
    "Color Palette", 
    "Art Style", 
    "Subject Matter", 
    "Mood", 
    "Room", 
    "Orientation"
  ]

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl flex-col px-6 py-12">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Step {step + 1} of {TOTAL_STEPS}
        </p>
        <p className="text-sm font-medium text-foreground">{stepLabels[step]}</p>
      </div>
      <div className="mb-10 h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-foreground"
          initial={false}
          animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Step Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <EmailStep
                email={email}
                onEmailChange={setEmail}
              />
            )}
            {step === 1 && (
              <PaletteStep
                selected={palettes}
                onSelect={setPalettes}
                maxSelections={2}
              />
            )}
            {step === 2 && (
              <StyleStep
                selected={styles}
                onSelect={setStyles}
                maxSelections={2}
              />
            )}
            {step === 3 && (
              <SubjectStep
                selected={subjects}
                onSelect={setSubjects}
                maxSelections={3}
              />
            )}
            {step === 4 && (
              <MoodStep selected={mood} onSelect={setMood} />
            )}
            {step === 5 && (
              <RoomStep selected={room} onSelect={setRoom} />
            )}
            {step === 6 && (
              <OrientationStep selected={orientation} onSelect={setOrientation} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {step === TOTAL_STEPS - 1 ? "Generate My Art" : "Continue"}
        </button>
      </div>
    </div>
  )
}
