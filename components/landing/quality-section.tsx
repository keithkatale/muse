"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const stats = [
  { value: "10,000+", label: "Artworks created" },
  { value: "Museum", label: "Quality prints" },
  { value: "2–3 days", label: "Delivery" },
]

export function QualitySection() {
  return (
    <section className="py-24 sm:py-32 border-t border-border/50">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:justify-center gap-12 sm:gap-0"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={cn(
                "text-center sm:px-12",
                i > 0 && "sm:border-l sm:border-accent/20"
              )}
            >
              <p className="font-serif text-2xl sm:text-3xl text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
