"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Palette, Sparkles, Settings, Truck, ArrowRight } from "lucide-react"

const steps = [
  {
    n: "01",
    title: "Discover Your Style",
    description: "Take our interactive quiz to uncover your unique aesthetic preferences and artistic taste.",
    href: "/discover",
    icon: Palette,
    image: "/images/pick-2/abstract.png",
    color: "from-purple-500/20 to-pink-500/20",
    accent: "text-purple-600"
  },
  {
    n: "02", 
    title: "Describe Your Vision",
    description: "Use AI-powered prompts to bring your creative ideas to life with stunning generated artwork.",
    href: "/create",
    icon: Sparkles,
    image: "/images/gallery/art-3.jpg",
    color: "from-blue-500/20 to-cyan-500/20",
    accent: "text-blue-600"
  },
  {
    n: "03",
    title: "Configure Your Print",
    description: "Choose from premium materials, sizes, and frames to create museum-quality wall art.",
    href: "/create",
    icon: Settings,
    image: "/preview/bedroom.jpg",
    color: "from-green-500/20 to-emerald-500/20",
    accent: "text-green-600"
  },
  {
    n: "04",
    title: "Delivered to Your Door",
    description: "Receive your custom artwork professionally printed and ready to transform your space.",
    href: "/discover",
    icon: Truck,
    image: "/preview/living.png",
    color: "from-orange-500/20 to-red-500/20",
    accent: "text-orange-600"
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 sm:py-32 border-t border-border/50 bg-gradient-to-b from-background to-[hsl(40,30%,99%)]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-accent/40" />
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              How it works
            </p>
            <div className="w-12 h-px bg-accent/40" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            From Vision to Wall Art
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your creative ideas into stunning wall art with our simple four-step process
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isEven = i % 2 === 0
            
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
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${step.color} border border-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-black/5`}>
                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-500">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40" />
                    </div>

                    {/* Content */}
                    <div className="relative p-8 sm:p-10">
                      {/* Step Number & Icon */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} border-2 border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-7 h-7 ${step.accent}`} />
                        </div>
                        <span className="font-serif text-4xl sm:text-5xl text-accent/60 group-hover:text-accent transition-colors duration-300">
                          {step.n}
                        </span>
                      </div>

                      {/* Text Content */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground group-hover:text-accent/90 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-base leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* CTA Arrow */}
                      <div className="mt-8 flex items-center gap-2 text-accent/70 group-hover:text-accent group-hover:gap-4 transition-all duration-300">
                        <span className="text-sm font-medium">Get Started</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-accent/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <Link
            href="/discover"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent/20 hover:bg-accent/30 text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Start Creating Your Art
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
