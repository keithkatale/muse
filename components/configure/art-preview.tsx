"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Home, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"
import { FRAMES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { RoomOption } from "@/lib/types"

interface RoomConfig {
  id: string
  label: string
  image: string
  left: string
  top: string
  width: string
  height: string
}

const ROOM_CONFIGS: Record<string, RoomConfig> = {
  bedroom: {
    id: "bedroom",
    label: "Bedroom",
    image: "/images/rooms/bedroom.jpg",
    left: "12.5%",
    top: "23.1%",
    width: "20.0%",
    height: "23.1%",
  },
  "sitting-room": {
    id: "sitting-room",
    label: "Sitting Room",
    image: "/images/rooms/living-room.jpg",
    left: "50.0%",
    top: "6.7%",
    width: "45.0%",
    height: "80.0%",
  },
  studio: {
    id: "studio",
    label: "Studio",
    image: "/images/rooms/wall-3.jpg",
    left: "5.0%",
    top: "9.5%",
    width: "52.5%",
    height: "76.2%",
  },
  dining: {
    id: "dining",
    label: "Dining",
    image: "/images/rooms/dining.jpg",
    left: "22.5%",
    top: "6.7%",
    width: "57.5%",
    height: "56.7%",
  },
  office: {
    id: "office",
    label: "Office",
    image: "/images/rooms/office.jpg",
    left: "27.5%",
    top: "15.4%",
    width: "30.0%",
    height: "34.6%",
  },
  hallway: {
    id: "hallway",
    label: "Hallway",
    image: "/images/rooms/hallway.jpg",
    left: "15.0%",
    top: "9.1%",
    width: "40.0%",
    height: "54.5%",
  },
}

const ROOM_OPTIONS = Object.values(ROOM_CONFIGS)
const ROOM_IMAGES = Object.fromEntries(
  Object.entries(ROOM_CONFIGS).map(([key, c]) => [key, c.image])
) as Record<string, string>

type PreviewMode = "art" | "room" | "detail"

const PREVIEW_TABS: { id: PreviewMode; label: string; icon: typeof Eye }[] = [
  { id: "art", label: "Art Only", icon: Eye },
  { id: "room", label: "Room View", icon: Home },
  { id: "detail", label: "Detail", icon: ZoomIn },
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

// Frame styles (no shadow on art overlay)
const FRAME_STYLES: Record<string, { 
  borderWidth: string
  borderColor: string
  boxShadow: string
  background?: string
}> = {
  "none": {
    borderWidth: "0px",
    borderColor: "transparent",
    boxShadow: "none",
  },
  "black": {
    borderWidth: "8px",
    borderColor: "#1a1a1a",
    boxShadow: "none",
    background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)",
  },
  "white": {
    borderWidth: "8px",
    borderColor: "#f8f8f8",
    boxShadow: "none",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 50%, #f0f0f0 100%)",
  },
  "natural": {
    borderWidth: "8px",
    borderColor: "#d4a574",
    boxShadow: "none",
    background: "linear-gradient(135deg, #e0b589 0%, #d4a574 50%, #c89960 100%)",
  },
  "walnut": {
    borderWidth: "8px",
    borderColor: "#5d4037",
    boxShadow: "none",
    background: "linear-gradient(135deg, #6d4c41 0%, #5d4037 50%, #4e342e 100%)",
  },
  "float": {
    borderWidth: "0px",
    borderColor: "transparent",
    boxShadow: "none",
  },
}

export function ArtPreview({
  imageUrl,
  frame,
  room: initialRoom,
  size = "16x20",
  mat = "none",
}: {
  imageUrl: string
  frame: string | null
  room: string
  size?: string
  mat?: string
}) {
  const [mode, setMode] = useState<PreviewMode>("room")
  const [selectedRoom, setSelectedRoom] = useState<string>(() => {
    if (initialRoom && initialRoom in ROOM_CONFIGS) {
      return initialRoom
    }
    return "bedroom"
  })
  
  const frameData = frame ? FRAMES.find((f) => f.id === frame) : undefined
  const roomConfig = ROOM_CONFIGS[selectedRoom] || ROOM_CONFIGS["bedroom"]
  const roomImage = roomConfig.image

  const hasFrame = frame !== "none" && frame !== null
  const hasMat = mat !== "none" && hasFrame
  
  // Get scale factor based on size
  const sizeScale = SIZE_SCALES[size] || 1.0
  
  // Get frame style
  const frameStyle = FRAME_STYLES[frame || "none"] || FRAME_STYLES["none"]

  // Mat color
  const matColor = mat === "white" ? "#ffffff" : mat === "off-white" ? "#f5f5dc" : "transparent"

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

      {/* Preview Area */}
      <div className="relative overflow-hidden rounded-lg bg-[#F5EDE6] aspect-[4/3]">
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
                  ...frameStyle,
                  borderWidth: hasFrame ? frameStyle.borderWidth : "0px",
                  borderStyle: "solid",
                  borderColor: frameStyle.borderColor,
                  boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
                  background: frameStyle.background,
                  borderRadius: frame === "float" ? "2px" : "0px",
                  willChange: "transform",
                }}
                className="relative overflow-hidden transition-all duration-300 transform-gpu"
              >
                {/* Stable Artwork Mounting Container with fluid mat border growth */}
                <div 
                  className="transition-all duration-300 ease-out flex items-center justify-center transform-gpu"
                  style={{ 
                    padding: hasMat ? "16px" : "0px",
                    backgroundColor: hasMat ? matColor : "transparent",
                    willChange: "padding, background-color"
                  }}
                >
                  <div 
                    className="relative aspect-[3/4] transition-all duration-300 ease-out shadow-inner"
                    style={{
                      width: hasMat ? "200px" : "240px", // stable dimension scales
                      willChange: "width"
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
              {/* Layered room background images for double-buffering preloading */}
              <div className="absolute inset-0 w-full h-full pointer-events-none transform-gpu">
                {ROOM_OPTIONS.map((room) => (
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
                      loading="lazy"
                      priority={room.id === "bedroom"}
                    />
                  </div>
                ))}
              </div>

              {/* Art overlay positioned on wall - glides smoothly on room changes */}
              <motion.div
                animate={{
                  scale: sizeScale,
                  left: roomConfig.left,
                  top: roomConfig.top,
                  width: roomConfig.width,
                  height: roomConfig.height,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1], // premium cubic bezier
                }}
                style={{
                  ...frameStyle,
                  borderWidth: hasFrame ? frameStyle.borderWidth : "0px",
                  borderStyle: "solid",
                  borderColor: frameStyle.borderColor,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.15)",
                  background: frameStyle.background,
                  borderRadius: frame === "float" ? "2px" : "0px",
                  position: "absolute",
                  transformOrigin: "center center",
                  zIndex: 2,
                  willChange: "transform, left, top, width, height",
                }}
                className="overflow-hidden"
              >
                {/* Stable Artwork Mounting Container with fluid mat border growth */}
                <div 
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out transform-gpu"
                  )}
                  style={{ 
                    padding: hasMat ? "5%" : "0px",
                    backgroundColor: hasMat ? matColor : "transparent",
                    willChange: "padding, background-color"
                  }}
                >
                  <div className={cn("relative w-full h-full transition-all duration-300", hasMat && "shadow-inner")}>
                    <Image
                      src={imageUrl}
                      alt="Art in room"
                      fill
                      sizes="(max-width: 1024px) 50vw, 30vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              </motion.div>

              {/* Room Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-muse-floral/95 backdrop-blur-sm rounded-full border border-[#E8DDD4] px-3 py-2 shadow-lg text-[#564738] z-10">
                <button
                  onClick={() => {
                    const currentIndex = ROOM_OPTIONS.findIndex(r => r.id === selectedRoom)
                    const prevIndex = (currentIndex - 1 + ROOM_OPTIONS.length) % ROOM_OPTIONS.length
                    setSelectedRoom(ROOM_OPTIONS[prevIndex].id)
                  }}
                  className="p-1 hover:bg-muse-selected/60 rounded-full transition-colors text-[#564738]"
                  aria-label="Previous room"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <span className="text-xs font-medium px-2 min-w-[80px] text-center">
                  {ROOM_OPTIONS.find(r => r.id === selectedRoom)?.label}
                </span>
                
                <button
                  onClick={() => {
                    const currentIndex = ROOM_OPTIONS.findIndex(r => r.id === selectedRoom)
                    const nextIndex = (currentIndex + 1) % ROOM_OPTIONS.length
                    setSelectedRoom(ROOM_OPTIONS[nextIndex].id)
                  }}
                  className="p-1 hover:bg-muse-selected/60 rounded-full transition-colors text-[#564738]"
                  aria-label="Next room"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {mode === "detail" && (
            <motion.div
              key="detail-view-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-full"
            >
              <Image
                src={imageUrl}
                alt="Detail view"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover scale-150"
                unoptimized
              />
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
          {ROOM_OPTIONS.map((room) => (
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
                src={ROOM_IMAGES[room.id]}
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
