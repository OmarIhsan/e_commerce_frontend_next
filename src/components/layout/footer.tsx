import Link from "next/link"
import { Sparkles, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      {/* Trust badging band */}
      <div className="border-b border-border/40 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Fast Delivery</p>
                <p className="text-[11px] text-muted-foreground">Free shipping over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Secure Checkout</p>
                <p className="text-[11px] text-muted-foreground">256-bit atomic encryption</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">30-Day Returns</p>
                <p className="text-[11px] text-muted-foreground">Hassle-free money back</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">24/7 Support</p>
                <p className="text-[11px] text-muted-foreground">Dedicated customer care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-black tracking-tight">
                LUMEN<span className="text-primary font-normal">STORE</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Modern high-speed e-commerce platform engineered with Next.js 15, sub-second caching, and atomic inventory transactions.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Shop</h4>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  All Catalog
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="hover:text-foreground transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=apparel" className="hover:text-foreground transition-colors">
                  Apparel
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-foreground transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Customer Service</h4>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/account" className="hover:text-foreground transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Shipping Policies
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Privacy &amp; Terms
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Status &amp; System</h4>
            <p className="mt-3 text-xs text-muted-foreground">
              Connected to high-performance Bun.js engine.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} LumenStore Inc. All rights reserved. Powered by Next.js 15 App Router.
        </div>
      </div>
    </footer>
  )
}
