"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { StyleProfile, GeneratedImage, CartItem, Cart, RoomOption, GenerationBatch } from "@/lib/types"
import { calculatePrice } from "@/lib/mock-data"
import { stripArtworkIsolation } from "@/lib/artwork-isolation"

const LEGACY_ROOM_MAP: Record<string, RoomOption> = {
  "wall-1": "sitting-room",
  "wall-2": "sitting-room",
  "wall-3": "studio",
  "wall-4": "bedroom",
  "wall-5": "office",
  "wall-6": "dining",
  "wall-7": "sitting-room",
  "wall-8": "office",
  "wall-9": "studio",
  "wall-10": "sitting-room",
  "wall-11": "dining",
  "wall-12": "office",
}

function migrateRoom(room: unknown): RoomOption | null {
  if (!room || typeof room !== "string") return null
  if (room in LEGACY_ROOM_MAP) return LEGACY_ROOM_MAP[room]
  const valid: RoomOption[] = ["bedroom", "sitting-room", "studio", "dining", "office"]
  if (room === "hallway") return "dining"
  return valid.includes(room as RoomOption) ? (room as RoomOption) : null
}

// ── Style Profile Context ──
interface StyleProfileContextType {
  profile: StyleProfile | null
  setProfile: (profile: StyleProfile) => void
  clearProfile: () => void
  isQuizComplete: boolean
}

const defaultProfile: StyleProfile = {
  email: "",
  palettes: [],
  styles: [],
  subjects: [],
  mood: null,
  room: null,
  orientation: null,
}

const StyleProfileContext = createContext<StyleProfileContextType>({
  profile: null,
  setProfile: () => {},
  clearProfile: () => {},
  isQuizComplete: false,
})

export function StyleProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<StyleProfile | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("muse-style-profile")
      if (stored) {
        const parsedProfile = JSON.parse(stored)
        // Migrate old profile format to new format
        const migratedProfile: StyleProfile = {
          email: parsedProfile.email || "",
          palettes: parsedProfile.palettes || [],
          styles: parsedProfile.styles || [],
          subjects: parsedProfile.subjects || [],
          mood: parsedProfile.mood || null,
          room: migrateRoom(parsedProfile.room),
          orientation: parsedProfile.orientation || null,
        }
        setProfileState(migratedProfile)
        // Save the migrated profile back to localStorage
        localStorage.setItem("muse-style-profile", JSON.stringify(migratedProfile))
      }
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  const setProfile = useCallback((p: StyleProfile) => {
    setProfileState(p)
    localStorage.setItem("muse-style-profile", JSON.stringify(p))
  }, [])

  const clearProfile = useCallback(() => {
    setProfileState(null)
    localStorage.removeItem("muse-style-profile")
  }, [])

  const isQuizComplete = !!(
    profile && 
    profile.email && 
    profile.email.length > 0 && 
    profile.palettes && 
    profile.palettes.length > 0 && 
    profile.styles && 
    profile.styles.length > 0 && 
    profile.subjects && 
    profile.subjects.length > 0 && 
    profile.mood && 
    profile.room && 
    profile.orientation
  )

  if (!loaded) return null

  return (
    <StyleProfileContext.Provider value={{ profile, setProfile, clearProfile, isQuizComplete }}>
      {children}
    </StyleProfileContext.Provider>
  )
}

export function useStyleProfile() {
  return useContext(StyleProfileContext)
}

// ── Generation Context ──
interface GenerationContextType {
  prompt: string
  setPrompt: (prompt: string) => void
  enhancedPrompt: string
  setEnhancedPrompt: (prompt: string) => void
  currentImages: GeneratedImage[]
  setCurrentImages: (images: GeneratedImage[]) => void
  selectedImage: GeneratedImage | null
  setSelectedImage: (image: GeneratedImage | null) => void
  generationHistory: GenerationBatch[]
  addToHistory: (
    images: GeneratedImage[],
    meta?: { aspectRatio: string; quality: "standard" | "premium" }
  ) => void
  activeModifiers: string[]
  setActiveModifiers: (modifiers: string[]) => void
  isGenerating: boolean
  setIsGenerating: (loading: boolean) => void
  aspectRatio: string
  setAspectRatio: (ratio: string) => void
  quality: "standard" | "premium"
  setQuality: (quality: "standard" | "premium") => void
  clearSession: () => void
}

const GenerationContext = createContext<GenerationContextType>({
  prompt: "",
  setPrompt: () => {},
  enhancedPrompt: "",
  setEnhancedPrompt: () => {},
  currentImages: [],
  setCurrentImages: () => {},
  selectedImage: null,
  setSelectedImage: () => {},
  generationHistory: [],
  addToHistory: () => {},
  activeModifiers: [],
  setActiveModifiers: () => {},
  isGenerating: false,
  setIsGenerating: () => {},
  aspectRatio: "3:4",
  setAspectRatio: () => {},
  quality: "standard",
  setQuality: () => {},
  clearSession: () => {},
})

