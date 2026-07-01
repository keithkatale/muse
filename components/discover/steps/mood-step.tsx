"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { MOOD_OPTIONS } from "@/lib/mock-data"
import type { MoodOption } from "@/lib/types"
import { selectionImage } from "@/lib/brand"
import { cn } from "@/lib/utils"

export function MoodStep({
  selected,
  onSelect,
}: {
  selected: MoodOption | null
  onSelect: (v: MoodOption) => void
}) {
  const selectedMood = selected
    ? MOOD_OPTIONS.find((m) => m.id === selected)
    : null

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center mb-6">
        <h2 className="font-heading text-2xl tracking-tight text-foreground md:text-3xl text-balance">
          What mood should your art evoke?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Pick one mood to set the tone
        </p>
        <div className="mt-4 flex justify-center">
          {!selected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muse-selected/40 border border-muse-peach/40 px-3.5 py-1 text-xs font-medium text-muse-brown animate-pulse">
              <span className="h-2 w-2 rounded-full bg-muse-peach animate-ping" />
              Select a mood below
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/60 border border-emerald-200 px-3.5 py-1 text-xs font-medium text-emerald-800">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              {selectedMood?.label} selected
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-3 grid-rows-2 gap-3 md:gap-4">
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = selected === mood.id
          return (
            <button
              key={mood.id}
              onClick={() => onSelect(mood.id)}
              aria-pressed={isSelected}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden rounded-lg",
                selected && !isSelected && "opacity-50 scale-[0.97]",
                selectionImage(isSelected)
              )}
            >
              <Image
                src={mood.image}
                alt={mood.label}
                fill
                sizes="(max-width: 768px) 28vw, 180px"
                className={cn(
                  "object-cover transition-transform duration-500",
                  isSelected ? "scale-100" : "group-hover:scale-105"
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 bg-foreground/40 transition-opacity duration-200",
                  isSelected && "bg-foreground/25"
                )}
              />
              <span className="absolute inset-0 flex items-center justify-center px-2 text-center font-serif text-xs md:text-sm font-medium text-background drop-shadow-md">
                {mood.label}
              </span>

              {isSelected && (
                <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-muse-peach shadow-md ring-2 ring-background/80">
                  <Check className="h-3.5 w-3.5 text-muse-brown" strokeWidth={3} />
                </div>
              )}

              {isSelected && (
                <div className="absolute inset-0 bg-muse-peach/20 ring-2 ring-inset ring-muse-peach/60" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
