"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Home, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"
import { FRAMES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { RoomOption } from "@/lib/types"

const ROOM_IMAGES: Record<string, string> = {
  "living-room": "/preview/living.png",
  "bedroom": "/preview/bedroom.jpg",
  "office": "/preview/office.jpg",
  "dining": "/preview/dining.jpg",
}

const ROOM_OPTIONS = [
  { id: "living-room", label: "Living Room" },
  { id: "bedroom", label: "Bedroom" },
  { id: "office", label: "Office" },
  { id: "dining", label: "Dining Room" },
]

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

// Frame styles with realistic effects
const FRAME_STYLES: Record<string, { 
  borderWidth: string
  borderColor: string
  boxShadow: string
  background?: string
}> = {
  "none": {
    borderWidth: "0px",
    borderColor: "transparent",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
  },
  "black": {
    borderWidth: "16px",
    borderColor: "#1a1a1a",
    boxShadow: "0 15px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)",
    background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)",
  },
  "white": {
    borderWidth: "16px",
    borderColor: "#f8f8f8",
    boxShadow: "0 15px 50px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,0,0,0.05)",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 50%, #f0f0f0 100%)",
  },
  "natural": {
    borderWidth: "16px",
    borderColor: "#d4a574",
    boxShadow: "0 15px 50px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.1)",
    background: "linear-gradient(135deg, #e0b589 0%, #d4a574 50%, #c89960 100%)",
  },
  "walnut": {
    borderWidth: "16px",
    borderColor: "#5d4037",
    boxShadow: "0 15px 50px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)",
    background: "linear-gradient(135deg, #6d4c41 0%, #5d4037 50%, #4e342e 100%)",
  },
  "float": {
    borderWidth: "0px",
    borderColor: "transparent",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.1)",
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
  const [selectedRoom, setSelectedRoom] = useState(initialRoom)
  
  const frameData = FRAMES.find((f) => f.id === frame)
  const roomImage = ROOM_IMAGES[selectedRoom] || ROOM_IMAGES["living-room"]

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
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {PREVIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-md py-2 text-[10px] sm:text-xs transition-all",
              mode === tab.id
                ? "bg-background text-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Preview Area */}
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-[4/3]">
        <AnimatePresence mode="wait">
          {mode === "art" && (
            <motion.div
              key="art"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 p-4 sm:p-8"
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
                    className="p-4 sm:p-6"
                    style={{ backgroundColor: matColor }}
                  >
                    <div className="relative aspect-[3/4] w-32 sm:w-40 md:w-56 lg:w-64 shadow-inner">
                      <Image
                        src={imageUrl}
                        alt="Your art"
                        fill
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 224px, 256px"
                        className="object-cover"
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
              <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: "10%" }}>
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
                      className="p-2 sm:p-3"
                      style={{ backgroundColor: matColor }}
                    >
                      <div className="relative aspect-[3/4] w-14 sm:w-20 md:w-28 lg:w-36 shadow-inner">
                        <Image
                          src={imageUrl}
                          alt="Art in room"
                          fill
                          sizes="(max-width: 640px) 56px, (max-width: 768px) 80px, (max-width: 1024px) 112px, 144px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* No mat - direct image */}
                  {!hasMat && (
                    <div className="relative aspect-[3/4] w-20 sm:w-28 md:w-36 lg:w-44">
                      <Image
                        src={imageUrl}
                        alt="Art in room"
                        fill
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, (max-width: 1024px) 144px, 176px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Room Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
                <button
                  onClick={() => {
                    const currentIndex = ROOM_OPTIONS.findIndex(r => r.id === selectedRoom)
                    const prevIndex = (currentIndex - 1 + ROOM_OPTIONS.length) % ROOM_OPTIONS.length
                    setSelectedRoom(ROOM_OPTIONS[prevIndex].id)
                  }}
                  className="p-1 hover:bg-accent/10 rounded-full transition-colors"
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
                  className="p-1 hover:bg-accent/10 rounded-full transition-colors"
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
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-border hover:border-accent/50"
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
                <div className="absolute inset-0 bg-accent/20" />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
