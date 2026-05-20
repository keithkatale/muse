"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ScrollTiltedGrid, MUSE_GALLERY_IMAGES } from "./scroll-tilted-grid"
import { ArrowRight } from "lucide-react"

export function ImmersiveGallery() {
  return (
    <section className="relative border-t border-border/50 bg-[#FEF8F2] overflow-hidden">
      {/* Header */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 pt-24 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-muse-peach/60" />
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Gallery
            </p>
            <div className="w-12 h-px bg-muse-peach/60" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            Curated Art Collection
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Discover stunning artwork created by our AI and brought to life as museum-quality prints
          </p>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-muse-taupe hover:text-muse-brown transition-colors font-medium"
          >
            Browse Full Gallery
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Scroll Tilted Grid */}
      <ScrollTiltedGrid
        images={MUSE_GALLERY_IMAGES}
        loop={false}
        aspectRatio="3/4"
        maxWidth="2xl"
        gap={8}
        perspective={1000}
        maxTilt={60}
        maxBlur={6}
        rounded="0.75rem"
        className="bg-gradient-to-b from-transparent via-[#FEF8F2]/50 to-[#FEF8F2]"
      />

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-muse-peach/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-muse-taupe/10 rounded-full blur-3xl" />
      </div>
    </section>
  )
}