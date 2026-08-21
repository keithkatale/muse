"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useCart } from "@/lib/contexts"
import { cn } from "@/lib/utils"
import { useState } from "react"

const NAV_LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/create", label: "Create" },
  { href: "/history", label: "History" },
  { href: "/gallery", label: "Gallery" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="inline-flex shrink-0 items-center opacity-90 hover:opacity-100 transition-opacity">
          <img
            src="/UI-elements/muse.svg"
            alt="Muse"
            width={88}
            height={22}
            className="h-[22px] w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-wide transition-colors",
                pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-muse-taupe"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Cart + checkout CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {itemCount > 0 && (
            <Link
              href="/cart"
              className={cn(
                "inline-flex items-center rounded-full bg-muse-brown px-3 py-1.5 text-xs font-medium tracking-wide text-muse-floral transition-colors hover:bg-muse-brown/90 sm:text-sm",
                pathname === "/cart" && "ring-2 ring-muse-brown/30 ring-offset-2 ring-offset-background"
              )}
            >
              Go to checkout
            </Link>
          )}
          <Link
            href="/cart"
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-muse-brown text-[10px] font-medium text-muse-floral">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background">
          <nav className="flex flex-col gap-4 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-sm tracking-wide transition-colors",
                  pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-muse-taupe transition-colors"
                )}
              >
                {link.label}
              </Link>
            ))}
            {itemCount > 0 && (
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex w-fit items-center rounded-full bg-muse-brown px-3 py-1.5 text-sm font-medium tracking-wide text-muse-floral transition-colors hover:bg-muse-brown/90"
              >
                Go to checkout
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
