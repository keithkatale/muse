"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useStyleProfile, useGeneration } from "@/lib/contexts"
import { STYLE_OPTIONS, SUBJECT_OPTIONS } from "@/lib/mock-data"
import type { StyleProfile, PaletteOption, StyleOption, SubjectOption, MoodOption, RoomOption, OrientationOption } from "@/lib/types"
import { EmailStep } from "./steps/email-step"
import { PaletteStep } from "./steps/palette-step"
import { StyleStep } from "./steps/style-step"
import { SubjectStep } from "./steps/subject-step"
import { MoodStep } from "./steps/mood-step"
import { RoomStep } from "./steps/room-step"
import { OrientationStep } from "./steps/orientation-step"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const TOTAL_STEPS = 7

export function StyleQuiz() {
  const router = useRouter()
  const { setProfile } = useStyleProfile()
  const { setCurrentImages, setSelectedImage, setPrompt, setEnhancedPrompt } = useGeneration()
  const [step, setStep] = useState(0)

  const [email, setEmail] = useState("")
  const [palettes, setPalettes] = useState<PaletteOption[]>([])
  const [styles, setStyles] = useState<StyleOption[]>([])
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [mood, setMood] = useState<MoodOption | null>(null)
  const [room, setRoom] = useState<RoomOption | null>(null)
  const [orientation, setOrientation] = useState<OrientationOption | null>(null)

  const mobileNavRef = useRef<HTMLDivElement>(null)
  const prevCanProceed = useRef(false)

  // Preload images for the next image-heavy step while the user is still on the prior step
  useEffect(() => {
    const preload = (src: string) => {
      const img = new Image()
      img.src = src
    }
    if (step === 1) {
      STYLE_OPTIONS.forEach(({ image }) => preload(image))
    } else if (step === 2) {
      SUBJECT_OPTIONS.forEach(({ image }) => preload(image))
    }
  }, [step])

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

  const ready = canProceed()

  // On mobile, scroll Continue into view when the user first becomes able to proceed
  useEffect(() => {
    if (ready && !prevCanProceed.current) {
      const isMobile = window.matchMedia("(max-width: 767px)").matches
      if (isMobile) {
        requestAnimationFrame(() => {
          mobileNavRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        })
      }
    }
    prevCanProceed.current = ready
  }, [ready, step, email, palettes, styles, subjects, mood, room, orientation])

  // Reset proceed-tracking when changing steps so the next selection can auto-scroll again
  useEffect(() => {
    prevCanProceed.current = false
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    } else {
      const profile: StyleProfile = {
        email,
        palettes,
        styles,
        subjects,
        mood,
        room,
        orientation,
      }
      setProfile(profile)

      setCurrentImages([])
      setSelectedImage(null)
      setPrompt("")
      setEnhancedPrompt("")

      try {
        await fetch("/api/store-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, profile }),
        })
      } catch (error) {
        console.error("Failed to store lead:", error)
      }

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
    "Orientation",
  ]

  const nextLabel = step === TOTAL_STEPS - 1 ? "Generate My Art" : "Continue"

  const backButton = (
    <button
      type="button"
      onClick={handleBack}
      disabled={step === 0}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
        "disabled:cursor-not-allowed disabled:opacity-30"
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </button>
  )

  const continueButton = (
    <Button onClick={handleNext} disabled={!ready} className="min-w-[8.5rem]">
      {nextLabel}
      {step < TOTAL_STEPS - 1 && <ChevronRight className="ml-1 h-4 w-4" />}
    </Button>
  )

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl flex-col px-6 py-8 md:py-12">
      {/* Progress + desktop nav (Back left / Continue right of step title) */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="hidden min-w-[7rem] md:block">{backButton}</div>

          <div className="flex min-w-0 flex-1 items-center justify-between md:justify-center md:gap-6">
            <p className="whitespace-nowrap text-sm text-muted-foreground">
              Step {step + 1} of {TOTAL_STEPS}
            </p>
            <p className="truncate text-sm font-medium text-foreground">{stepLabels[step]}</p>
          </div>

          <div className="hidden min-w-[7rem] justify-end md:flex">{continueButton}</div>
        </div>

        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted md:mb-10 md:mt-4">
          <motion.div
            className="h-full bg-muse-peach"
            initial={false}
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 pb-28 md:pb-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
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
                maxSelections={1}
              />
            )}
            {step === 2 && (
              <StyleStep
                selected={styles}
                onSelect={setStyles}
                maxSelections={1}
              />
            )}
            {step === 3 && (
              <SubjectStep
                selected={subjects}
                onSelect={setSubjects}
                maxSelections={1}
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

      {/* Mobile navigation — sticky bottom; auto-scrolls into view on select */}
      <div
        ref={mobileNavRef}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-6 py-4 backdrop-blur-sm md:hidden"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          {backButton}
          {continueButton}
        </div>
      </div>
    </div>
  )
}
