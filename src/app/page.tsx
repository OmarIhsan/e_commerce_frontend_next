import Link from "next/link"
import { ProductCard } from "@/components/products/product-card"
import { apiClient } from "@/lib/api-client"
import { Product } from "@/types/product"
import { ArrowRight, Sparkles, Zap, Shield, Flame } from "lucide-react"

const FEATURED_FALLBACKS: Product[] = [
  {
    id: "prod_01",
    name: "Aether Pro Wireless Mechanical Keyboard",
    description: "Hot-swappable custom switches with sound-dampened gasket mount and RGB per-key backlighting.",
    price: 189.99,
    stock: 14,
    sku: "AETH-KB-01",
    category: "electronics",
  },
  {
    id: "prod_02",
    name: "Hyperion ANC Studio Headphones",
    description: "Dual planar magnetic drivers with active hybrid noise cancellation and 40h battery endurance.",
    price: 349.5,
    stock: 8,
    sku: "HYPR-HP-02",
    category: "electronics",
  },
  {
    id: "prod_04",
    name: "Vortex 4K 144Hz OLED Gaming Monitor",
    description: "Ultrafast 0.03ms response time with true HDR1000 certified contrast and USB-C 90W power delivery.",
    price: 799.99,
    stock: 3,
    sku: "VRTX-MON-04",
    category: "electronics",
  },
  {
    id: "prod_07",
    name: "Orbit Magnetic Desk Mat & Wireless Charger",
    description: "Premium vegan leather desk pad with integrated 15W Qi fast charging cradle for smartphone and earbuds.",
    price: 68.0,
    stock: 35,
    sku: "ORBT-DK-07",
    category: "accessories",
  },
]

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await apiClient<Product[] | { products: Product[] }>(
      "/api/v1/products?limit=4",
      { next: { revalidate: 300 } }
    )
    if (Array.isArray(res)) return res.slice(0, 4)
    if (res && Array.isArray(res.products)) return res.products.slice(0, 4)
    return FEATURED_FALLBACKS
  } catch {
    return FEATURED_FALLBACKS
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-background via-background to-muted/20 py-20 md:py-28">
        <div className="absolute inset-0 bg-radial-[at_50%_0%] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-6 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next.js 15 App Router &amp; Bun.js Backend</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Architected for speed. <br />
              <span className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
                Engineered for consumers.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Experience the pinnacle of commerce performance. Sub-second ISR product caching, zero-friction client Zustand cart persistence, and atomic database checkouts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-xs font-bold text-primary-foreground shadow-2xs transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?category=electronics"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-background px-5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/60"
              >
                View Electronics
              </Link>
            </div>

            {/* Performance Metric Badges */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 text-left">
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
                  &lt; 50ms
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Edge Page Latency</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
                  100%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Inventory Accuracy</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
                  Zero
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Friction Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-14 md:py-20 bg-muted/15">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Curated Selection</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Featured Gear
              </h2>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>View all items</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Highlights Section */}
      <section className="py-14 border-t border-slate-200 dark:border-slate-800 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-card shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                ISR &amp; Edge Delivery
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Pages are server-rendered and statically optimized using Next.js 15 incremental revalidation, delivering lightning fast TTFB.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-card shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                Atomic Checkout Safety
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                All checkout orders execute via Prisma database transactions on the Bun backend, guaranteeing zero inventory over-allocation.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-card shadow-2xs">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                Zustand Persistent State
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Client shopping bag syncs instantaneously to localStorage with SSR hydration guards, keeping customers ready to buy across sessions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

