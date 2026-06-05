"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { 
    value: "10,000+", 
    label: "Artworks created by users", 
    icon: Sparkles 
  },
  { 
    value: "Museum Quality", 
    label: "Giclée prints with solid oak frames", 
    icon: Award 
  },
  { 
    value: "2–3 Days", 
    label: "Tracked shipping worldwide", 
    icon: Clock 
  },
]

const showcaseArtworks = [
  {
    image: "/images/gallery/art-1.jpg",
    title: "Ethereal Foliage",
    rotation: "-3deg",
    scaleClass: "scale-95",
    frameColor: "from-[#2f2219] to-[#1c120c]"
  },
  {
    image: "/images/pick-3/landscape.png",
    title: "Symphony of the Wilderness",
    rotation: "0deg",
    scaleClass: "scale-105 z-10",
    frameColor: "from-[#1a1410] to-[#0d0907]"
  },
  {
    image: "/images/gallery/art-8.jpg",
    title: "Interstellar Symphony",
    rotation: "3deg",
    scaleClass: "scale-95",
    frameColor: "from-[#3e2e25] to-[#261c16]"
  }
]

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5ECE1] to-[#EAE2D8] py-20 sm:py-28 border-t border-[#564738]/10">
      
      {/* Soft elegant warm ambient highlights */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#F6CDA1]/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#564738]/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        
        {/* Core Marketing Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#564738] leading-tight tracking-tight"
          >
            Your masterpiece is waiting.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-[#736253] max-w-xl mx-auto"
          >
            Describe your vision, refine your style, and transform your home with beautifully curated, custom-framed AI artwork.
          </motion.p>
        </div>

        {/* Real & Static Staggered Gallery Showcase */}
        <div className="mt-14 mb-16 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-4xl mx-auto items-center justify-center">
          {showcaseArtworks.map((art, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              style={{ rotate: art.rotation }}
              className={`relative mx-auto w-full max-w-[240px] aspect-[3/4] p-3.5 bg-gradient-to-br ${art.frameColor} rounded-md shadow-[0_15px_40px_rgba(86,71,56,0.18)] border-b-2 border-white/5 transition-transform duration-500 hover:scale-[1.07] ${art.scaleClass}`}
            >
              {/* Matte border - Passepartout */}
              <div className="relative w-full h-full p-4.5 bg-[#FCFAF5] rounded-xs flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
                {/* Artwork */}
                <div className="relative w-full h-full overflow-hidden rounded-xs shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)] bg-[#EAE2D8]">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="240px"
                    className="object-cover"
                    priority={index === 1}
                  />
                  {/* Glossy reflection shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.08] pointer-events-none mix-blend-overlay" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* High-Contrast Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-[#564738] text-[#FEF8F2] hover:bg-[#43372c] hover:text-[#FEF8F2] border-transparent shadow-md font-medium transition-all duration-300 group"
          >
            <Link href="/discover" className="flex items-center gap-2">
              Discover Your Style
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-[#564738]/25 text-[#564738] bg-white/40 hover:bg-white/80 transition-all duration-300 font-medium"
          >
            <Link href="/gallery">
              Browse Art Gallery
            </Link>
          </Button>
        </motion.div>

        {/* Polished Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 mt-20 border-t border-[#564738]/10 pt-16"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center px-4"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#564738]/10 bg-white/40 text-[#564738] shadow-xs">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-[#564738]">
                  {stat.value}
                </h3>
                <p className="mt-1 text-xs text-[#736253] leading-relaxed max-w-[200px]">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}


