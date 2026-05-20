"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GALLERY_ITEMS } from "@/lib/mock-data"
import { useGeneration } from "@/lib/contexts"
import { cn } from "@/lib/utils"
import type { StyleOption, SubjectOption } from "@/lib/types"

const STYLE_FILTERS: { id: StyleOption | "all"; label: string }[] = [
  { id: "all", label: "All Styles" },
  { id: "abstract", label: "Abstract" },
  { id: "realistic", label: "Realistic" },
  { id: "illustrated", label: "Illustrated" },
  { id: "surreal", label: "Surreal" },
  { id: "minimal", label: "Minimal" },
]

const SUBJECT_FILTERS: { id: SubjectOption | "all"; label: string }[] = [
  { id: "all", label: "All Subjects" },
  { id: "landscapes", label: "Landscapes" },
  { id: "florals", label: "Florals" },
  { id: "geometric", label: "Geometric" },
  { id: "space", label: "Space" },
  { id: "still-life", label: "Still Life" },
]

export function GalleryGrid() {
  const router = useRouter()
  const { setPrompt } = useGeneration()
  const [styleFilter, setStyleFilter] = useState<StyleOption | "all">("all")
  const [subjectFilter, setSubjectFilter] = useState<SubjectOption | "all">("all")

  const filtered = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      if (styleFilter !== "all" && item.style !== styleFilter) return false
      if (subjectFilter !== "all" && item.subject !== subjectFilter) return false
      return true
    })
  }, [styleFilter, subjectFilter])

  const handleCreateSimilar = (prompt: string) => {
    setPrompt(prompt)
    router.push("/create")
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
            Inspiration
          </p>
          <h1 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl text-balance">
            Browse the gallery
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Explore AI-generated art for inspiration. Tap any piece to create something similar with your own twist.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-6"
        >
          <div className="flex flex-wrap gap-1.5">
            {STYLE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setStyleFilter(f.id)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 text-xs transition-all",
                  styleFilter === f.id
                    ? "border-accent bg-accent/10 text-foreground font-medium"
                    : "bg-card text-muted-foreground hover:border-accent/30"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUBJECT_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSubjectFilter(f.id)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 text-xs transition-all",
                  subjectFilter === f.id
                    ? "border-accent bg-accent/10 text-foreground font-medium"
                    : "bg-card text-muted-foreground hover:border-accent/30"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-muted cursor-pointer"
              onClick={() => handleCreateSimilar(item.prompt)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCreateSimilar(item.prompt)
              }}
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-serif text-lg text-background">{item.title}</p>
                <p className="mt-1 text-xs text-background/70 capitalize">
                  {item.style} &middot; {item.subject}
                </p>
                <p className="mt-2 text-xs text-background/80">
                  Tap to create similar
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <p className="font-heading text-xl text-foreground">No matching artwork</p>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
