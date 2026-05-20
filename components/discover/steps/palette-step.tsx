"use client"

import { PALETTE_OPTIONS } from "@/lib/mock-data"
import type { PaletteOption } from "@/lib/types"
import { selectionCard } from "@/lib/brand"
import { cn } from "@/lib/utils"

export function PaletteStep({
  selected,
  onSelect,
  maxSelections,
}: {
  selected: PaletteOption[]
  onSelect: (v: PaletteOption[]) => void
  maxSelections: number
}) {
  const toggle = (id: PaletteOption) => {
    if (selected.includes(id)) {
      onSelect(selected.filter((s) => s !== id))
    } else if (selected.length < maxSelections) {
      onSelect([...selected, id])
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl tracking-tight text-foreground md:text-3xl text-balance">
        Which color palettes speak to you?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick up to {maxSelections}
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PALETTE_OPTIONS.map((palette) => (
          <button
            key={palette.id}
            onClick={() => toggle(palette.id)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl p-5",
              selectionCard(selected.includes(palette.id))
            )}
          >
            <div className="flex h-10 w-full gap-1 overflow-hidden rounded-lg">
              {palette.colors.map((color) => (
                <div
                  key={color}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">{palette.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
