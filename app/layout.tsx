import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import localFont from "next/font/local"
import { Toaster } from "sonner"

import "./globals.css"
import { Providers } from "@/components/providers"
import { SiteHeader } from "@/components/site-header"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const appleGaramond = localFont({
  src: [
    {
      path: "../public/Font/AppleGaramond-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/Font/AppleGaramond.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/Font/AppleGaramond-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/Font/AppleGaramond-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/Font/AppleGaramond-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
})

const appleGaramondHeading = localFont({
  src: "../public/Font/AppleGaramond-LightItalic.ttf",
  weight: "300",
  style: "italic",
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Muse — AI-Powered Wall Art",
  description:
    "Create custom wall art with AI. Discover your style, generate unique artwork, and order museum-quality prints delivered to your door.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${appleGaramond.variable} ${appleGaramondHeading.variable}`}>
      <body className="font-serif antialiased">
        <Providers>
          <SiteHeader />
          <main>{children}</main>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}
