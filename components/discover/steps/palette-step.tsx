"use client"

import { motion } from "framer-motion"
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
    } else if (maxSelections === 1) {
      onSelect([id])
    } else if (selected.length < maxSelections) {
      onSelect([...selected, id])
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-4">
          Which color palettes speak to you?
        </h2>
        <p className="text-muted-foreground text-lg">
          {maxSelections === 1
            ? "Pick a palette to personalize your art creation"
            : `Pick up to ${maxSelections} palettes to personalize your art creation`}
        </p>
        <div className="mt-4 flex justify-center">
          {selected.length === 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muse-selected/40 border border-muse-peach/40 px-3.5 py-1 text-xs font-medium text-muse-brown animate-pulse">
              <span className="h-2 w-2 rounded-full bg-muse-peach animate-ping" />
              Please select at least one option below
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/60 border border-emerald-200 px-3.5 py-1 text-xs font-medium text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {selected.length === 1 ? "1 palette selected" : `${selected.length} palettes selected`}
            </span>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PALETTE_OPTIONS.map((palette, index) => {
          const isSelected = selected.includes(palette.id)
          return (
            <motion.button
              key={palette.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => toggle(palette.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-8 text-left hover:shadow-lg transition-all duration-300 min-h-[160px] flex flex-col justify-between",
                selected.length > 0 && !isSelected && "opacity-60 scale-95",
                selectionCard(isSelected, "rounded-2xl")
              )}
            >
              {/* Palette Label */}
              <div className="space-y-1 pr-16">
                <span className={`text-lg font-heading block transition-colors duration-300 ${
                  isSelected ? "text-muse-brown font-semibold" : "text-foreground group-hover:text-muse-taupe"
                }`}>
                  {palette.label}
                </span>
                <span className="text-xs text-muted-foreground block">
                  Click to {isSelected ? "deselect" : "select"}
                </span>
              </div>

              {/* Color Bars Container */}
              <div className="mt-6 flex h-8 w-full gap-1.5 overflow-hidden rounded-lg">
                {palette.colors.map((color) => (
                  <div
                    key={color}
                    className="flex-1 transition-transform duration-300 group-hover:scale-y-110"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Selection Status Badge */}
              {selected.length === 0 ? (
                <div className="absolute top-4 right-4 rounded-full border border-dashed border-muse-taupe/60 bg-transparent px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-muse-taupe flex items-center gap-1.5 transition-all duration-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-muse-taupe animate-pulse" />
                  Unselected
                </div>
              ) : isSelected ? (
                <div className="absolute top-4 right-4 rounded-full bg-muse-peach px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-[#564738] flex items-center gap-1 shadow-sm">
                  <svg className="h-3 w-3 text-[#564738]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Selected
                </div>
              ) : null}

              {/* Hover Overlay */}
              <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                isSelected ? "bg-muse-selected/30" : "bg-transparent group-hover:bg-muse-selected/10"
              }`} />
            </motion.button>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        Your selections will directly guide the colors and shading of your artwork.
      </motion.div>
    </div>
  )
}

