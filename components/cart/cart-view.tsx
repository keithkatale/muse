"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart, useStyleProfile } from "@/lib/contexts"
import { formatPrice } from "@/lib/mock-data"
import { trackLifecycle } from "@/lib/track-lifecycle"

export function CartView() {
  const router = useRouter()
  const { cart, removeItem, itemCount, totalPrice, clearCart } = useCart()
  const { profile } = useStyleProfile()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)

  const validateEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailStr)
  }

  // Initialize email on mount
  useEffect(() => {
    if (profile?.email) {
      setEmail(profile.email)
    } else {
      const stored = localStorage.getItem("muse-checkout-email")
      if (stored) {
        setEmail(stored)
      }
    }
  }, [profile])

  // If they leave the cart with items, start the abandoned-checkout drip.
  useEffect(() => {
    if (!cart?.items.length || !email || !validateEmail(email)) return
    const key = `muse-tracked-cart-${email.toLowerCase()}-${cart.id}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, "1")
    trackLifecycle({
      email,
      event: "started_checkout",
      items: cart.items,
      checkoutUrl: "/cart",
    })
  }, [cart, email])

  const handleEmailChange = (val: string) => {
    setEmail(val)
    if (emailError) {
      if (val.trim() === "") {
        setEmailError("Please enter your email to proceed to checkout")
      } else if (!validateEmail(val)) {
        setEmailError("Please enter a valid email address")
      } else {
        setEmailError(null)
      }
    }
    localStorage.setItem("muse-checkout-email", val)
  }

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return

    if (!email || email.trim() === "") {
      setEmailError("Please enter your email to proceed to checkout")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setEmailError(null)
    setIsCheckingOut(true)

    try {
      console.log("🛒 Initiating checkout for email:", email.trim())
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: cart.items,
          email: email.trim()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Checkout failed")
      }

      const data = await response.json()
      
      if (data.isMock) {
        console.warn("⚠️  Using mock checkout - Shopify not configured")
        router.push("/checkout-placeholder")
      } else {
        console.log("✅ Redirecting to Shopify checkout...")
        // Redirect to Shopify checkout
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setIsCheckingOut(false)
      alert(error instanceof Error ? error.message : "Failed to create checkout. Please try again.")
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-73px)]">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-32 text-center">
          <ShoppingBag className="mb-6 h-16 w-16 text-muted-foreground/30" />
          <h1 className="font-heading text-3xl tracking-tight text-foreground">
            Your cart is empty
          </h1>
          <p className="mt-3 text-muted-foreground">
            Create custom art and configure your perfect print to get started.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild>
              <Link href="/create">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/gallery">Browse Gallery</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px)]">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Shopping Cart
          </p>
          <h1 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </h1>
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Cart Items */}
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {cart.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex gap-4 rounded-lg border border-border bg-card p-4"
                >
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-base text-foreground">{item.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.size} &middot; {item.medium} &middot; {item.frame}
                        {item.mat !== "No Mat" ? ` \u00b7 ${item.mat}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-lg text-foreground">{formatPrice(item.price)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex items-center gap-4 pt-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/create">
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Continue Creating
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-fit rounded-lg border border-border bg-card p-6"
          >
            <h2 className="font-heading text-lg text-foreground">Order Summary</h2>

            <div className="mt-4 flex flex-col gap-2 border-b border-border pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span className="text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-accent font-medium">Free</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <span className="text-sm font-medium text-foreground">Total</span>
              <span className="font-heading text-2xl tracking-tight text-foreground">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Contact Email Field */}
            <div className="mt-6 border-t border-border pt-4">
              <label htmlFor="checkout-email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact Information
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                We'll send order confirmation and shipping updates to this email address.
              </p>
              <div className="mt-2.5 relative">
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="your-email@example.com"
                  className={`w-full rounded-md border bg-background px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                    emailError
                      ? "border-destructive text-destructive placeholder-destructive/40 focus:ring-destructive/10"
                      : "border-input text-foreground placeholder-muted-foreground focus:border-accent/50 focus:ring-accent/20"
                  }`}
                />
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-destructive font-medium"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              loading={isCheckingOut}
              size="lg"
              className="mt-6 w-full"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Secure checkout powered by Shopify. Accepts all major cards, Apple Pay, and Shop Pay.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
