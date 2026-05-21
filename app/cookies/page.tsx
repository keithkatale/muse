import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | Muse",
  description: "How Muse uses cookies and how you can manage your preferences.",
}

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Legal</p>
      <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-6">Cookie Policy</h1>
      <div className="space-y-6 text-sm leading-relaxed text-[#947A5D]">
        <p>
          Muse uses cookies and similar technologies to provide core features, remember your
          preferences, and — if you consent — understand how visitors use our site.
        </p>

        <section>
          <h2 className="font-heading text-xl text-[#564738] mb-2">Essential cookies</h2>
          <p>
            These are required for the site to function. They may store your cart contents, style
            quiz progress, and cookie consent choice. They cannot be disabled while using Muse.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-[#564738] mb-2">Optional cookies</h2>
          <p>
            With your permission, we may use analytics cookies to measure traffic and improve our
            product. If you choose &ldquo;Essential only,&rdquo; these cookies will not be set.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl text-[#564738] mb-2">Managing preferences</h2>
          <p>
            You can change your choice at any time by clearing site data for Muse in your browser,
            or contact us if you need help. When you return, the cookie banner will appear again so
            you can set a new preference.
          </p>
        </section>

        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      <Link
        href="/"
        className="mt-10 inline-block text-sm font-medium text-[#564738] hover:text-muse-taupe transition-colors"
      >
        &larr; Back to home
      </Link>
    </div>
  )
}
