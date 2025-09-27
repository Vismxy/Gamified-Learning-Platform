import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar"
import { DynamicHtmlLang } from "@/components/i18n/dynamic-html-lang"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "STEM Gamify - Interactive Learning Platform",
  description: "Gamified STEM education platform for rural students grades 6-12",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#059669",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "STEM Gamify",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "STEM Gamify",
    title: "STEM Gamify - Interactive Learning Platform",
    description: "Gamified STEM education platform for rural students grades 6-12",
  },
  twitter: {
    card: "summary",
    title: "STEM Gamify - Interactive Learning Platform",
    description: "Gamified STEM education platform for rural students grades 6-12",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
      <head>
        <meta name="application-name" content="STEM Gamify" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="STEM Gamify" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192.jpg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192.jpg" />
        <link rel="shortcut icon" href="/icon-192.jpg" />
      </head>
      <body className="font-sans" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        <I18nProvider>
          <DynamicHtmlLang />
          <AccessibilityToolbar />
          <main id="main-content">{children}</main>
        </I18nProvider>
      </body>
    </html>
  )
}
