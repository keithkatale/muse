"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// 10 art images arranged around the headline
const HERO_IMAGES = [
  "/preview/bedroom.jpg",
  "/images/gallery/art-5.jpg",
  "/images/gallery/art-1.jpg",
  "/images/gallery/art-3.jpg",
  "/images/pick-3/architecture.png",
  "/images/gallery/art-6.jpg",
  "/images/gallery/art-8.jpg",
  "/images/pick-3/landscape.png",
  "/preview/living.png",
  "/preview/dining.jpg",
]

const CARD_COUNT = 10
const CARD_RADIUS = 300
const CARD_SIZE = 120
const START_ANGLE = -90
const CARD_POSITIONS = Array.from({ length: CARD_COUNT }, (_, i) => ({
  angle: START_ANGLE + (360 / CARD_COUNT) * i,
  radius: CARD_RADIUS,
  size: CARD_SIZE,
}))

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius }
}

function outwardRotation(angleDeg: number) {
  return angleDeg + 90
}

export function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center px-6">
      {/* Floating cards layer */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="relative h-full w-full">
            {CARD_POSITIONS.map((pos, i) => {
              const { x, y } = polar(pos.angle, pos.radius)
              const baseRot = outwardRotation(pos.angle)
              const src = HERO_IMAGES[i % HERO_IMAGES.length]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.6, x: "-50%", y: "-50%" }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: `calc(-50% + ${x}px)`,
                    y: [`calc(-50% + ${y - 6}px)`, `calc(-50% + ${y + 6}px)`, `calc(-50% + ${y - 6}px)`],
                    rotate: [baseRot - 1.5, baseRot + 1.5, baseRot - 1.5],
                  }}
                  transition={{
                    opacity: { duration: 0.8, delay: 0.05 * i },
                    scale: { duration: 0.8, delay: 0.05 * i, type: "spring", stiffness: 80, damping: 14 },
                    x: { duration: 0.8, delay: 0.05 * i, type: "spring", stiffness: 80, damping: 14 },
                    y: { duration: 6 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: 0.05 * i },
                    rotate: { duration: 7 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: 0.05 * i },
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: pos.size,
                    height: pos.size,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(86,71,56,0.12)] ring-1 ring-muse-brown/10">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="140px"
                      className="object-cover"
                      priority={i < 4}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
      </div>

      {/* Mobile: simpler scattered cards */}
      <div className="pointer-events-none absolute inset-0 md:hidden">
          {HERO_IMAGES.slice(0, 4).map((src, i) => {
            const positions = [
              { top: "8%", left: "6%", rotate: -8, size: 70 },
              { top: "12%", right: "8%", rotate: 10, size: 80 },
              { bottom: "10%", left: "10%", rotate: 12, size: 75 },
              { bottom: "8%", right: "6%", rotate: -10, size: 70 },
            ]
            const p = positions[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, rotate: [p.rotate - 1, p.rotate + 1, p.rotate - 1] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.1 * i },
                  scale: { duration: 0.6, delay: 0.1 * i },
                  rotate: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{ position: "absolute", width: p.size, height: p.size, ...p }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl shadow-md ring-1 ring-muse-brown/10">
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </div>
              </motion.div>
            )
          })}
      </div>

      {/* Center content */}
      <div className="relative z-10 mx-auto max-w-xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground leading-[1.05]"
          >
            Art by you.
            <br />
            For your walls.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto"
          >
            Describe your style and automatically generate your art vision.
            Museum-quality prints delivered.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8 flex justify-center"
          >
            <Button asChild size="lg">
              <Link href="/discover">Get Started</Link>
            </Button>
          </motion.div>
      </div>
    </section>
  )
}
