"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32 border-t border-border/50 overflow-hidden">
      {/* Soft gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-xl px-6 sm:px-8 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-base text-muted-foreground mb-8"
        >
          Your masterpiece is <span className="italic text-foreground">waiting</span>.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-sm px-10 h-12 text-sm font-normal tracking-wide border-foreground/25 hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
          >
            <Link href="/discover">Begin</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
