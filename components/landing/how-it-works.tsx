"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Palette, Sparkles, Settings, Truck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  {
    n: "01",
    title: "Discover Your Style",
    description:
      "Take our interactive quiz to uncover your unique aesthetic preferences and artistic taste.",
    href: "/discover",
    icon: Palette,
    image: "/images/pick-2/abstract.png",
  },
  {
    n: "02",
    title: "Describe Your Vision",
    description:
      "Use AI-powered prompts to bring your creative ideas to life with stunning generated artwork.",
    href: "/create",
    icon: Sparkles,
    image: "/images/gallery/art-3.jpg",
  },
  {
    n: "03",
    title: "Configure Your Print",
    description:
      "Choose from premium materials, sizes, and frames to create museum-quality wall art.",
    href: "/create",
    icon: Settings,
    image: "/preview/bedroom.jpg",
  },
  {
    n: "04",
    title: "Delivered to Your Door",
    description:
      "Receive your custom artwork professionally printed and ready to transform your space.",
    href: "/discover",
    icon: Truck,
    image: "/preview/living.png",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 sm:py-32 border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-muse-peach/60" />
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              How it works
            </p>
            <div className="w-12 h-px bg-muse-peach/60" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            From Vision to Wall Art
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your creative ideas into stunning wall art with our simple four-step process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, i) => {
            const Icon = step.icon

            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group"
              >
                <Link href={step.href} className="block">
                  <div className="relative overflow-hidden rounded-2xl bg-muse-selected/30 border border-muse-peach/30 hover:border-muse-peach transition-all duration-500 hover:shadow-lg hover:shadow-muse-brown/5">
                    <div className="absolute inset-0 opacity-25 group-hover:opacity-35 transition-opacity duration-500">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50" />
                    </div>

                    <div className="relative p-8 sm:p-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-muse-peach border-2 border-muse-floral flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-muse-brown" />
                        </div>
                        <span className="font-heading text-4xl sm:text-5xl text-muse-taupe/70 group-hover:text-muse-brown transition-colors duration-300">
                          {step.n}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-heading text-2xl sm:text-3xl text-foreground group-hover:text-muse-brown transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-base leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      <div className="mt-8 flex items-center gap-2 text-muse-taupe group-hover:text-muse-brown group-hover:gap-4 transition-all duration-300">
                        <span className="text-sm font-medium">Get Started</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <Button asChild size="lg">
            <Link href="/discover">
              Start Creating Your Art
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
