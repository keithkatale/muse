"use client"

import * as React from "react"
import { ArrowUp, Loader2, Plus, X } from "lucide-react"
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
  onFocusChange,
  className,
}: MusePromptBoxProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const optionsRef = React.useRef<HTMLDivElement>(null)
  const [optionsOpen, setOptionsOpen] = React.useState(false)
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

  React.useEffect(() => {
    if (!optionsOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (
        optionsRef.current?.contains(target) ||
        (e.target as HTMLElement).closest?.("[data-options-trigger]")
      ) {
        return
      }
      setOptionsOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [optionsOpen])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (canSend) onSend()
    }
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget ||
      !(e.target as HTMLElement).closest("button, textarea, [data-options-panel]")
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
        "relative z-10 flex cursor-text items-end gap-1.5 rounded-[28px] border border-muse-taupe/15 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-colors focus-within:border-muse-peach/40 focus-within:ring-2 focus-within:ring-muse-peach/20",
        className
      )}
    >
      <button
        type="button"
        data-options-trigger
        disabled={busy}
        aria-expanded={optionsOpen}
        aria-label={optionsOpen ? "Close aspect ratio options" : "Open aspect ratio options"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOptionsOpen((open) => !open)}
        className={cn(
          "mb-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muse-peach/40",
          optionsOpen
            ? "border-muse-peach bg-muse-peach text-muse-brown"
            : "border-muse-taupe/20 bg-muse-floral/60 text-muted-foreground hover:border-muse-taupe/40 hover:text-foreground",
          busy && "cursor-not-allowed opacity-60"
        )}
      >
        {optionsOpen ? (
          <X className="size-4" strokeWidth={2.25} />
        ) : (
          <Plus className="size-4" strokeWidth={2.25} />
        )}
      </button>

      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={busy}
        className={cn(
          "min-h-9 max-h-40 w-full flex-1 resize-none border-0 bg-transparent px-1 py-2 text-sm leading-5 text-foreground placeholder:text-muted-foreground/60",
          "focus:ring-0 focus-visible:outline-none",
          busy && "cursor-not-allowed opacity-60"
        )}
      />

      <button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        aria-label={isGenerating ? "Generating" : "Generate"}
        className={cn(
          "mb-0.5 flex size-8 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muse-peach/40",
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

      {optionsOpen && (
        <div
          ref={optionsRef}
          data-options-panel
          className="absolute bottom-full left-0 z-20 mb-2 w-[min(100%,18rem)] rounded-2xl border border-muse-taupe/15 bg-white p-3 shadow-lg"
        >
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Aspect ratio
          </p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(ASPECT_RATIOS).map(([key, val]) => {
              const selected = aspectRatio === key
              return (
                <button
                  key={key}
                  type="button"
                  disabled={busy}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onAspectRatioChange(key)
                    setOptionsOpen(false)
                  }}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-medium transition-all",
                    selected
                      ? "border border-muse-peach bg-muse-peach text-muse-brown shadow-sm font-semibold"
                      : "border border-muse-taupe/15 bg-muse-floral/60 text-muted-foreground hover:bg-white hover:text-foreground"
                  )}
                >
                  {val.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
