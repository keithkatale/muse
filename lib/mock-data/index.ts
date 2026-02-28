import type {
  SizeOption,
  MediumOption,
  FrameOption,
  MatOption,
  ProductVariantMapping,
  GalleryItem,
  StartingConcept,
} from "@/lib/types"

// ── Sizes ──
export const SIZES: SizeOption[] = [
  { id: "8x10", label: '8\u00d710"', basePrice: 2900 },
  { id: "12x16", label: '12\u00d716"', basePrice: 4900 },
  { id: "16x20", label: '16\u00d720"', basePrice: 6900 },
  { id: "18x24", label: '18\u00d724"', basePrice: 8900 },
  { id: "24x36", label: '24\u00d736"', basePrice: 11900 },
  { id: "30x40", label: '30\u00d740"', basePrice: 15900 },
]

// ── Mediums ──
export const MEDIUMS: MediumOption[] = [
  { id: "paper", label: "Fine Art Paper", description: "Museum-quality archival matte", upcharge: 0 },
  { id: "canvas", label: "Canvas", description: "Gallery-wrapped, ready to hang", upcharge: 2000 },
  { id: "acrylic", label: "Acrylic", description: "High-gloss modern finish", upcharge: 4000 },
  { id: "metal", label: "Metal", description: "Contemporary ultra-durable", upcharge: 5000 },
]

// ── Frames ──
export const FRAMES: FrameOption[] = [
  { id: "none", label: "No Frame", upcharge: 0, color: "transparent" },
  { id: "black", label: "Black", upcharge: 3000, color: "#1a1a1a" },
  { id: "white", label: "White", upcharge: 3000, color: "#f5f5f0" },
  { id: "natural", label: "Natural Wood", upcharge: 4000, color: "#c4a882" },
  { id: "walnut", label: "Walnut", upcharge: 4500, color: "#5c3d2e" },
  { id: "float", label: "Gallery Float", upcharge: 5500, color: "#2a2a2a" },
]

// ── Mats ──
export const MATS: MatOption[] = [
  { id: "none", label: "No Mat", upcharge: 0 },
  { id: "white", label: "White Mat", upcharge: 1000 },
  { id: "offwhite", label: "Off-White Mat", upcharge: 1000 },
]

// ── Aspect Ratios ──
export const ASPECT_RATIOS: Record<string, { width: number; height: number; label: string }> = {
  "3:4": { width: 768, height: 1024, label: "Portrait" },
  "1:1": { width: 1024, height: 1024, label: "Square" },
  "4:3": { width: 1024, height: 768, label: "Landscape" },
  "16:9": { width: 1024, height: 576, label: "Wide" },
}

// ── Product Variant Mapping (mock) ──
export const PRODUCT_VARIANTS: ProductVariantMapping[] = (() => {
  const variants: ProductVariantMapping[] = []
  let counter = 1
  const sizes = ["8x10", "12x16", "16x20", "18x24", "24x36"]
  const mediums = ["paper", "canvas", "acrylic"]
  const frames = ["none", "black"]
  for (const size of sizes) {
    for (const medium of mediums) {
      for (const frame of frames) {
        const s = SIZES.find((x) => x.id === size)!
        const m = MEDIUMS.find((x) => x.id === medium)!
        const f = FRAMES.find((x) => x.id === frame)!
        variants.push({
          size,
          medium,
          frame,
          shopifyVariantId: `gid://shopify/ProductVariant/${10000 + counter}`,
          printfulVariantId: 3000 + counter,
          price: s.basePrice + m.upcharge + f.upcharge,
        })
        counter++
      }
    }
  }
  return variants
})()

