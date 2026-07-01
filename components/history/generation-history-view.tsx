"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Clock, ImageIcon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGeneration } from "@/lib/contexts"
import { ASPECT_RATIOS } from "@/lib/mock-data"
import { aspectRatioClass, cn } from "@/lib/utils"

function formatDate(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ts))
}

export function GenerationHistoryView() {
  const router = useRouter()
  const { generationHistory, setCurrentImages, setSelectedImage } = useGeneration()

  if (generationHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-20 text-center">
        <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h2 className="font-heading text-xl text-foreground">No generations yet</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Art you create will appear here so you can revisit and order prints later.
        </p>
        <Button asChild className="mt-6">
          <Link href="/create">Start Creating</Link>
        </Button>
      </div>
    )
  }

  const batches = [...generationHistory].reverse()

  return (
    <div className="space-y-8">
      {batches.map((batch, index) => (
        <motion.section
          key={batch.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="rounded-xl border border-border/60 bg-white/60 p-4 sm:p-5"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDate(batch.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muse-taupe">
              <span>{ASPECT_RATIOS[batch.aspectRatio]?.label ?? batch.aspectRatio}</span>
              <span>·</span>
              <span className="capitalize">{batch.quality}</span>
            </div>
          </div>

          <div
            className="flex items-center justify-center gap-2 sm:gap-3"
            style={{ height: "min(36vh, 220px)" }}
          >
            {batch.images.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => router.push(`/configure/${img.id}`)}
                className={cn(
                  aspectRatioClass(batch.aspectRatio),
                  "group relative h-full w-auto shrink-0 overflow-hidden rounded-lg border border-transparent transition-all hover:border-muse-peach/60 hover:shadow-md"
                )}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  unoptimized
                />
              </button>
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setCurrentImages(batch.images)
                setSelectedImage(null)
                router.push("/create")
              }}
            >
              Open in Create
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.section>
      ))}
    </div>
  )
}
