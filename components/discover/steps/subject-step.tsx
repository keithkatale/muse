"use client"

import Image from "next/image"
import { SUBJECT_OPTIONS } from "@/lib/mock-data"
import type { SubjectOption } from "@/lib/types"
import { cn } from "@/lib/utils"

export function SubjectStep({
  selected,
  onSelect,
  maxSelections,
}: {
  selected: SubjectOption[]
  onSelect: (v: SubjectOption[]) => void
  maxSelections: number
}) {
  const toggle = (id: SubjectOption) => {
    if (selected.includes(id)) {
      onSelect(selected.filter((s) => s !== id))
    } else if (selected.length < maxSelections) {
      onSelect([...selected, id])
    }
  }

  return (
    <div>
      <h2 className="font-serif text-2xl tracking-tight text-foreground md:text-3xl text-balance">
        What subjects interest you most?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick up to {maxSelections}
      </p>
      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
        {SUBJECT_OPTIONS.map((subject) => (
          <button
            key={subject.id}
            onClick={() => toggle(subject.id)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
              selected.includes(subject.id)
                ? "border-accent ring-2 ring-accent/20"
                : "border-border hover:border-accent/30"
            )}
          >
            <Image
              src={subject.image}
              alt={subject.label}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <span className="absolute bottom-2 left-2 font-serif text-xs sm:text-sm text-background">
              {subject.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