// ── Gallery Items ──
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gallery-1",
    url: "/images/gallery/art-1.jpg",
    title: "Golden Hour Abstraction",
    style: "abstract",
    subject: "landscapes",
    palette: "warm-sunset",
    prompt: "Abstract painting with warm sunset tones, golden orange and coral",
  },
  {
    id: "gallery-2",
    url: "/images/gallery/art-2.jpg",
    title: "Calm Waters",
    style: "illustrated",
    subject: "landscapes",
    palette: "cool-ocean",
    prompt: "Serene ocean seascape, cool blue tones, calm waves",
  },
  {
    id: "gallery-3",
    url: "/images/gallery/art-3.jpg",
    title: "Earth Geometry",
    style: "minimal",
    subject: "geometric",
    palette: "earth-stone",
    prompt: "Minimalist geometric art, earth tones and neutral colors",
  },
  {
    id: "gallery-4",
    url: "/images/gallery/art-4.jpg",
    title: "Botanical Study",
    style: "illustrated",
    subject: "florals",
    palette: "botanical",
    prompt: "Lush botanical illustration, green leaves and flowers",
  },
  {
    id: "gallery-5",
    url: "/images/gallery/art-5.jpg",
    title: "Mountain Mist",
    style: "realistic",
    subject: "landscapes",
    palette: "warm-sunset",
    prompt: "Dramatic mountain landscape, misty peaks at golden hour",
  },
  {
    id: "gallery-6",
    url: "/images/gallery/art-6.jpg",
    title: "Dreamscape",
    style: "surreal",
    subject: "still-life",
    palette: "vibrant-pop",
    prompt: "Bold surrealist painting, dreamlike floating objects",
  },
  {
    id: "gallery-7",
    url: "/images/gallery/art-7.jpg",
    title: "Garden Roses",
    style: "realistic",
    subject: "florals",
    palette: "warm-sunset",
    prompt: "Elegant floral still life, roses and peonies in soft pastels",
  },
  {
    id: "gallery-8",
    url: "/images/gallery/art-8.jpg",
    title: "Cosmic Nebula",
    style: "abstract",
    subject: "space",
    palette: "cool-ocean",
    prompt: "Cosmic space nebula, deep blues and purples with star clusters",
  },
]

// ── Starting Concepts ──
export const STARTING_CONCEPTS: StartingConcept[] = [
  {
    id: "concept-1",
    title: "Golden retriever portrait",
    prompt: "A golden retriever dog, photorealistic portrait, soft natural lighting",
    styles: ["realistic"],
    subjects: ["animals"],
    moods: ["calm", "warm"],
  },
  {
    id: "concept-2",
    title: "Misty mountain range at dawn",
    prompt: "A misty mountain range at dawn with soft golden light breaking through clouds",
    styles: ["realistic", "illustrated"],
    subjects: ["landscapes"],
    moods: ["calm", "warm", "elegant"],
  },
  {
    id: "concept-3",
    title: "Serene botanical garden path",
    prompt: "A serene botanical garden path with lush green foliage and dappled sunlight",
    styles: ["illustrated", "realistic"],
    subjects: ["florals", "landscapes"],
    moods: ["calm", "fresh"],
  },
  {
    id: "concept-4",
    title: "Vintage camera still life",
    prompt: "A vintage film camera on a wooden table, warm afternoon light, photorealistic",
    styles: ["realistic"],
    subjects: ["still-life"],
    moods: ["warm", "elegant"],
  },
  {
    id: "concept-5",
    title: "Cozy still life with warm light",
    prompt: "A cozy still life arrangement with books, coffee, and flowers in warm afternoon light",
    styles: ["realistic", "illustrated"],
    subjects: ["still-life"],
    moods: ["warm", "elegant"],
  },
  {
    id: "concept-6",
    title: "Modern architectural geometry",
    prompt: "Modern architectural forms with dramatic shadows and clean geometric lines",
    styles: ["minimal", "realistic"],
    subjects: ["architecture", "geometric"],
    moods: ["bold", "elegant"],
  },
  {
    id: "concept-7",
    title: "Cozy still life with warm light",
    prompt: "A cozy still life arrangement with books, coffee, and flowers in warm afternoon light",
    styles: ["realistic", "illustrated"],
    subjects: ["still-life"],
    moods: ["warm", "elegant"],
  },
  {
    id: "concept-8",
    title: "Modern architectural geometry",
    prompt: "Modern architectural forms with dramatic shadows and clean geometric lines",
    styles: ["minimal", "realistic"],
    subjects: ["architecture", "geometric"],
    moods: ["bold", "elegant"],
  },
]

// ── Quiz Visual Options ──
export const PALETTE_OPTIONS = [
  { id: "warm-sunset" as const, label: "Warm Sunset", colors: ["#E8613C", "#F4A261", "#E9C46A", "#F2CC8F", "#FAE5C8"] },
  { id: "cool-ocean" as const, label: "Cool Ocean", colors: ["#264653", "#2A9D8F", "#5EADB7", "#89C5CC", "#BDE0E5"] },
  { id: "earth-stone" as const, label: "Earth & Stone", colors: ["#6B4226", "#A67C52", "#C4A882", "#D4C5A9", "#E8E0D0"] },
  { id: "botanical" as const, label: "Botanical", colors: ["#2D6A4F", "#40916C", "#52B788", "#95D5B2", "#D8F3DC"] },
  { id: "monochrome" as const, label: "Monochrome", colors: ["#1A1A1A", "#4A4A4A", "#7A7A7A", "#B0B0B0", "#E8E8E8"] },
  { id: "vibrant-pop" as const, label: "Vibrant Pop", colors: ["#E63946", "#457B9D", "#F4A261", "#2A9D8F", "#E9C46A"] },
]

