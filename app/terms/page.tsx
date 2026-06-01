import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | Muse",
  description: "Terms and conditions governing the use of the Muse generative art platform and custom framed prints store.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Legal</p>
      <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-6">Terms & Conditions</h1>
      <div className="space-y-8 text-sm leading-relaxed text-[#947A5D]">
        <p>
          Welcome to Muse. These Terms & Conditions govern your access to and use of our platform, 
          AI style discovery services, custom image generation systems, and purchase of physical custom framed prints. 
          By browsing or purchasing from Muse, you agree to comply with and be bound by these terms.
        </p>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-[#564738]">1. Service Description</h2>
          <p>
            Muse is an online studio and marketplace that allows you to discover your style, generate 
            custom digital artwork using state-of-the-art AI systems, preview them on digital room mockups, 
            and purchase customized museum-quality physical prints, complete with optional solid wood frames, mats, 
            and mounting finishes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-[#564738]">2. AI Art Generation & Content Guidelines</h2>
          <p>
            Art generation is powered by dynamic machine learning engines. By inputting text or selecting options, you agree to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Not submit harmful, abusive, harassing, copyright-infringing, or sexually explicit content keywords.</li>
            <li>Acknowledge that AI-generated visual patterns might contain unpredictability, unique aesthetic structures, or minor layout variances.</li>
            <li>Agree that Muse reserves the right to filter prompts, terminate generation tasks, and deny service if safety limits are crossed.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-[#564738]">3. Intellectual Property & Commercial Licenses</h2>
          <p>
            We believe in creative freedom:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[#564738]">Personal & Digital Use:</strong> You retain the full right to download, display, and share your generated low-resolution digital works for personal, non-commercial purposes.
            </li>
            <li>
              <strong className="text-[#564738]">Commercial Use of Prints:</strong> Upon ordering a physical framed print, you are granted a lifetime, non-exclusive, worldwide license to display that physical customized piece in residential or commercial settings. 
            </li>
            <li>
              <strong className="text-[#564738]">Brand Assets:</strong> The Muse logos, website structures, code, CSS, sliding-window canvas coordinates, onboarding system patterns, and custom font configurations remain the exclusive property of Muse.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-[#564738]">4. Ordering, Printing, and Shipping</h2>
          <p>
            Because each print order is custom manufactured, fitted, and framed individually to order, the following purchase rules apply:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[#564738]">Pricing and Payments:</strong> Prices are computed based on custom dimension limits, frames, mats, and materials. All orders are verified via Shopify or Stripe prior to custom fabrication.
            </li>
            <li>
              <strong className="text-[#564738]">Sales are Final:</strong> Since products are fully customized to your specific style and choice, we cannot accept returns or offer refunds for changes of mind.
            </li>
            <li>
              <strong className="text-[#564738]">Transit Damages:</strong> If your print arrives with damaged frame joints, broken plexiglass, or print scratches, please submit photographic evidence to <span className="text-[#564738] font-medium">hello@muse.art</span> within 14 days of delivery. We will immediately manufacture and ship a free replacement print to you.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-[#564738]">5. Limitation of Liability</h2>
          <p>
            Muse is provided &ldquo;as is&rdquo; without warranties of any kind, either express or implied. 
            We do not warrant that service will be fully uninterrupted, error-free, or that generated AI content will always match subjective stylistic expectations. In no event shall Muse be liable for any indirect, consequential, or incidental damages.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border/30">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      <Link
        href="/"
        className="mt-12 inline-block text-sm font-medium text-[#564738] hover:text-muse-taupe transition-colors"
      >
        &larr; Back to home
      </Link>
    </div>
  )
}
