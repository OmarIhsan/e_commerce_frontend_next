import Link from "next/link"
import { ProductCard } from "@/components/products/product-card"
import { Product } from "@/types/product"
import { ArrowRight, Sparkles, Zap, Shield, Flame, Truck, RotateCcw } from "lucide-react"

const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ecommercebackendbunprisma.vercel.app"

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products?limit=8`, {
      next: { revalidate: 60, tags: ["products"] },
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) return []
    const json = await res.json()
    if (Array.isArray(json)) return json.slice(0, 8)
    if (json && Array.isArray(json.products)) return json.products.slice(0, 8)
    if (json && Array.isArray(json.data)) return json.data.slice(0, 8)
    return []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-linear-to-b from-background via-background to-muted/20 py-20 md:py-28">
        <div className="absolute inset-0 bg-radial-[at_50%_0%] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-6 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>New Season Essentials</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Engineered for comfort. <br />
              <span className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
                Crafted to perform.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Explore our curated selection of high-performance gear, precision audio, and everyday tech essentials. Backed by verified in-stock availability and fast priority delivery.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?category=electronics"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/60"
              >
                View Electronics
              </Link>
            </div>

            {/* Shopper Value Badges */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 text-left">
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
                  Free
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Shipping Over $50</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
                  30-Day
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Money-Back Guarantee</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
                  100%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Real-Time In Stock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-14 md:py-20 bg-muted/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Curated Selection</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>View all products</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-card">
              <p className="text-sm font-medium text-foreground">Catalog is updating</p>
              <p className="text-xs text-muted-foreground mt-1">
                Check back shortly or browse all categories.
              </p>
              <div className="mt-4">
                <Link
                  href="/products"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground"
                >
                  Explore Catalog
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Customer Trust & Confidence Section */}
      <section className="py-14 border-t border-slate-200 dark:border-slate-800 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-card shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                Priority Tracked Delivery
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Orders dispatch within 24 hours with full end-to-end courier tracking directly to your door.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-card shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                Guaranteed Safe Checkout
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                All transactions are encrypted and authenticated with instant inventory reservation upon order placement.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-card shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                30-Day Hassle-Free Returns
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Not satisfied with your order? Return any item within 30 days for a complete refund or exchange.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
