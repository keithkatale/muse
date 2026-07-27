"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { ShoppingBag, Truck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGeneration, useCart, useStyleProfile } from "@/lib/contexts"
import {
  SIZES, MEDIUMS, FRAMES, MATS,
  calculatePrice, formatPrice, validateResolution,
} from "@/lib/mock-data"
import { getShopifyVariantId } from "@/lib/product-mapping"
import { configuratorSelectionCard } from "@/lib/brand"
import { cn } from "@/lib/utils"
import { ArtPreview } from "./art-preview"
import { GALLERY_ITEMS } from "@/lib/mock-data"

export function ProductConfigurator({ imageId }: { imageId: string }) {
  const router = useRouter()
  const { selectedImage, currentImages, generationHistory } = useGeneration()
  const { addItem } = useCart()
  const { profile } = useStyleProfile()

  // Find the image from generation context, history, or fall back to gallery
  const image = useMemo(() => {
    // 1. Search in current session's generated images matching the route imageId
    const generatedMatch = currentImages.find((img) => img.id === imageId)
    if (generatedMatch) return generatedMatch

    // 2. Search in pre-defined gallery items matching the route imageId
    const galleryMatch = GALLERY_ITEMS.find((g) => g.id === imageId)
    if (galleryMatch) {
      return {
        id: galleryMatch.id,
        url: galleryMatch.url,
        prompt: galleryMatch.prompt,
        width: 1024,
        height: 1024,
      }
    }

    // 3. Search in generation history
    if (generationHistory) {
      for (const batch of generationHistory) {
        const match = batch.images.find((img) => img.id === imageId)
        if (match) return match
      }
    }

    // 4. Fall back to selectedImage if its ID matches the route imageId
    if (selectedImage && selectedImage.id === imageId) {
      return selectedImage
    }

    // 5. If all else fails and selectedImage exists, use it as a last resort fallback
    return selectedImage || null
  }, [currentImages, imageId, selectedImage, generationHistory])

  const [size, setSize] = useState("16x20")
  const [medium, setMedium] = useState("paper")
  const [frame, setFrame] = useState<string | null>(null)
  const [mat, setMat] = useState("none")

  const totalPrice = useMemo(() => calculatePrice(size, medium, frame || "none", mat), [size, medium, frame, mat])
  const resolution = useMemo(
    () => image ? validateResolution(image.width, image.height, size) : null,
    [image, size]
  )

  const handleAddToCart = useCallback(() => {
    if (!image || frame === null) return
    
    // Get Shopify variant ID for this configuration
    const shopifyVariantId = getShopifyVariantId(size, medium, frame)
    
    addItem({
      variantId: shopifyVariantId,
      imageId: image.id,
      imageUrl: image.url,
      title: "Custom AI Art Print",
      size: SIZES.find((s) => s.id === size)?.label || size,
      medium: MEDIUMS.find((m) => m.id === medium)?.label || medium,
      frame: FRAMES.find((f) => f.id === frame)?.label || frame,
      mat: MATS.find((m) => m.id === mat)?.label || mat,
      price: totalPrice,
      quantity: 1,
    })
    toast.success("Added to cart", {
      description: "Your custom art print has been added.",
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    })
  }, [image, size, medium, frame, mat, totalPrice, addItem, router])

  if (!image) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
        <p className="font-heading text-2xl text-foreground">Image not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Generate an image first or browse the gallery
        </p>
        <Button onClick={() => router.push("/create")} className="mt-6">
          Go to Studio
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px)]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Configure Your Print
          </p>
          <h1 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl text-balance">
            Make it yours
          </h1>
        </motion.div>

        <div className="mt-6 md:mt-10 flex flex-col-reverse gap-6 md:gap-10 lg:flex-row lg:grid lg:grid-cols-[1fr_420px]">
          {/* Left: Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ArtPreview
              imageUrl={image.url}
              frame={frame}
              room={profile?.room || "bedroom"}
              size={size}
              mat={mat}
              imageRatio={image ? image.width / image.height : 3 / 4}
            />
          </motion.div>

          {/* Right: Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-6 md:gap-8"
          >
            {/* Size Selection */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">Size</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    className={cn(
                      "flex flex-col items-center rounded-lg py-2.5 sm:py-3 text-xs",
                      configuratorSelectionCard(size === s.id, "rounded-lg")
                    )}
                  >
                    <span className="font-medium">{s.label}</span>
                    <span className="mt-0.5 text-[10px]">{formatPrice(s.basePrice)}</span>
                  </button>
                ))}
              </div>
              {resolution && resolution.needsUpscale && (
                <p className="mt-2 text-[11px] text-muse-taupe">
                  This image will be AI-upscaled to ensure print quality at this size.
                </p>
              )}
            </div>

            {/* Medium Selection */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">Medium</p>
              <div className="flex flex-col gap-2">
                {MEDIUMS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMedium(m.id)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3 text-left",
                      configuratorSelectionCard(medium === m.id, "rounded-lg")
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.upcharge > 0 && (
                        <span className="text-xs text-muted-foreground">+{formatPrice(m.upcharge)}</span>
                      )}
                      {medium === m.id && (
                        <Check className="h-4 w-4 text-muse-brown" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Frame</p>
                {frame === null && (
                  <span className="text-[10px] font-medium text-rose-500 animate-pulse bg-rose-50 px-2 py-0.5 rounded-full">
                    Selection Required
                  </span>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {FRAMES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFrame(f.id)
                      if (f.id === "none") setMat("none")
                    }}
                    className={cn(
                      "flex shrink-0 flex-col items-center gap-2 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3",
                      configuratorSelectionCard(frame === f.id, "rounded-lg")
                    )}
                  >
                    <div
                      className="h-5 w-5 sm:h-6 sm:w-6 rounded-sm border border-[#E8DDD4]"
                      style={{ backgroundColor: f.color === "transparent" ? "transparent" : f.color }}
                    />
                    <span className="text-[10px] sm:text-[11px] text-foreground whitespace-nowrap">{f.label}</span>
                    {f.upcharge > 0 && (
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground">+{formatPrice(f.upcharge)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mat Selection (only if frame selected) */}
            {frame !== "none" && frame !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">Matting</p>
                <div className="flex gap-2">
                  {MATS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMat(m.id)}
                      className={cn(
                        "flex-1 rounded-lg py-2.5 text-xs",
                        configuratorSelectionCard(mat === m.id, "rounded-lg")
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Price Summary */}
            <div className="rounded-lg border border-[#E8DDD4] bg-muse-floral p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-heading text-3xl tracking-tight text-foreground">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {SIZES.find((s) => s.id === size)?.label} &middot;{" "}
                {MEDIUMS.find((m) => m.id === medium)?.label} &middot;{" "}
                {frame === null ? "No Frame Selected" : FRAMES.find((f) => f.id === frame)?.label}
                {frame !== null && frame !== "none" && mat !== "none" ? ` \u00b7 ${MATS.find((m) => m.id === mat)?.label}` : ""}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muse-taupe">
                <Truck className="h-3.5 w-3.5" />
                Free shipping
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              variant={frame === null ? "outline" : "default"}
              className={cn(
                "w-full transition-all duration-300",
                frame === null ? "border-rose-200 text-rose-500 hover:bg-rose-50/20" : ""
              )}
              disabled={frame === null}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {frame === null ? "Please Select a Frame Option" : `Add to Cart — ${formatPrice(totalPrice)}`}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
