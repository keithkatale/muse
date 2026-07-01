"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ImageIcon, Loader2, ArrowRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGeneration } from "@/lib/contexts"
import { selectionImage } from "@/lib/brand"
import { aspectRatioClass, cn } from "@/lib/utils"
import type { GeneratedImage } from "@/lib/types"
import { ImageLightbox } from "./image-lightbox"

function tileAspectRatio(img: GeneratedImage | null, fallback: string): string {
  if (img?.width && img?.height) return `${img.width} / ${img.height}`
  const map: Record<string, string> = {
    "3:4": "3 / 4",
    "4:3": "4 / 3",
    "1:1": "1 / 1",
    "16:9": "16 / 9",
  }
  return map[fallback] ?? "3 / 4"
}

export function ResultsPanel() {
  const router = useRouter()
  const {
    currentImages,
    selectedImage,
    setSelectedImage,
    isGenerating,
    aspectRatio,
  } = useGeneration()

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const skeletonAspect = aspectRatioClass(aspectRatio)

  if (currentImages.length === 0 && !isGenerating) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center text-center"
        >
          <ImageIcon className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-heading text-lg text-foreground">Your art will appear here</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe what you imagine, then generate
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full w-full items-center justify-center px-2 sm:px-3">
        <div className="flex h-[82%] max-h-[82%] items-center justify-center gap-1.5 sm:gap-2">
          <AnimatePresence mode="wait">
            {isGenerating
              ? Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: i * 0.06, duration: 0.2 }}
                    style={{ aspectRatio: tileAspectRatio(null, aspectRatio) }}
                    className={cn(
                      skeletonAspect,
                      "relative flex h-full w-auto shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-border/40 bg-muted/40"
                    )}
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </motion.div>
                ))
              : currentImages.map((img, i) => {
                  const isSelected = selectedImage?.id === img.id
                  return (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      style={{ aspectRatio: tileAspectRatio(img, aspectRatio) }}
                      className={cn(
                        "group relative h-full w-auto shrink-0 overflow-hidden rounded-md",
                        selectionImage(isSelected)
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedImage(isSelected ? null : img)}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={img.url}
                          alt={`Generated variant ${i + 1}`}
                          fill
                          sizes="25vw"
                          className="object-contain"
                          unoptimized
                        />
                      </button>

                      <button
                        type="button"
                        aria-label="Zoom in"
                        onClick={(e) => {
                          e.stopPropagation()
                          setLightboxIndex(i)
                        }}
                        className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/45 text-white opacity-80 shadow-md backdrop-blur-sm transition-opacity hover:bg-black/60 hover:opacity-100 sm:right-2 sm:top-2 sm:size-8"
                      >
                        <ZoomIn className="size-3.5 sm:size-4" />
                      </button>

                      {isSelected && (
                        <>
                          <div className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-muse-peach/40" />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-x-0 bottom-0 flex justify-center pb-3 sm:pb-4"
                          >
                            <Button
                              size="sm"
                              className="rounded-full bg-muse-peach px-5 text-muse-brown shadow-lg hover:bg-muse-selected"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/configure/${img.id}`)
                              }}
                            >
                              Continue
                              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  )
                })}
          </AnimatePresence>
        </div>
      </div>

      {lightboxIndex !== null && currentImages.length > 0 && (
        <ImageLightbox
          images={currentImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  )
}
