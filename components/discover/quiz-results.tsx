"use client"

import { motion } from "framer-motion"
import { ArrowRight, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PALETTE_OPTIONS } from "@/lib/mock-data"
import type { StyleProfile } from "@/lib/types"

export function QuizResults({
  profile,
  onCreateArt,
  onBrowseGallery,
}: {
  profile: StyleProfile
  onCreateArt: () => void
  onBrowseGallery: () => void
}) {
  const paletteColors = profile.palettes.flatMap(
    (p) => PALETTE_OPTIONS.find((opt) => opt.id === p)?.colors || []
  )

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <Palette className="h-7 w-7 text-foreground" />
        </div>

        <h1 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl text-balance">
          Your style profile is ready
        </h1>

        {/* Palette Strip */}
        {paletteColors.length > 0 && (
          <div className="mt-8 flex h-8 w-64 overflow-hidden rounded-full">
            {paletteColors.map((color, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: color }} />
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {profile.styles.map((s) => (
            <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs capitalize text-foreground">
              {s}
            </span>
          ))}
          {profile.subjects.map((s) => (
            <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs capitalize text-foreground">
              {s}
            </span>
          ))}
          {profile.mood && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize text-foreground">
              {profile.mood}
            </span>
          )}
          {profile.room && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize text-foreground">
              {profile.room.replace("-", " ")}
            </span>
          )}
        </div>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          We&#39;ll use these preferences to suggest personalized starting concepts and optimize your
          AI art generation for prints you&#39;ll love.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button onClick={onCreateArt} size="lg">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={onBrowseGallery} variant="outline" size="lg">
            Browse Gallery
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
