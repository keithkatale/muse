"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { ROOM_OPTIONS } from "@/lib/mock-data"
import type { RoomOption } from "@/lib/types"
import { selectionImage } from "@/lib/brand"
import { cn } from "@/lib/utils"

export function RoomStep({
  selected,
  onSelect,
}: {
  selected: RoomOption | null
  onSelect: (v: RoomOption) => void
}) {
  const selectedRoom = selected
    ? ROOM_OPTIONS.find((r) => r.id === selected)
    : null

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center mb-6">
        <h2 className="font-heading text-2xl tracking-tight text-foreground md:text-3xl text-balance">
          Where will this art live?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Pick the room where you envision your art
        </p>
        <div className="mt-4 flex justify-center">
          {!selected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muse-selected/40 border border-muse-peach/40 px-3.5 py-1 text-xs font-medium text-muse-brown animate-pulse">
              <span className="h-2 w-2 rounded-full bg-muse-peach animate-ping" />
              Select a room below
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/60 border border-emerald-200 px-3.5 py-1 text-xs font-medium text-emerald-800">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              {selectedRoom?.label} selected
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-3 grid-rows-2 gap-3 md:gap-4">
        {ROOM_OPTIONS.map((room) => {
          const isSelected = selected === room.id
          return (
            <button
              key={room.id}
              onClick={() => onSelect(room.id)}
              aria-pressed={isSelected}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden rounded-lg",
                selected && !isSelected && "opacity-50 scale-[0.97]",
                selectionImage(isSelected)
              )}
            >
              <Image
                src={room.image}
                alt={room.label}
                fill
                sizes="(max-width: 768px) 28vw, 180px"
                className={cn(
                  "object-cover transition-all duration-1000",
                  isSelected ? "scale-100 brightness-100" : "brightness-[0.82] group-hover:brightness-90 group-hover:scale-105"
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-foreground/10 transition-opacity duration-1000",
                  isSelected && "from-foreground/50 via-muse-peach/10 to-transparent"
                )}
              />
              <span className="absolute bottom-2 left-2 right-2 font-serif text-xs md:text-sm font-medium text-background drop-shadow-md">
                {room.label}
              </span>

              {isSelected && (
                <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-muse-peach shadow-md ring-2 ring-background/80">
                  <Check className="h-3.5 w-3.5 text-muse-brown" strokeWidth={3} />
                </div>
              )}

              {isSelected && (
                <div className="absolute inset-0 bg-muse-peach/20 ring-2 ring-inset ring-muse-peach/60" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
