import Link from "next/link"
import { ShieldCheck, Truck, RefreshCw, Headphones, Store, CheckCircle2, Lock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-card text-card-foreground">
      {/* Polaris Trust & Guarantees Band */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-muted/25">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-foreground shadow-2xs">
                <Truck className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Priority Dispatch</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Complimentary delivery over $50</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-foreground shadow-2xs">
                <Lock className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Atomic Checkout</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">256-bit transactional security</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-foreground shadow-2xs">
                <RefreshCw className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">30-Day Guarantee</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Frictionless returns &amp; exchanges</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-foreground shadow-2xs">
                <Headphones className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Dedicated Merchant Care</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">24/7 technical and order support</p>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                <Store className="h-4 w-4" />
              </div>
              <span className="font-heading text-base font-bold tracking-tight text-foreground">
                LUMEN<span className="text-primary font-normal">STORE</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Enterprise commerce storefront built with Next.js 15, atomic inventory allocation, and Shopify Polaris design system principles.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Catalog Collections</h4>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  All Products
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Customer Support</h4>
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
                  Returns &amp; Warranty
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Privacy Policy &amp; Terms
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Infrastructure Status</h4>
            <p className="mt-3 text-xs text-muted-foreground">
              Real-time inventory engine with atomic sub-second transactions.
            </p>
            <div className="mt-3">
              <Badge variant="success" className="gap-1.5 py-1 px-2.5 text-[11px] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>All Systems Operational</span>
              </Badge>
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 1.3 / ISO 27001 Certified</span>
            </div>
          </div>
        </div>

        <Separator className="mt-10 mb-6 bg-slate-200 dark:bg-slate-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LumenStore Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-foreground cursor-pointer">Security Statement</span>
            <span>&bull;</span>
            <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-foreground cursor-pointer">Merchant API</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