export function GenerationProvider({ children }: { children: React.ReactNode }) {
  const [prompt, setPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [currentImages, setCurrentImages] = useState<GeneratedImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null)
  const [generationHistory, setGenerationHistory] = useState<GenerationBatch[]>([])
  const [activeModifiers, setActiveModifiers] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [aspectRatio, setAspectRatio] = useState("3:4")
  const [quality, setQuality] = useState<"standard" | "premium">("standard")
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedPrompt = localStorage.getItem("muse-prompt")
      if (storedPrompt) setPrompt(stripArtworkIsolation(storedPrompt))

      const storedEnhanced = localStorage.getItem("muse-enhanced-prompt")
      if (storedEnhanced) setEnhancedPrompt(stripArtworkIsolation(storedEnhanced))

      const storedCurrent = localStorage.getItem("muse-current-images")
      if (storedCurrent) setCurrentImages(JSON.parse(storedCurrent))

      const storedSelected = localStorage.getItem("muse-selected-image")
      if (storedSelected && storedSelected !== "undefined") {
        setSelectedImage(JSON.parse(storedSelected))
      }

      const storedHistory = localStorage.getItem("muse-generation-history")
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory)
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (Array.isArray(parsed[0])) {
            setGenerationHistory(
              (parsed as GeneratedImage[][]).map((images, i) => ({
                id: `legacy-${i}`,
                createdAt: Date.now() - (parsed.length - i) * 86_400_000,
                aspectRatio: "3:4",
                quality: "standard" as const,
                images,
              }))
            )
          } else {
            setGenerationHistory(parsed as GenerationBatch[])
          }
        }
      }

      const storedModifiers = localStorage.getItem("muse-active-modifiers")
      if (storedModifiers) setActiveModifiers(JSON.parse(storedModifiers))

      const storedRatio = localStorage.getItem("muse-aspect-ratio")
      if (storedRatio) setAspectRatio(storedRatio)

      const storedQuality = localStorage.getItem("muse-quality")
      if (storedQuality) setQuality(storedQuality as "standard" | "premium")
    } catch (e) {
      console.error("Failed to load generation state from localStorage:", e)
    }
    setLoaded(true)
  }, [])

  // Sync state to localStorage when values change
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem("muse-prompt", prompt)
      localStorage.setItem("muse-enhanced-prompt", enhancedPrompt)
      localStorage.setItem("muse-current-images", JSON.stringify(currentImages))
      localStorage.setItem("muse-selected-image", selectedImage ? JSON.stringify(selectedImage) : "")
      localStorage.setItem("muse-generation-history", JSON.stringify(generationHistory))
      localStorage.setItem("muse-active-modifiers", JSON.stringify(activeModifiers))
      localStorage.setItem("muse-aspect-ratio", aspectRatio)
      localStorage.setItem("muse-quality", quality)
    } catch (e) {
      console.error("Failed to save generation state to localStorage:", e)
    }
  }, [loaded, prompt, enhancedPrompt, currentImages, selectedImage, generationHistory, activeModifiers, aspectRatio, quality])

  const addToHistory = useCallback(
    (
      images: GeneratedImage[],
      meta?: { aspectRatio: string; quality: "standard" | "premium" }
    ) => {
      setGenerationHistory((prev) => [
        ...prev,
        {
          id: `gen-${Date.now()}`,
          createdAt: Date.now(),
          aspectRatio: meta?.aspectRatio ?? aspectRatio,
          quality: meta?.quality ?? quality,
          images,
        },
      ])
    },
    [aspectRatio, quality]
  )

  const clearSession = useCallback(() => {
    setPrompt("")
    setEnhancedPrompt("")
    setCurrentImages([])
    setSelectedImage(null)
    setGenerationHistory([])
    setActiveModifiers([])
    try {
      localStorage.removeItem("muse-prompt")
      localStorage.removeItem("muse-enhanced-prompt")
      localStorage.removeItem("muse-current-images")
      localStorage.removeItem("muse-selected-image")
      localStorage.removeItem("muse-generation-history")
      localStorage.removeItem("muse-active-modifiers")
    } catch {
      // ignore
    }
  }, [])

  if (!loaded) return null

  return (
    <GenerationContext.Provider
      value={{
        prompt, setPrompt,
        enhancedPrompt, setEnhancedPrompt,
        currentImages, setCurrentImages,
        selectedImage, setSelectedImage,
        generationHistory, addToHistory,
        activeModifiers, setActiveModifiers,
        isGenerating, setIsGenerating,
        aspectRatio, setAspectRatio,
        quality, setQuality,
        clearSession,
      }}
    >
      {children}
    </GenerationContext.Provider>
  )
}

export function useGeneration() {
  return useContext(GenerationContext)
}

// ── Cart Context ──
interface CartContextType {
  cart: Cart | null
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (itemId: string) => void
  itemCount: number
  totalPrice: number
  checkoutUrl: string
  clearCart: () => void
}

const CartContext = createContext<CartContextType>({
  cart: null,
  addItem: () => {},
  removeItem: () => {},
  itemCount: 0,
  totalPrice: 0,
  checkoutUrl: "/checkout-placeholder",
  clearCart: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("muse-cart")
      if (stored) {
        setCart(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded && cart) {
      localStorage.setItem("muse-cart", JSON.stringify(cart))
    }
  }, [cart, loaded])

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    const newItem: CartItem = { ...item, id: `cart-${Date.now()}-${Math.random().toString(36).slice(2)}` }
    setCart((prev) => {
      const items = prev ? [...prev.items, newItem] : [newItem]
      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return {
        id: prev?.id ?? `cart-${Date.now()}`,
        items,
        totalPrice,
        checkoutUrl: "/checkout-placeholder",
      }
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setCart((prev) => {
      if (!prev) return null
      const items = prev.items.filter((i) => i.id !== itemId)
      if (items.length === 0) {
        localStorage.removeItem("muse-cart")
        return null
      }
      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      return { ...prev, items, totalPrice }
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart(null)
    localStorage.removeItem("muse-cart")
  }, [])

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  const totalPrice = cart?.totalPrice ?? 0
  const checkoutUrl = cart?.checkoutUrl ?? "/checkout-placeholder"

  if (!loaded) return null

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, itemCount, totalPrice, checkoutUrl, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
