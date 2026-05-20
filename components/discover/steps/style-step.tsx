"use client"

import Image from "next/image"
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
    } else if (selected.length < maxSelections) {
      onSelect([...selected, id])
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl tracking-tight text-foreground md:text-3xl text-balance">
        What art styles do you gravitate toward?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick up to {maxSelections}
      </p>
      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {STYLE_OPTIONS.map((style) => (
          <button
            key={style.id}
            onClick={() => toggle(style.id)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg",
              selectionImage(selected.includes(style.id))
            )}
          >
            <Image
              src={style.image}
              alt={style.label}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <span className="absolute bottom-2 left-2 font-serif text-xs sm:text-sm text-background">
              {style.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
