"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { STYLE_OPTIONS } from "@/lib/mock-data"

export function StyleShowcase() {
  return (
    <section className="py-24 sm:py-32 border-t border-border/50 bg-[hsl(40,25%,98%)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-baseline gap-4 mb-12"
        >
          <div className="w-8 h-px bg-accent/40" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Styles
          </p>
        </motion.div>

        {/* Same grid and card layout as Discover Step 2 (pick-2) */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {STYLE_OPTIONS.map((style, i) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href="/discover"
                className="group relative aspect-[4/5] overflow-hidden rounded-xl border-2 border-border block hover:border-accent/30 transition-all"
              >
                <Image
                  src={style.image}
                  alt={style.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                <span className="absolute bottom-4 left-4 font-serif text-lg text-background">
                  {style.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/discover"
            className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200"
          >
            Create in any style →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
