"use client"

import * as React from "react"
import { ArrowUp, Loader2 } from "lucide-react"
import { ASPECT_RATIOS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export type MusePromptBoxProps = {
  value: string
  onValueChange: (value: string) => void
  onSend: () => void
  isGenerating?: boolean
  isInitializing?: boolean
  disabled?: boolean
  placeholder?: string
  aspectRatio: string
  onAspectRatioChange: (ratio: string) => void
  quality: "standard" | "premium"
  onQualityChange: (quality: "standard" | "premium") => void
  onFocusChange?: (focused: boolean) => void
  className?: string
}

export function MusePromptBox({
  value,
  onValueChange,
  onSend,
  isGenerating = false,
  isInitializing = false,
  disabled = false,
  placeholder = "Describe your artwork…",
  aspectRatio,
  onAspectRatioChange,
  quality,
  onQualityChange,
  onFocusChange,
  className,
}: MusePromptBoxProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const busy = disabled || isGenerating || isInitializing
  const canSend = value.trim().length > 0 && !busy

  const handleWrapperFocus = () => onFocusChange?.(true)
  const handleWrapperBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (wrapperRef.current?.contains(e.relatedTarget as Node)) return
    onFocusChange?.(false)
  }

  React.useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    const next = Math.min(textarea.scrollHeight, 160)
    textarea.style.height = `${next}px`
    textarea.style.overflowY = textarea.scrollHeight > 160 ? "auto" : "hidden"
  }, [value, isInitializing])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (canSend) onSend()
    }
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget ||
      !(e.target as HTMLElement).closest("button, textarea")
    ) {
      textareaRef.current?.focus()
    }
  }

  if (isInitializing) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-[28px] border border-muse-taupe/15 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm",
          className
        )}
      >
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muse-taupe" />
        <p className="text-xs text-muted-foreground">Drafting your prompt from quiz selections…</p>
      </div>
    )
  }

  return (
    <div
      ref={wrapperRef}
      onClick={handleContainerClick}
      onFocus={handleWrapperFocus}
      onBlur={handleWrapperBlur}
      className={cn(
        "relative z-10 flex cursor-text flex-col rounded-[28px] border border-muse-taupe/15 bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-colors focus-within:border-muse-peach/40 focus-within:ring-2 focus-within:ring-muse-peach/20",
        className
      )}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={busy}
        className={cn(
          "min-h-11 w-full resize-none border-0 bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground/60",
          "focus:ring-0 focus-visible:outline-none",
          busy && "cursor-not-allowed opacity-60"
        )}
      />

      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 p-1 pt-0">
        <div className="flex items-center gap-0.5 rounded-full border border-muse-taupe/20 bg-muse-floral/60 p-0.5">
          {Object.entries(ASPECT_RATIOS).map(([key, val]) => {
            const selected = aspectRatio === key
            return (
              <button
                key={key}
                type="button"
                disabled={busy}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onAspectRatioChange(key)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-medium transition-all sm:px-3",
                  selected
                    ? "border border-muse-peach bg-muse-peach text-muse-brown shadow-sm font-semibold"
                    : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
                )}
              >
                {val.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-0.5 rounded-full border border-muse-taupe/20 bg-muse-floral/60 p-0.5">
          {(["standard", "premium"] as const).map((q) => {
            const selected = quality === q
            return (
              <button
                key={q}
                type="button"
                disabled={busy}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onQualityChange(q)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-medium capitalize transition-all sm:px-3",
                  selected
                    ? "border border-muse-peach bg-muse-peach text-muse-brown shadow-sm font-semibold"
                    : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
                )}
              >
                {q}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          aria-label={isGenerating ? "Generating" : "Generate"}
          className={cn(
            "ml-auto flex size-8 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muse-peach/40",
            canSend
              ? "bg-muse-peach text-muse-brown hover:bg-muse-selected"
              : "bg-muse-floral text-muted-foreground/50"
          )}
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowUp className="size-4" strokeWidth={2.25} />
          )}
        </button>
      </div>
    </div>
  )
}
