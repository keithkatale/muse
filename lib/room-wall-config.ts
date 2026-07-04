import type { RoomOption } from "@/lib/types"

/**
 * Wall zones and art placement for room preview simulation.
 * Coordinates are percentages of the source room photo (top-left origin).
 *
 * `wall` — detected blank wall bounds (where art can hang).
 * `placement` — default portrait art frame centered on the wall at eye level.
 */
export interface RoomWallConfig {
  id: RoomOption
  label: string
  image: string
  /** Source image aspect ratio (width / height). */
  aspectRatio: number
  wall: {
    left: number
    top: number
    right: number
    bottom: number
  }
  placement: {
    left: number
    top: number
    width: number
    height: number
  }
}

export const ROOM_WALL_CONFIGS: Record<RoomOption, RoomWallConfig> = {
  bedroom: {
    id: "bedroom",
    label: "Bedroom",
    image: "/images/rooms/bedroom.jpg",
    aspectRatio: 1,
    // Wall above headboard, right of pendant lights (y: 10–58%, x: 24–95%)
    wall: { left: 24, top: 10, right: 95, bottom: 58 },
    placement: { left: 38, top: 11, width: 24, height: 30 },
  },
  "sitting-room": {
    id: "sitting-room",
    label: "Sitting Room",
    image: "/images/rooms/living-room.jpg",
    aspectRatio: 1,
    // Existing empty frame on wall (inner matte area)
    wall: { left: 27, top: 30, right: 74, bottom: 55 },
    placement: { left: 27.5, top: 30.5, width: 46, height: 24.5 },
  },
  studio: {
    id: "studio",
    label: "Studio",
    image: "/images/rooms/wall-3.jpg",
    aspectRatio: 11 / 6,
    // Open wall left of armchair (x: 5–55%, y: 10–72%)
    wall: { left: 5, top: 10, right: 55, bottom: 72 },
    placement: { left: 10, top: 14, width: 28, height: 35 },
  },
  dining: {
    id: "dining",
    label: "Dining",
    image: "/images/rooms/dining.jpg",
    aspectRatio: 1,
    // Blank wall section right of table (x: 32–84%, y: 15–72%)
    wall: { left: 32, top: 15, right: 84, bottom: 72 },
    placement: { left: 45, top: 20, width: 26, height: 32 },
  },
  office: {
    id: "office",
    label: "Office",
    image: "/images/rooms/office.jpg",
    aspectRatio: 1,
    // Wall between window and bookshelf, above desk (x: 14–90%, y: 5–62%)
    wall: { left: 14, top: 5, right: 90, bottom: 62 },
    placement: { left: 38, top: 10, width: 24, height: 30 },
  },
}

export const ROOM_WALL_OPTIONS = Object.values(ROOM_WALL_CONFIGS)

export function getRoomWallConfig(room: string): RoomWallConfig {
  return ROOM_WALL_CONFIGS[room as RoomOption] ?? ROOM_WALL_CONFIGS.bedroom
}

export function roomAspectClass(room: string): string {
  const config = getRoomWallConfig(room)
  if (config.aspectRatio > 1.5) return "aspect-[11/6]"
  return "aspect-square"
}
