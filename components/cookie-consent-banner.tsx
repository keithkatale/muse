"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { getStoredConsent, saveConsent, type CookieConsentChoice } from "@/lib/cookie-consent"

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getStoredConsent()
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const handleChoice = (choice: CookieConsentChoice) => {
    saveConsent(choice)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-3xl rounded-[20px] border border-[#E8DDD4] bg-muse-floral p-5 shadow-lg shadow-[#564738]/10 sm:p-6">
            <h2
              id="cookie-consent-title"
              className="font-heading text-lg sm:text-xl text-[#564738]"
            >
              Cookie preferences
            </h2>
            <p
              id="cookie-consent-description"
              className="mt-2 text-sm leading-relaxed text-[#947A5D]"
            >
              We use cookies to keep Muse working — for example, saving your cart and style quiz
              progress. Optional cookies help us understand how the site is used so we can improve
              your experience.{" "}
              <Link
                href="/cookies"
                className="font-medium text-[#564738] underline underline-offset-2 hover:text-muse-taupe"
              >
                Read our cookie policy
              </Link>
              .
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleChoice("essential")}
              >
                Essential only
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => handleChoice("all")}
              >
                Accept all
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
