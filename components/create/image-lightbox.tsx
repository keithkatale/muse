"use client"

import { useCallback, useEffect, type MouseEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GeneratedImage } from "@/lib/types"

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
  const router = useRouter()
  const image = images[index]

  const handleContinue = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      if (!image) return
      router.push(`/configure/${image.id}`)
    },
    [image, router]
  )

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
        data-lightbox
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
          className="relative mx-4 flex max-h-[90vh] max-w-[95vw] flex-col items-center justify-center gap-4 sm:mx-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative w-auto max-w-full"
            style={{
              aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : "3 / 4",
            }}
          >
            <Image
              src={image.url}
              alt={`Variant ${index + 1}`}
              width={image.width || 1024}
              height={image.height || 1024}
              className="h-auto max-h-[68vh] w-auto max-w-full rounded-lg object-contain shadow-2xl sm:max-h-[72vh]"
              unoptimized
            />
          </div>

          <Button
            type="button"
            size="lg"
            onClick={handleContinue}
            className="h-11 w-[min(100%,20rem)] rounded-full bg-muse-peach px-8 font-semibold text-muse-brown shadow-lg hover:bg-muse-selected"
          >
            Continue
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>

          {images.length > 1 && (
            <p className="text-sm text-white/70">
              {index + 1} / {images.length}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
