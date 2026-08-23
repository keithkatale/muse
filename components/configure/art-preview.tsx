"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Home, ChevronLeft, ChevronRight } from "lucide-react"
import {
  ROOM_WALL_OPTIONS,
  getRoomWallConfig,
} from "@/lib/room-wall-config"
import { cn } from "@/lib/utils"

type PreviewMode = "art" | "room"

const PREVIEW_TABS: { id: PreviewMode; label: string; icon: typeof Eye }[] = [
  { id: "art", label: "Art Only", icon: Eye },
  { id: "room", label: "Room View", icon: Home },
]

// Size scale factors for visual representation
const SIZE_SCALES: Record<string, number> = {
  "8x10": 0.7,
  "12x16": 0.85,
  "16x20": 1.0,
  "18x24": 1.1,
  "24x36": 1.3,
  "30x40": 1.5,
}

// Frame moulding as a % of the artwork so thickness stays proportional
const FRAME_STYLES: Record<string, {
  moulding: string
  borderColor: string
  background: string
}> = {
  none: {
    moulding: "0%",
    borderColor: "transparent",
    background: "transparent",
  },
  black: {
    moulding: "2.4%",
    borderColor: "#1a1a1a",
    background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)",
  },
  white: {
    moulding: "2.4%",
    borderColor: "#f5f5f0",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 50%, #ecece6 100%)",
  },
  natural: {
    moulding: "2.6%",
    borderColor: "#c4a882",
    background: "linear-gradient(135deg, #e0b589 0%, #d4a574 50%, #c89960 100%)",
  },
  walnut: {
    moulding: "2.6%",
    borderColor: "#5c3d2e",
    background: "linear-gradient(135deg, #6d4c41 0%, #5d4037 50%, #4e342e 100%)",
  },
  float: {
    moulding: "1.1%",
    borderColor: "#2a2a2a",
    background: "linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%)",
  },
}

