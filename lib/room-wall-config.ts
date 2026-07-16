import type { RoomOption } from "@/lib/types"

/**
 * Wall zones and art placement for room preview simulation.
 * Coordinates are percentages of the *displayed* room photo (top-left origin),
 * matching `object-cover` in a container with the same `aspectRatio`.
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
  /**
   * When true, art fills a fixed frame/matte in the photo.
   * Size scaling is disabled so the overlay stays inside that opening.
   */
  fillsExistingFrame?: boolean
}

export const ROOM_WALL_CONFIGS: Record<RoomOption, RoomWallConfig> = {
  bedroom: {
    id: "bedroom",
    label: "Bedroom",
    image: "/images/rooms/bedroom.jpg",
    aspectRatio: 1,
    wall: { left: 24, top: 10, right: 95, bottom: 58 },
    placement: { left: 38, top: 11, width: 24, height: 30 },
  },
  "sitting-room": {
    id: "sitting-room",
    label: "Sitting Room",
    image: "/images/rooms/living-room.jpg",
    aspectRatio: 1,
    // Inner white matte of the empty frame above the sofa
    wall: { left: 27.9, top: 30.9, right: 75.4, bottom: 56.5 },
    placement: { left: 29.2, top: 32.3, width: 44.9, height: 22.8 },
    fillsExistingFrame: true,
  },
  studio: {
    id: "studio",
    label: "Studio",
    image: "/images/rooms/wall-3.jpg",
    // 5500×3000 — must match container aspect or object-cover crops art off-wall
    aspectRatio: 5500 / 3000,
    wall: { left: 5, top: 10, right: 55, bottom: 72 },
    placement: { left: 12, top: 16, width: 26, height: 36 },
  },
  dining: {
    id: "dining",
    label: "Dining",
    image: "/images/rooms/dining.jpg",
    aspectRatio: 1,
    // Blank partition wall between dining area and sitting area beyond
    wall: { left: 32, top: 15, right: 84, bottom: 72 },
    placement: { left: 47, top: 20, width: 24, height: 30 },
  },
  office: {
    id: "office",
    label: "Office",
    image: "/images/rooms/office.jpg",
    aspectRatio: 1,
    wall: { left: 14, top: 5, right: 90, bottom: 62 },
    placement: { left: 38, top: 10, width: 24, height: 30 },
  },
}

export const ROOM_WALL_OPTIONS = Object.values(ROOM_WALL_CONFIGS)

export function getRoomWallConfig(room: string): RoomWallConfig {
  return ROOM_WALL_CONFIGS[room as RoomOption] ?? ROOM_WALL_CONFIGS.bedroom
}
