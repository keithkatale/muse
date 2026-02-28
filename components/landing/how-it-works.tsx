"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const steps = [
  { n: "1", text: "Discover your style", href: "/discover" },
  { n: "2", text: "Describe your vision", href: "/create" },
  { n: "3", text: "Configure your print", href: "/create" },
  { n: "4", text: "Delivered to your door", href: "/discover" },
]

export function HowItWorks() {
  return (
    <section className="py-24 sm:py-32 border-t border-border/50">
      <div className="mx-auto max-w-2xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-baseline gap-4 mb-16"
        >
          <div className="w-8 h-px bg-accent/40" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-baseline gap-6 group"
            >
              <span className="font-serif text-2xl text-accent/70 tabular-nums group-hover:text-accent transition-colors">
                {step.n}
              </span>
              <Link
                href={step.href}
                className="text-foreground hover:text-accent/80 transition-colors"
              >
                {step.text}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
