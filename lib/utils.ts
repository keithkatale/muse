import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function aspectRatioClass(ratio: string): string {
  const map: Record<string, string> = {
    "3:4": "aspect-[3/4]",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "16:9": "aspect-video",
  }
  return map[ratio] ?? "aspect-[3/4]"
}