export const STYLE_OPTIONS = [
  { id: "abstract" as const, label: "Abstract", image: "/images/gallery/art-1.jpg" },
  { id: "realistic" as const, label: "Realistic", image: "/images/gallery/art-5.jpg" },
  { id: "illustrated" as const, label: "Illustrated", image: "/images/gallery/art-4.jpg" },
  { id: "surreal" as const, label: "Surreal", image: "/images/gallery/art-6.jpg" },
  { id: "minimal" as const, label: "Minimal", image: "/images/gallery/art-3.jpg" },
  { id: "retro" as const, label: "Retro", image: "/images/gallery/art-8.jpg" },
]

export const SUBJECT_OPTIONS = [
  { id: "landscapes" as const, label: "Landscapes", image: "/images/gallery/art-5.jpg" },
  { id: "florals" as const, label: "Florals", image: "/images/gallery/art-7.jpg" },
  { id: "geometric" as const, label: "Geometric", image: "/images/gallery/art-3.jpg" },
  { id: "animals" as const, label: "Animals", image: "/images/gallery/art-4.jpg" },
  { id: "architecture" as const, label: "Architecture", image: "/images/gallery/art-3.jpg" },
  { id: "portraits" as const, label: "Portraits", image: "/images/gallery/art-7.jpg" },
  { id: "space" as const, label: "Space", image: "/images/gallery/art-8.jpg" },
  { id: "still-life" as const, label: "Still Life", image: "/images/gallery/art-6.jpg" },
]

export const MOOD_OPTIONS = [
  { id: "calm" as const, label: "Calm & Serene", image: "/images/gallery/art-2.jpg" },
  { id: "bold" as const, label: "Bold & Dramatic", image: "/images/gallery/art-6.jpg" },
  { id: "warm" as const, label: "Warm & Cozy", image: "/images/gallery/art-1.jpg" },
  { id: "fresh" as const, label: "Fresh & Energetic", image: "/images/gallery/art-4.jpg" },
  { id: "elegant" as const, label: "Elegant & Refined", image: "/images/gallery/art-7.jpg" },
  { id: "playful" as const, label: "Playful & Whimsical", image: "/images/gallery/art-8.jpg" },
]

export const ROOM_OPTIONS = [
  { id: "living-room" as const, label: "Living Room", image: "/images/rooms/living-room.jpg" },
  { id: "bedroom" as const, label: "Bedroom", image: "/images/rooms/bedroom.jpg" },
  { id: "office" as const, label: "Office", image: "/images/rooms/office.jpg" },
  { id: "dining" as const, label: "Dining Room", image: "/images/rooms/dining.jpg" },
  { id: "nursery" as const, label: "Nursery", image: "/images/rooms/nursery.jpg" },
  { id: "hallway" as const, label: "Hallway", image: "/images/rooms/hallway.jpg" },
]

// ── Pricing Helpers ──
export function calculatePrice(size: string, medium: string, frame: string, mat: string): number {
  const s = SIZES.find((x) => x.id === size)
  const m = MEDIUMS.find((x) => x.id === medium)
  const f = FRAMES.find((x) => x.id === frame)
  const mt = MATS.find((x) => x.id === mat)
  return (s?.basePrice ?? 0) + (m?.upcharge ?? 0) + (f?.upcharge ?? 0) + (mt?.upcharge ?? 0)
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function validateResolution(
  imageWidth: number,
  imageHeight: number,
  printSize: string
): { valid: boolean; needsUpscale: boolean; maxDpi: number } {
  const [printW, printH] = printSize.split("x").map(Number)
  const dpiW = imageWidth / printW
  const dpiH = imageHeight / printH
  const maxDpi = Math.min(dpiW, dpiH)
  return {
    valid: maxDpi >= 100,
    needsUpscale: maxDpi < 150,
    maxDpi: Math.round(maxDpi),
  }
}
