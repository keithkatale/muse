"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    title: "Discover your style",
    description:
      "Take our interactive quiz to uncover your unique aesthetic preferences and artistic taste.",
    href: "/discover",
    illustration: "/How it works section/discover your style.png",
  },
  {
    title: "Describe your vision",
    description:
      "Use AI-powered prompts to bring your creative ideas to life with stunning generated artwork.",
    href: "/create",
    illustration: "/How it works section/Describe your vision.png",
  },
  {
    title: "Configure your print",
    description:
      "Choose from premium materials, sizes, and frames to create museum-quality wall art.",
    href: "/create",
    illustration: "/How it works section/configure your print.png",
  },
  {
    title: "Delivered to your door",
    description:
      "Receive your custom artwork professionally printed and ready to transform your space.",
    href: "/discover",
    illustration: "/How it works section/delivered to your door.png",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-[#FEF8F2]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            How it works
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            From Vision to Wall Art
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your creative ideas into stunning wall art with our simple four-step process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={step.href} className="block group">
                <div className="bg-[#F6F0EA] rounded-[24px] h-full hover:shadow-lg hover:shadow-[#564738]/5 transition-all duration-300">
                  {/* Illustration image — contained with padding so it sits inside the card */}
                  <div className="flex items-center justify-center px-6 pt-6 pb-2 h-52">
                    <div className="relative w-full h-full">
                      <Image
                        src={step.illustration}
                        alt={step.title}
                        fill
                        className="object-contain object-center"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 sm:px-8 py-5">
                    <h3 className="font-heading text-xl sm:text-2xl text-[#564738] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#947A5D] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