export function ArtPreview({
  imageUrl,
  frame,
  room: initialRoom,
  size = "16x20",
  mat = "none",
  imageRatio = 3 / 4,
}: {
  imageUrl: string
  frame: string | null
  room: string
  size?: string
  mat?: string
  imageRatio?: number
}) {
  const [mode, setMode] = useState<PreviewMode>("room")
  const [selectedRoom, setSelectedRoom] = useState<string>(() => {
    const config = getRoomWallConfig(initialRoom)
    return config.id
  })
  
  const roomConfig = getRoomWallConfig(selectedRoom)
  const placement = roomConfig.placement
  const fillsExistingFrame = Boolean(roomConfig.fillsExistingFrame)

  // Calculate dynamic placement to match the image's actual aspect ratio without exceeding original bounds
  const adjustedPlacement = useMemo(() => {
    if (fillsExistingFrame) {
      return {
        left: placement.left,
        top: placement.top,
        width: placement.width,
        height: placement.height,
      }
    }

    const containerAspect = roomConfig.aspectRatio
    // The ratio of percentage-width to percentage-height must equal imageRatio / containerAspect
    const percentageRatio = imageRatio / containerAspect

    const originalWidth = placement.width
    const originalHeight = placement.height
    const originalAspect = originalWidth / originalHeight
    
    let newWidth = originalWidth
    let newHeight = originalHeight

    if (percentageRatio > originalAspect) {
      // Image is wider than the original slot in percentage terms
      newWidth = originalWidth
      newHeight = originalWidth / percentageRatio
    } else {
      // Image is taller than or equal to the original slot in percentage terms
      newHeight = originalHeight
      newWidth = originalHeight * percentageRatio
    }

    // Keep the center aligned with the original placement's center
    const originalCenterX = placement.left + originalWidth / 2
    const originalCenterY = placement.top + originalHeight / 2

    const newLeft = originalCenterX - newWidth / 2
    const newTop = originalCenterY - newHeight / 2

    return {
      left: newLeft,
      top: newTop,
      width: newWidth,
      height: newHeight,
    }
  }, [placement, fillsExistingFrame, imageRatio, roomConfig.aspectRatio])

  const hasFrame = frame !== "none" && frame !== null
  const hasMat = mat !== "none" && hasFrame
  // In room view, sitting-room fills a photo frame — don't double-frame or size-scale
  const roomHasFrame = hasFrame && !fillsExistingFrame
  const roomHasMat = hasMat && !fillsExistingFrame
  
  const sizeScale = fillsExistingFrame ? 1 : (SIZE_SCALES[size] || 1.0)
  
  const frameStyle = FRAME_STYLES[frame || "none"] || FRAME_STYLES["none"]
  const roomFrameStyle = fillsExistingFrame ? FRAME_STYLES["none"] : frameStyle

  // Mat color
  const matColor = mat === "white" ? "#ffffff" : mat === "off-white" ? "#f5f5dc" : "transparent"

  const previewAspectRatio = mode === "room" ? roomConfig.aspectRatio : 4 / 3

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Preview Mode Tabs */}
      <div className="flex gap-1 rounded-lg border border-[#E8DDD4] bg-muse-floral p-1">
        {PREVIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-md border-2 py-2 text-[10px] sm:text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muse-peach/40",
              mode === tab.id
                ? "border-muse-peach bg-muse-selected text-[#564738] font-medium shadow-sm"
                : "border-[#E8DDD4] bg-muse-floral text-[#947A5D] hover:border-muse-peach hover:bg-muse-selected/50 hover:text-[#564738]"
            )}
          >
            <tab.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Preview Area — aspectRatio matches the active room photo so % coords stay aligned */}
      <div
        className="relative w-full overflow-hidden rounded-lg bg-[#F5EDE6]"
        style={{ aspectRatio: previewAspectRatio }}
      >
        <AnimatePresence mode="wait">
          {mode === "art" && (
            <motion.div
              key="art-view-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full items-center justify-center bg-gradient-to-br from-[#FAF6F2] to-[#F0E6DD] p-4 sm:p-8"
            >
              <motion.div
                animate={{ scale: sizeScale }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  boxSizing: "border-box",
                  width: "min(70%, 16.5rem)",
                  padding: hasFrame ? frameStyle.moulding : "0%",
                  background: hasFrame ? frameStyle.background : "transparent",
                  boxShadow: hasFrame
                    ? "inset 0 0 0 1px rgba(255,255,255,0.12), 0 12px 28px rgba(0,0,0,0.14)"
                    : "0 12px 28px rgba(0,0,0,0.12)",
                  borderRadius: frame === "float" ? "2px" : "1px",
                  willChange: "transform",
                }}
                className="relative overflow-hidden transition-all duration-300 transform-gpu"
              >
                {/* Artwork + optional mat, inset by proportional frame moulding */}
                <div 
                  className="flex items-center justify-center transition-all duration-300 ease-out transform-gpu"
                  style={{ 
                    padding: hasMat ? "6%" : "0px",
                    backgroundColor: hasMat ? matColor : "transparent",
                    willChange: "padding, background-color"
                  }}
                >
                  <div 
                    className="relative w-full shadow-inner transition-all duration-300 ease-out"
                    style={{
                      aspectRatio: imageRatio,
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt="Your art"
                      fill
                      sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, 320px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {mode === "room" && (
            <motion.div
              key="room-view-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-full w-full overflow-hidden select-none"
            >
              {/* Room photo — object-cover + matching aspectRatio keeps wall coords aligned */}
              <div className="absolute inset-0 w-full h-full pointer-events-none transform-gpu">
                {ROOM_WALL_OPTIONS.map((room) => (
                  <div
                    key={room.id}
                    className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out transform-gpu"
                    style={{
                      opacity: selectedRoom === room.id ? 1 : 0,
                      zIndex: selectedRoom === room.id ? 1 : 0,
                    }}
                  >
                    <Image
                      src={room.image}
                      alt={room.label}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      priority={room.id === "bedroom"}
                    />
                  </div>
                ))}
              </div>

              {/* Art overlay — positioned on detected wall / frame zone */}
              <motion.div
                animate={{
                  scale: sizeScale,
                  left: `${adjustedPlacement.left}%`,
                  top: `${adjustedPlacement.top}%`,
                  width: `${adjustedPlacement.width}%`,
                  height: `${adjustedPlacement.height}%`,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                  boxSizing: "border-box",
                  padding: roomHasFrame ? roomFrameStyle.moulding : "0%",
                  background: roomHasFrame ? roomFrameStyle.background : "transparent",
                  boxShadow: fillsExistingFrame
                    ? "none"
                    : roomHasFrame
                      ? "inset 0 0 0 1px rgba(255,255,255,0.1), 0 6px 16px rgba(0,0,0,0.2)"
                      : "0 8px 24px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
                  borderRadius: frame === "float" && !fillsExistingFrame ? "2px" : "0px",
                  position: "absolute",
                  transformOrigin: "center center",
                  zIndex: 2,
                  willChange: "transform, left, top, width, height",
                }}
                className="overflow-hidden"
              >
                <div 
                  className={cn(
                    "flex h-full w-full items-center justify-center transition-all duration-300 ease-out transform-gpu"
                  )}
                  style={{ 
                    padding: roomHasMat ? "5%" : (fillsExistingFrame ? "4%" : "0px"),
                    backgroundColor: roomHasMat 
                      ? matColor 
                      : (fillsExistingFrame 
                          ? (mat === "off-white" ? "#f5f5dc" : "#ffffff") 
                          : "transparent"),
                    willChange: "padding, background-color"
                  }}
                >
                  <div className={cn("relative h-full w-full transition-all duration-300", (roomHasMat || fillsExistingFrame) && "shadow-inner")}>
                    <Image
                      src={imageUrl}
                      alt="Art in room"
                      fill
                      sizes="(max-width: 1024px) 50vw, 30vw"
                      className={fillsExistingFrame ? "object-contain" : "object-cover"}
                      unoptimized
                    />
                  </div>
                </div>
              </motion.div>

              {/* Room Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-muse-floral/95 backdrop-blur-sm rounded-full border border-[#E8DDD4] px-3 py-2 shadow-lg text-[#564738] z-10">
                <button
                  onClick={() => {
                    const currentIndex = ROOM_WALL_OPTIONS.findIndex(r => r.id === selectedRoom)
                    const prevIndex = (currentIndex - 1 + ROOM_WALL_OPTIONS.length) % ROOM_WALL_OPTIONS.length
                    setSelectedRoom(ROOM_WALL_OPTIONS[prevIndex].id)
                  }}
                  className="p-1 hover:bg-muse-selected/60 rounded-full transition-colors text-[#564738]"
                  aria-label="Previous room"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <span className="text-xs font-medium px-2 min-w-[80px] text-center">
                  {ROOM_WALL_OPTIONS.find(r => r.id === selectedRoom)?.label}
                </span>
                
                <button
                  onClick={() => {
                    const currentIndex = ROOM_WALL_OPTIONS.findIndex(r => r.id === selectedRoom)
                    const nextIndex = (currentIndex + 1) % ROOM_WALL_OPTIONS.length
                    setSelectedRoom(ROOM_WALL_OPTIONS[nextIndex].id)
                  }}
                  className="p-1 hover:bg-muse-selected/60 rounded-full transition-colors text-[#564738]"
                  aria-label="Next room"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}


        </AnimatePresence>
      </div>

      {/* Room Selector Thumbnails (only show in room mode) */}
      {mode === "room" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
        >
          {ROOM_WALL_OPTIONS.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={cn(
                "relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-md overflow-hidden border-2 transition-all",
                selectedRoom === room.id
                  ? "border-muse-peach ring-2 ring-muse-peach/25"
                  : "border-[#E8DDD4] hover:border-muse-peach"
              )}
            >
              <Image
                src={room.image}
                alt={room.label}
                fill
                sizes="80px"
                className="object-cover"
              />
              {selectedRoom === room.id && (
                <div className="absolute inset-0 bg-muse-selected/30" />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
