"use client"

import { useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { GeneratedImage } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: GeneratedImage[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
}) {
  const image = images[index]

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length)
  }, [index, images.length, onIndexChange])

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length)
  }, [index, images.length, onIndexChange])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, goPrev, goNext])

  if (!image) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}

        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative mx-4 flex max-h-[85vh] max-w-[95vw] items-center justify-center sm:mx-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative max-h-[85vh] w-auto max-w-full"
            style={{
              aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : "3 / 4",
            }}
          >
            <Image
              src={image.url}
              alt={`Variant ${index + 1}`}
              width={image.width || 1024}
              height={image.height || 1024}
              className="h-auto max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              unoptimized
            />
          </div>
        </motion.div>

        {images.length > 1 && (
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {index + 1} / {images.length}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
