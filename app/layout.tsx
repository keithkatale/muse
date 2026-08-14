import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import localFont from "next/font/local"
import { Toaster } from "sonner"
import Script from "next/script"

import "./globals.css"
import { Providers } from "@/components/providers"
import { SiteHeader } from "@/components/site-header"
import { CookieConsentBanner } from "@/components/cookie-consent-banner"

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
  src: "../public/Font/AppleGaramond.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Muse — AI-Powered Wall Art",
  description:
    "Create custom wall art with AI. Discover your style, generate unique artwork, and order museum-quality prints delivered to your door.",
  icons: {
    icon: [{ url: "/Vector.png", type: "image/png" }],
    apple: [{ url: "/Vector.png", type: "image/png" }],
    shortcut: ["/Vector.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${appleGaramond.variable} ${appleGaramondHeading.variable}`}>
      <body className="font-sans antialiased">
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3TYSGHZ6GY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3TYSGHZ6GY');
          `}
        </Script>

        {/* Klaviyo Onsite Tracking Tag */}
        <Script
          id="klaviyo-onsite"
          strategy="afterInteractive"
          src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID}`}
        />
        <Providers>
          <SiteHeader />
          <main>{children}</main>
          <Toaster position="bottom-right" />
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  )
}
