"use client"

import { motion } from "framer-motion"
import { Monitor, Smartphone } from "lucide-react"
import { selectionCard } from "@/lib/brand"
import { cn } from "@/lib/utils"

export type OrientationOption = "portrait" | "landscape"

interface OrientationStepProps {
  selected: OrientationOption | null
  onSelect: (orientation: OrientationOption) => void
}

const orientations = [
  {
    id: "portrait" as OrientationOption,
    label: "Portrait",
    description: "Vertical orientation, perfect for most wall spaces",
    icon: Smartphone,
    aspectRatio: "3/4",
    dimensions: "Taller than wide"
  },
  {
    id: "landscape" as OrientationOption,
    label: "Landscape", 
    description: "Horizontal orientation, great for wide wall spaces",
    icon: Monitor,
    aspectRatio: "4/3",
    dimensions: "Wider than tall"
  }
]

export function OrientationStep({ selected, onSelect }: OrientationStepProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-4">
          Choose Your Orientation
        </h2>
        <p className="text-muted-foreground text-lg">
          Select the orientation that best fits your wall space and vision
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {orientations.map((orientation, index) => {
          const Icon = orientation.icon
          const isSelected = selected === orientation.id
          
          return (
            <motion.button
              key={orientation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onSelect(orientation.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-8 text-left hover:shadow-lg",
                selectionCard(isSelected, "rounded-2xl")
              )}
            >
              {/* Visual Preview */}
              <div className="mb-6 flex justify-center">
                <div className={`relative rounded-lg border-2 bg-muted/30 ${
                  orientation.id === "portrait" ? "h-32 w-24" : "h-24 w-32"
                } ${isSelected ? "border-muse-peach" : "border-border"}`}>
                  <div className="absolute inset-2 rounded bg-gradient-to-br from-muse-peach/30 to-muse-selected/50" />
                  <Icon className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                    isSelected ? "text-muse-brown" : "text-muted-foreground"
                  }`} size={20} />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className={`font-heading text-2xl transition-colors ${
                  isSelected ? "text-muse-brown" : "text-foreground group-hover:text-muse-taupe"
                }`}>
                  {orientation.label}
                </h3>
                
                <p className="text-muted-foreground">
                  {orientation.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aspect Ratio:</span>
                    <span className="font-medium">{orientation.aspectRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="font-medium">{orientation.dimensions}</span>
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="orientation-selection"
                  className="absolute top-4 right-4 h-6 w-6 rounded-full bg-muse-peach"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                </motion.div>
              )}

              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-2xl transition-opacity ${
                isSelected ? "bg-muse-selected/30" : "bg-transparent group-hover:bg-muse-selected/20"
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
        Don't worry, you can always adjust the orientation later during configuration
      </motion.div>
    </div>
  )
}