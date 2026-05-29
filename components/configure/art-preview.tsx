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
  "wall-1": {
    id: "wall-1",
    label: "Warm Scandinavian Studio",
    image: "/images/rooms/wall-1.jpg",
    left: "15.0%",
    top: "7.7%",
    width: "42.5%",
    height: "65.4%",
  },
  "wall-2": {
    id: "wall-2",
    label: "Minimalist Living Room",
    image: "/images/rooms/wall-2.jpg",
    left: "50.0%",
    top: "6.7%",
    width: "45.0%",
    height: "80.0%",
  },
  "wall-3": {
    id: "wall-3",
    label: "Modern Studio Wall",
    image: "/images/rooms/wall-3.jpg",
    left: "5.0%",
    top: "9.5%",
    width: "52.5%",
    height: "76.2%",
  },
  "wall-4": {
    id: "wall-4",
    label: "Boho Bedroom",
    image: "/images/rooms/wall-4.jpg",
    left: "12.5%",
    top: "23.1%",
    width: "20.0%",
    height: "23.1%",
  },
  "wall-5": {
    id: "wall-5",
    label: "Earthy Workspace",
    image: "/images/rooms/wall-5.jpg",
    left: "27.5%",
    top: "15.4%",
    width: "30.0%",
    height: "34.6%",
  },
  "wall-6": {
    id: "wall-6",
    label: "Minimalist Gallery",
    image: "/images/rooms/wall-6.jpg",
    left: "15.0%",
    top: "9.1%",
    width: "40.0%",
    height: "54.5%",
  },
  "wall-7": {
    id: "wall-7",
    label: "Luxury Parlor",
    image: "/images/rooms/wall-7.jpg",
    left: "70.0%",
    top: "13.6%",
    width: "25.0%",
    height: "59.1%",
  },
  "wall-8": {
    id: "wall-8",
    label: "Executive Lounge",
    image: "/images/rooms/wall-8.jpg",
    left: "45.0%",
    top: "18.2%",
    width: "30.0%",
    height: "40.9%",
  },
  "wall-9": {
    id: "wall-9",
    label: "Creative Corner",
    image: "/images/rooms/wall-9.jpg",
    left: "50.0%",
    top: "7.4%",
    width: "40.0%",
    height: "44.4%",
  },
  "wall-10": {
    id: "wall-10",
    label: "Contemporary Lounge",
    image: "/images/rooms/wall-10.jpg",
    left: "17.5%",
    top: "16.7%",
    width: "35.0%",
    height: "46.7%",
  },
  "wall-11": {
    id: "wall-11",
    label: "Bright Atelier",
    image: "/images/rooms/wall-11.jpg",
    left: "22.5%",
    top: "6.7%",
    width: "57.5%",
    height: "56.7%",
  },
  "wall-12": {
    id: "wall-12",
    label: "Stylish Workspace",
    image: "/images/rooms/wall-12.jpg",
    left: "55.0%",
    top: "30.0%",
    width: "40.0%",
    height: "40.0%",
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
  frame: string
  room: string
  size?: string
  mat?: string
}) {
  const [mode, setMode] = useState<PreviewMode>("room")
  const [selectedRoom, setSelectedRoom] = useState<string>(() => {
    if (initialRoom && initialRoom in ROOM_CONFIGS) {
      return initialRoom
    }
    return "wall-1"
  })
  
  const frameData = FRAMES.find((f) => f.id === frame)
  const roomConfig = ROOM_CONFIGS[selectedRoom] || ROOM_CONFIGS["wall-1"]
  const roomImage = roomConfig.image

  const hasFrame = frame !== "none"
  const hasMat = mat !== "none" && hasFrame
  
  // Get scale factor based on size
  const sizeScale = SIZE_SCALES[size] || 1.0
  
  // Get frame style
  const frameStyle = FRAME_STYLES[frame] || FRAME_STYLES["none"]

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
              key="art"
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
                  boxShadow: frameStyle.boxShadow,
                  background: frameStyle.background,
                  borderRadius: frame === "float" ? "2px" : "0px",
                }}
                className="relative overflow-hidden"
              >
                {/* Mat layer */}
                {hasMat && (
                  <div 
                    className="p-3 sm:p-4"
                    style={{ backgroundColor: matColor }}
                  >
                    <div className="relative aspect-[3/4] w-32 sm:w-40 md:w-56 lg:w-64 shadow-inner">
                      <Image
                        src={imageUrl}
                        alt="Your art"
                        fill
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 224px, 256px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
                
                {/* No mat - direct image */}
                {!hasMat && (
                  <div className="relative aspect-[3/4] w-40 sm:w-48 md:w-64 lg:w-72">
                    <Image
                      src={imageUrl}
                      alt="Your art"
                      fill
                      sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 256px, 288px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {mode === "room" && (
            <motion.div
              key={`room-${selectedRoom}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-full"
            >
              <Image
                src={roomImage}
                alt="Room mockup"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              {/* Art overlay positioned on wall */}
              <motion.div
                animate={{ scale: sizeScale }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  ...frameStyle,
                  borderWidth: hasFrame ? frameStyle.borderWidth : "0px",
                  borderStyle: "solid",
                  borderColor: frameStyle.borderColor,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.20), 0 4px 10px rgba(0,0,0,0.12)",
                  background: frameStyle.background,
                  borderRadius: frame === "float" ? "2px" : "0px",
                  position: "absolute",
                  left: roomConfig.left,
                  top: roomConfig.top,
                  width: roomConfig.width,
                  height: roomConfig.height,
                  transformOrigin: "center center",
                }}
                className="overflow-hidden"
              >
                {/* Mat layer */}
                {hasMat && (
                  <div 
                    className="absolute inset-0 p-[5%] flex items-center justify-center"
                    style={{ backgroundColor: matColor }}
                  >
                    <div className="relative w-full h-full shadow-inner">
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
                )}
                
                {/* No mat - direct image */}
                {!hasMat && (
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={imageUrl}
                      alt="Art in room"
                      fill
                      sizes="(max-width: 1024px) 50vw, 30vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </motion.div>

              {/* Room Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-muse-floral/95 backdrop-blur-sm rounded-full border border-[#E8DDD4] px-3 py-2 shadow-lg text-[#564738]">
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
              key="detail"
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
