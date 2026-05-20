"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stats = [
  { value: "10,000+", label: "Artworks created" },
  { value: "Museum", label: "Quality prints" },
  { value: "2–3 days", label: "Delivery" },
]

export function CtaSection() {
  return (
    <section
      className="muse-cta-section border-t border-[#564738]/30 py-24 sm:py-32"
      style={{ backgroundColor: "#564738" }}
    >
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        {/* Metrics */}
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
                i > 0 && "sm:border-l sm:border-[#F6CDA1]/30"
              )}
            >
              <p className="font-heading text-2xl sm:text-3xl text-[#FEF8F2]">
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-[#F6CDA1]/80">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 text-center"
        >
          <p className="font-heading text-2xl sm:text-3xl text-[#FEF8F2] mb-3">
            Your masterpiece is <span className="italic">waiting</span>.
          </p>
          <p className="mb-8 max-w-lg mx-auto text-sm sm:text-base text-[#F6CDA1]/90">
            Start your artistic journey today and transform your space with personalized wall art.
          </p>
          <Button asChild size="lg" variant="dark">
            <Link href="/discover">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
