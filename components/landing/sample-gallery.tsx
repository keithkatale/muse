"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { GALLERY_ITEMS } from "@/lib/mock-data"

// Landing page: show images from pick-2 and pick-3 only (3 from each)
const pick2 = GALLERY_ITEMS.filter((item) => item.url.includes("/pick-2/"))
const pick3 = GALLERY_ITEMS.filter((item) => item.url.includes("/pick-3/"))
const LANDING_GALLERY_ITEMS = [
  ...pick2.slice(0, 3),
  ...pick3.slice(0, 3),
]

export function SampleGallery() {
  const items = LANDING_GALLERY_ITEMS

  return (
    <section className="py-24 sm:py-32 border-t border-border/50 bg-[hsl(40,25%,98%)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div className="flex items-baseline gap-4">
            <div className="w-8 h-px bg-accent/40" />
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Gallery
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            Browse all →
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
