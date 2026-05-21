"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "10,000+", label: "Artworks created" },
  { value: "Museum", label: "Quality prints" },
  { value: "2–3 days", label: "Delivery" },
]

export function CtaSection() {
  return (
    <section className="bg-[#564738] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-[#F6CDA1]/20 bg-[#FEF8F2]/5 px-6 py-8 text-center sm:px-8"
            >
              <p className="font-heading text-3xl sm:text-4xl text-[#FEF8F2]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-[#F6CDA1]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-14 sm:mt-20"
        >
          <div className="mx-auto max-w-2xl rounded-[24px] border border-[#F6CDA1]/25 bg-[#FEF8F2]/[0.06] px-8 py-12 text-center sm:px-12 sm:py-14">
            <h2 className="font-heading text-3xl sm:text-4xl text-[#FEF8F2] leading-tight">
              Your masterpiece is waiting
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#F6CDA1] sm:text-lg">
              Start your artistic journey today and transform your space with personalized wall art.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" variant="dark">
                <Link href="/discover">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
