"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-6 sm:px-8 lg:px-12 overflow-hidden">
      {/* Subtle warm wash — top right */}
      <div className="absolute top-0 right-0 w-[80%] sm:w-1/2 h-1/2 bg-gradient-to-bl from-accent/[0.04] to-transparent pointer-events-none" />
      {/* Soft accent dot */}
      <div className="absolute top-1/4 right-[15%] w-2 h-2 rounded-full bg-accent/20" />

      <div className="relative mx-auto max-w-2xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground leading-[1.1]"
        >
          Art by <span className="italic text-accent/90">you</span>.
          <br />
          <span className="text-muted-foreground font-normal">For your walls.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto"
        >
          Describe your vision. AI creates it. Museum-quality prints delivered.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          <div className="w-12 h-px bg-accent/30" />
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-sm px-8 h-12 text-sm font-normal tracking-wide border-foreground/25 hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
          >
            <Link href="/discover">Begin</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
