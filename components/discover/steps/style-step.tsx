"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { STYLE_OPTIONS } from "@/lib/mock-data"
import type { StyleOption } from "@/lib/types"
import { selectionImage } from "@/lib/brand"
import { cn } from "@/lib/utils"

export function StyleStep({
  selected,
  onSelect,
  maxSelections,
}: {
  selected: StyleOption[]
  onSelect: (v: StyleOption[]) => void
  maxSelections: number
}) {
  const toggle = (id: StyleOption) => {
    if (selected.includes(id)) {
      onSelect(selected.filter((s) => s !== id))
    } else if (maxSelections === 1) {
      onSelect([id])
    } else if (selected.length < maxSelections) {
      onSelect([...selected, id])
    }
  }

  const selectedStyle = selected[0]
    ? STYLE_OPTIONS.find((s) => s.id === selected[0])
    : null

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center mb-6">
        <h2 className="font-heading text-2xl tracking-tight text-foreground md:text-3xl text-balance">
          What art style do you gravitate toward?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Pick one style to guide your artwork
        </p>
        <div className="mt-4 flex justify-center">
          {selected.length === 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muse-selected/40 border border-muse-peach/40 px-3.5 py-1 text-xs font-medium text-muse-brown animate-pulse">
              <span className="h-2 w-2 rounded-full bg-muse-peach animate-ping" />
              Select a style below
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/60 border border-emerald-200 px-3.5 py-1 text-xs font-medium text-emerald-800">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              {selectedStyle?.label} selected
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-3 grid-rows-2 gap-3 md:gap-4">
        {STYLE_OPTIONS.map((style) => {
          const isSelected = selected.includes(style.id)
          return (
            <button
              key={style.id}
              onClick={() => toggle(style.id)}
              aria-pressed={isSelected}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-lg",
                selected.length > 0 && !isSelected && "opacity-50 scale-[0.97]",
                selectionImage(isSelected)
              )}
            >
              <Image
                src={style.image}
                alt={style.label}
                fill
                sizes="(max-width: 768px) 28vw, 180px"
                className={cn(
                  "object-cover transition-transform duration-500",
                  isSelected ? "scale-100" : "group-hover:scale-105"
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-opacity duration-200",
                  isSelected && "from-foreground/50 via-muse-peach/10"
                )}
              />
              <span className="absolute bottom-2 left-2 right-2 font-serif text-xs md:text-sm font-medium text-background drop-shadow-md">
                {style.label}
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
