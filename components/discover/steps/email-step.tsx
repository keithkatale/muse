"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"

interface EmailStepProps {
  email: string
  onEmailChange: (email: string) => void
}

export function EmailStep({ email, onEmailChange }: EmailStepProps) {
  const [isValid, setIsValid] = useState(true)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (value: string) => {
    onEmailChange(value)
    if (value.length > 0) {
      setIsValid(validateEmail(value))
    } else {
      setIsValid(true)
    }
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
            Let's Create Your Art
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Enter your email to begin your personalized art creation journey. 
            We'll save your preferences and notify you when your artwork is ready.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Enter your email address"
              className={`w-full rounded-full border-2 px-6 py-4 text-center text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                !isValid
                  ? "border-red-300 bg-red-50 text-red-900 placeholder-red-400"
                  : "border-border bg-background text-foreground placeholder-muted-foreground focus:border-accent/50"
              }`}
            />
            {!isValid && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600"
              >
                Please enter a valid email address
              </motion.p>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            We respect your privacy. Your email will only be used to enhance your art creation experience.
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex flex-col items-center p-4 rounded-lg bg-muted/30">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mb-2">
              <span className="text-accent font-semibold">1</span>
            </div>
            <p className="text-muted-foreground">Personalized recommendations</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-muted/30">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mb-2">
              <span className="text-accent font-semibold">2</span>
            </div>
            <p className="text-muted-foreground">Save your preferences</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-muted/30">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mb-2">
              <span className="text-accent font-semibold">3</span>
            </div>
            <p className="text-muted-foreground">Track your creations</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}