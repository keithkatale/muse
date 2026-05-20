import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { ImmersiveGallery } from "@/components/landing/immersive-gallery"
import { ArtShowcaseGallery } from "@/components/landing/art-showcase-gallery"
import { CtaSection } from "@/components/landing/cta-section"
import { FooterSection } from "@/components/landing/footer-section"

export const metadata = {
  title: "Muse — AI-Powered Wall Art",
  description:
    "Create custom wall art with AI. Discover your style, generate unique artwork, and order museum-quality prints delivered to your door.",
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ArtShowcaseGallery />
      <HowItWorks />
      <ImmersiveGallery />
      <CtaSection />
      <FooterSection />
    </div>
  )
}
