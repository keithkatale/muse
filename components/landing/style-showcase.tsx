"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { GALLERY_ITEMS } from "@/lib/mock-data"

const styles = [
  "Abstract",
  "Realistic",
  "Illustrated",
  "Surreal",
  "Minimal",
]

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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {GALLERY_ITEMS.slice(0, 5).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Image
                src={item.url}
                alt={styles[i] || ""}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs uppercase tracking-widest text-white drop-shadow-sm">
                  {styles[i]}
                </span>
              </div>
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
            href="/create"
            className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200"
          >
            Create in any style →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
