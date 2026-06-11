import { cn } from "@/lib/utils"

/** Muse brand palette from design system */
export const brand = {
  peach: "#F6CDA1",
  brown: "#564738",
  floral: "#FEF8F2",
  taupe: "#947A5D",
  selected: "#FFE3C5",
  unselected: "#F5F5F5",
} as const

/** Quiz / configurator card selection (States spec) */
export function selectionCard(selected: boolean, className?: string) {
  return cn(
    "border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6CDA1]/40 focus-visible:ring-offset-2",
    selected
      ? "border-[#947A5D] bg-[#FFE3C5] text-[#564738] shadow-sm font-medium"
      : "border-[#E5E5E5] bg-[#F5F5F5] text-[#8E8E93] hover:border-[#947A5D]/40 hover:bg-[#FFE3C5]/20",
    className
  )
}

/** Configure page options — warm palette, visible borders */
export function configuratorSelectionCard(selected: boolean, className?: string) {
  return cn(
    "border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6CDA1]/40 focus-visible:ring-offset-2",
    selected
      ? "border-[#947A5D] bg-[#FFE3C5] text-[#564738] shadow-sm font-medium"
      : "border-[#E5E5E5] bg-[#F5F5F5] text-[#8E8E93] hover:border-[#947A5D]/40 hover:bg-[#FFE3C5]/20",
    className
  )
}

/** Image grid selection — peach stroke outline (3px solid #F6CDA1) */
export function selectionImage(selected: boolean, className?: string) {
  return cn(
    "border-[3px] transition-all duration-200",
    selected
      ? "border-[#F6CDA1] ring-2 ring-[#F6CDA1]/25"
      : "border-transparent hover:border-[#947A5D]/40",
    className
  )
}

/** Pill tag / chip selection */
export function selectionPill(selected: boolean, className?: string) {
  return cn(
    "rounded-full border px-3 py-1.5 text-xs transition-all duration-200",
    selected
      ? "border-[#947A5D] bg-[#FFE3C5] text-[#564738] font-medium"
      : "border-[#E5E5E5] bg-[#F5F5F5] text-[#8E8E93] hover:border-[#947A5D]/40 hover:bg-[#FFE3C5]/20",
    className
  )
}
