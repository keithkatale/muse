"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutPlaceholderPage() {
  return (
    <div className="min-h-[calc(100vh-73px)]">
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="font-heading text-3xl tracking-tight text-foreground">
            Shopify Checkout
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            In production, this page redirects to Shopify&#39;s hosted checkout where customers can
            securely enter their shipping address and payment information via Shop Pay, Apple Pay,
            or credit card.
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Payments secured by Shopify
          </div>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
