"use client"

import Image from "next/image"
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
  return (
    <div>
      <h2 className="font-heading text-2xl tracking-tight text-foreground md:text-3xl text-balance">
        Where will this art live?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick the room where you envision your art
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ROOM_OPTIONS.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelect(room.id)}
            className={cn(
              "group relative aspect-[4/3] overflow-hidden rounded-xl",
              selectionImage(selected === room.id)
            )}
          >
            <Image
              src={room.image}
              alt={room.label}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <span className="absolute bottom-4 left-4 font-serif text-lg text-background">
              {room.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
