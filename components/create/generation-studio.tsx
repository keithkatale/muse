"use client"

import { motion } from "framer-motion"
import { useGeneration } from "@/lib/contexts"
import { PromptPanel } from "./prompt-panel"
import { ResultsPanel } from "./results-panel"

export function GenerationStudio() {
  const { isGenerating } = useGeneration()

  return (
    <div className="min-h-[calc(100vh-73px)]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl text-balance">
            AI Art Generation Studio
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create stunning artwork with AI-powered image generation
          </p>
        </motion.div>

        <div className="mt-6 md:mt-10 flex flex-col gap-6 md:gap-10 lg:grid lg:grid-cols-[400px_1fr]">
          <PromptPanel />
          <ResultsPanel />
        </div>
      </div>
    </div>
  )
}
