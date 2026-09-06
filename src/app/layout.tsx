import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartSheet } from "@/components/cart/cart-sheet"
import { getCurrentCustomer } from "@/actions/auth"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "LumenStore | High-Performance E-Commerce",
    template: "%s | LumenStore",
  },
  description:
    "Production-grade, consumer-facing e-commerce storefront powered by Next.js 15 App Router.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getCurrentCustomer()

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header customer={session.isAuthenticated ? session.customer : null} />
        <main className="flex-1">{children}</main>
        <CartSheet />
        <Footer />
      </body>
    </html>
  )
}
