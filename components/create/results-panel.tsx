"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ImageIcon, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGeneration } from "@/lib/contexts"
import { selectionImage } from "@/lib/brand"
import { cn } from "@/lib/utils"
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

function ContinueOnImage({
  imageId,
  compact,
}: {
  imageId: string
  compact?: boolean
}) {
  const router = useRouter()

  return (
    <>
      <div className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-muse-peach/40" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex justify-center",
          compact ? "pb-1.5" : "pb-4"
        )}
      >
        <Button
          size="sm"
          className={cn(
            "rounded-full bg-muse-peach text-muse-brown shadow-lg hover:bg-muse-selected",
            compact
              ? "h-8 w-[90%] max-w-none px-2 text-xs font-semibold"
              : "px-5"
          )}
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/configure/${imageId}`)
          }}
        >
          Continue
          {!compact && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
        </Button>
      </motion.div>
    </>
  )
}

export function ResultsPanel() {
  const {
    currentImages,
    selectedImage,
    setSelectedImage,
    isGenerating,
    aspectRatio,
  } = useGeneration()

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

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
      <div className="flex h-full w-full flex-col items-center justify-center px-2 sm:px-3">
        {/* Mobile / narrow: adaptive 2×2 grid — tap selects + zooms */}
        <div className="flex h-full w-full items-center justify-center lg:hidden">
          <div
            className={cn(
              "grid w-full max-w-lg grid-cols-2 gap-2",
              "max-h-[min(72vh,100%)]"
            )}
            style={{
              aspectRatio:
                aspectRatio === "16:9" || aspectRatio === "4:3"
                  ? "4 / 3"
                  : aspectRatio === "1:1"
                    ? "1 / 1"
                    : "3 / 4",
              maxWidth: "min(100%, 28rem)",
            }}
          >
            <AnimatePresence mode="wait">
              {isGenerating
                ? Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={`skeleton-mobile-${i}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                      className="relative flex min-h-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-muse-taupe/30 bg-muse-floral/30"
                    >
                      <Loader2 className="h-5 w-5 animate-spin text-muse-taupe/50" />
                    </motion.div>
                  ))
                : currentImages.map((img, i) => {
                    const isSelected = selectedImage?.id === img.id
                    return (
                      <motion.div
                        key={`mobile-${img.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={cn(
                          "group relative min-h-0 overflow-hidden rounded-lg border border-muse-taupe/10 transition-all",
                          isSelected ? "ring-2 ring-muse-peach" : "hover:border-muse-peach/40"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(img)
                            setLightboxIndex(i)
                          }}
                          className="relative h-full w-full"
                        >
                          <Image
                            src={img.url}
                            alt={`Generated variant ${i + 1}`}
                            fill
                            sizes="(max-width: 1024px) 45vw, 25vw"
                            className="object-cover"
                            unoptimized
                          />
                        </button>

                        {isSelected && <ContinueOnImage imageId={img.id} compact />}
                      </motion.div>
                    )
                  })}
            </AnimatePresence>
          </div>
        </div>

        {/* Large desktop: horizontal row with sideways scroll when needed */}
        <div className="hidden h-full max-h-[85%] w-full items-center lg:flex">
          <div className="mx-auto flex h-full max-w-full items-center gap-2 overflow-x-auto overflow-y-hidden px-2 py-1 [scrollbar-width:thin]">
            <AnimatePresence mode="wait">
              {isGenerating
                ? Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={`skeleton-desktop-${i}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                      style={{ aspectRatio: tileAspectRatio(null, aspectRatio) }}
                      className="relative flex h-full w-auto shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-border/40 bg-muted/40"
                    >
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </motion.div>
                  ))
                : currentImages.map((img, i) => {
                    const isSelected = selectedImage?.id === img.id
                    return (
                      <motion.div
                        key={`desktop-${img.id}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        style={{ aspectRatio: tileAspectRatio(img, aspectRatio) }}
                        className={cn(
                          "group relative h-full w-auto max-h-full shrink-0 overflow-hidden rounded-md",
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

                        {isSelected && <ContinueOnImage imageId={img.id} />}
                      </motion.div>
                    )
                  })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && currentImages.length > 0 && (
        <ImageLightbox
          images={currentImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={(idx) => {
            setLightboxIndex(idx)
            const next = currentImages[idx]
            if (next) setSelectedImage(next)
          }}
        />
      )}
    </>
  )
}
