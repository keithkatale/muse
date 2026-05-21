import { cn } from "@/lib/utils"

/** Muse brand palette from design system */
export const brand = {
  peach: "#F6CDA1",
  brown: "#564738",
  floral: "#FEF8F2",
  taupe: "#947A5D",
  selected: "#FDE2C4",
  unselected: "#F2F2F2",
} as const

/** Quiz / configurator card selection (States spec) */
export function selectionCard(selected: boolean, className?: string) {
  return cn(
    "border-2 transition-all duration-200",
    selected
      ? "border-muse-peach bg-muse-selected text-foreground shadow-sm"
      : "border-transparent bg-muse-unselected text-muted-foreground hover:border-muse-peach/50",
    className
  )
}

/** Configure page options — warm palette, visible borders */
export function configuratorSelectionCard(selected: boolean, className?: string) {
  return cn(
    "border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muse-peach/40 focus-visible:ring-offset-2",
    selected
      ? "border-muse-peach bg-muse-selected text-[#564738] shadow-sm"
      : "border-[#E8DDD4] bg-muse-floral text-[#947A5D] hover:border-muse-peach hover:bg-muse-selected/50",
    className
  )
}

/** Image grid selection — peach stroke outline */
export function selectionImage(selected: boolean, className?: string) {
  return cn(
    "border-2 transition-all duration-200",
    selected
      ? "border-muse-peach ring-2 ring-muse-peach/25"
      : "border-transparent hover:border-muse-taupe/40",
    className
  )
}

/** Pill tag / chip selection */
export function selectionPill(selected: boolean, className?: string) {
  return cn(
    "rounded-full border-2 px-3 py-1.5 text-xs transition-all duration-200",
    selected
      ? "border-muse-peach bg-muse-selected text-foreground font-medium"
      : "border-transparent bg-muse-unselected text-muted-foreground hover:border-muse-peach/40",
    className
  )
}
