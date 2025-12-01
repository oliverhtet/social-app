import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

// IMPORT: The client-side Providers component (required for React Query context)
import { Providers } from "./providers" 

import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Social Media Platform",
  description: "Connect with friends, share your thoughts, and engage with a community",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Apply font classes to the body */}
      <body className={`${_geist.className} font-sans antialiased`}>
        {/* Wrap children with the Providers component to ensure contexts (Auth, React Query) are available */}
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}