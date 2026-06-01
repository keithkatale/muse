import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Muse",
  description: "Learn how Muse collects, uses, and protects your personal and style data.",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Legal</p>
      <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-6">Privacy Policy</h1>
      <div className="space-y-8 text-sm leading-relaxed text-[#947A5D]">
        <p>
          At Muse, we are committed to protecting your privacy. This Privacy Policy explains how we collect, 
          use, and safeguard your personal information when you use our website, style onboarding quiz, 
          and art generation services.
        </p>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-[#564738]">1. Information We Collect</h2>
          <p>
            We collect information to deliver custom generated art and physical premium frames to your home. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[#564738]">Personal Information:</strong> We collect your email address when you complete the 
              Style Quiz. This allows us to link your style preferences to your account and send your generated artwork to you.
            </li>
            <li>
              <strong className="text-[#564738]">Style Profile:</strong> We collect and save your responses from the Style Quiz 
              (color palettes, styles, subjects, mood, room type, and orientation) to customize your art generation experience.
            </li>
            <li>
              <strong className="text-[#564738]">Generated Images:</strong> We store prompts, concepts, and images generated via our AI 
              engine, as well as configuration choices (frame styles, sizes, and mat preferences) you configure.
            </li>
            <li>
              <strong className="text-[#564738]">Transaction Data:</strong> Payment details are processed directly and securely by 
              Shopify or Stripe. We do not store your credit card details or payment credentials on our servers.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-[#564738]">2. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To run custom-tailored generative AI art models and render live mockups on wall backdrops.</li>
            <li>To manufacture, print, inspect, frame, and ship physical custom products ordered through our checkout flow.</li>
            <li>To email you links to your generated artwork galleries, style profile summaries, and transaction updates.</li>
            <li>To analyze and optimize the loading performance, usability, and visual quality of the Muse platform.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-[#564738]">3. Data Sharing & Third Parties</h2>
          <p>
            We will never sell or rent your personal data. To provide our core services, we work with trusted partners under strict confidentiality:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[#564738]">Generative AI APIs:</strong> Prompts and concepts are processed via machine learning APIs (like fal.ai) to generate the images. No personally identifiable data is sent to these models.
            </li>
            <li>
              <strong className="text-[#564738]">E-commerce & Fulfillment:</strong> Order addresses, customer names, and chosen configurations are securely integrated with Shopify and our manufacturing partners to print, assemble, and deliver your framed art.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-[#564738]">4. Data Security</h2>
          <p>
            We implement high-grade administrative and electronic security measures (such as SSL encryption, sanitized databases, and tokenized APIs) designed to secure your personal data from accidental loss, misuse, or unauthorized access.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl text-[#564738]">5. Your Rights</h2>
          <p>
            Depending on your location (e.g. under GDPR or CCPA), you hold the right to access, download, correct, or request the complete deletion of your personal email or generated gallery history. To request data deletion, please contact us at <span className="text-[#564738] font-medium">hello@muse.art</span>.
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
