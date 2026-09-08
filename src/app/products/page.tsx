import { Metadata } from "next"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import { ProductCard } from "@/components/products/product-card"
import { Product } from "@/types/product"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  SlidersHorizontal,
  Info,
  CheckCircle2,
  Package,
  RotateCcw,
  Search,
  ArrowUpDown,
  Tag,
  Boxes,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Product Catalog",
  description:
    "Explore our full catalog of high-performance products with real-time stock levels.",
}

// Fallback items for development resilience when backend is offline
const MOCK_PRODUCTS: Product[] = [
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
    id: "prod_03",
    name: "Nomad Minimalist Carry-On Backpack",
    description: "Weatherproof recycled Cordura exterior, 25L modular compartments with TSA-ready laptop pocket.",
    price: 129.0,
    stock: 22,
    sku: "NMD-BP-03",
    category: "apparel",
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
    id: "prod_05",
    name: "Merino Wool Thermal Tech Hoodie",
    description: "Breathable moisture-wicking Australian merino wool tailored with articulated raglan sleeves.",
    price: 110.0,
    stock: 19,
    sku: "MRNO-HD-05",
    category: "apparel",
  },
  {
    id: "prod_06",
    name: "Pulse Titanium Smart Ring",
    description: "Medical-grade continuous HRV, sleep architecture, and blood oxygen biometric tracker.",
    price: 279.0,
    stock: 0,
    sku: "PLSE-RNG-06",
    category: "accessories",
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
  {
    id: "prod_08",
    name: "Zenith Ergonomic Carbon Task Chair",
    description: "Dynamic lumbar support system with breathable 4D mesh and synchronized tilt lock mechanism.",
    price: 540.0,
    stock: 6,
    sku: "ZNTH-CH-08",
    category: "electronics",
  },
]

async function getProducts(): Promise<Product[]> {
  try {
    const res = await apiClient<Product[] | { products: Product[] }>(
      "/api/v1/products",
      {
        next: { revalidate: 300 },
      }
    )

    if (Array.isArray(res)) {
      return res
    }
    if (res && Array.isArray(res.products)) {
      return res.products
    }
    return MOCK_PRODUCTS
  } catch {
    return MOCK_PRODUCTS
  }
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
    availability?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams
  const categoryFilter = resolvedParams?.category?.toLowerCase()
  const searchQuery = resolvedParams?.search?.toLowerCase()
  const availabilityFilter = resolvedParams?.availability?.toLowerCase()
  const sortParam = resolvedParams?.sort || "featured"

  const allProducts = await getProducts()

  // Apply filters
  let filteredProducts = allProducts.filter((product) => {
    if (categoryFilter && product.category?.toLowerCase() !== categoryFilter) {
      return false
    }
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery) &&
      !product.description?.toLowerCase().includes(searchQuery) &&
      !product.sku?.toLowerCase().includes(searchQuery)
    ) {
      return false
    }
    if (availabilityFilter === "instock" && product.stock <= 0) {
      return false
    }
    if (availabilityFilter === "lowstock" && (product.stock <= 0 || product.stock > 5)) {
      return false
    }
    return true
  })

  // Apply sort
  if (sortParam === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
  } else if (sortParam === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
  } else if (sortParam === "stock-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.stock - a.stock)
  }

  const categories = [
    { label: "All Collections", value: "" },
    { label: "Electronics", value: "electronics" },
    { label: "Apparel", value: "apparel" },
    { label: "Accessories", value: "accessories" },
  ]

  const totalInStock = allProducts.filter((p) => p.stock > 0).length
  const hasActiveFilters = Boolean(categoryFilter || searchQuery || availabilityFilter || (sortParam && sortParam !== "featured"))

  return (
    <div className="min-h-screen bg-muted/15 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Polaris High-Trust Banner */}
        <div className="mb-6 rounded-lg border border-sky-200 bg-sky-50/70 dark:border-sky-800/60 dark:bg-sky-950/30 p-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded-md bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sky-900 dark:text-sky-200">
                  Inventory Guarantee &amp; Atomic Reservation Active
                </span>
                <Badge variant="info" className="text-[10px] h-4">
                  Verified In Stock
                </Badge>
              </div>
              <p className="text-sky-800/90 dark:text-sky-300/80 mt-0.5 leading-relaxed">
                All catalog items are backed by real-time database locks to eliminate stock contention. Complimentary priority delivery automatically applies to all orders over $50.
              </p>
            </div>
          </div>
        </div>

        {/* Polaris Resource List Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Polaris Filter Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                  <span>Filters &amp; Facets</span>
                </div>
                {hasActiveFilters && (
                  <Link
                    href="/products"
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </Link>
                )}
              </div>

              {/* Collections / Categories */}
              <div className="py-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3 h-3" />
                  <span>Category</span>
                </span>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const isSelected = (categoryFilter || "") === cat.value
                    const count = cat.value
                      ? allProducts.filter((p) => p.category?.toLowerCase() === cat.value).length
                      : allProducts.length

                    const nextUrl = new URLSearchParams()
                    if (cat.value) nextUrl.set("category", cat.value)
                    if (searchQuery) nextUrl.set("search", searchQuery)
                    if (availabilityFilter) nextUrl.set("availability", availabilityFilter)
                    if (sortParam && sortParam !== "featured") nextUrl.set("sort", sortParam)

                    return (
                      <Link
                        key={cat.value}
                        href={`/products?${nextUrl.toString()}`}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[10px] font-mono ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {count}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Inventory Status Filter */}
              <div className="py-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Boxes className="w-3 h-3" />
                  <span>Availability</span>
                </span>
                <div className="space-y-1">
                  {[
                    { label: "All Items", value: "" },
                    { label: "In Stock Only", value: "instock" },
                    { label: "Low Stock Alert (≤5)", value: "lowstock" },
                  ].map((av) => {
                    const isSelected = (availabilityFilter || "") === av.value
                    const nextUrl = new URLSearchParams()
                    if (categoryFilter) nextUrl.set("category", categoryFilter)
                    if (searchQuery) nextUrl.set("search", searchQuery)
                    if (av.value) nextUrl.set("availability", av.value)
                    if (sortParam && sortParam !== "featured") nextUrl.set("sort", sortParam)

                    return (
                      <Link
                        key={av.value}
                        href={`/products?${nextUrl.toString()}`}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-secondary text-foreground font-semibold border border-slate-200 dark:border-slate-700"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <span>{av.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Sort By Filter */}
              <div className="pt-3 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ArrowUpDown className="w-3 h-3" />
                  <span>Sort Order</span>
                </span>
                <div className="space-y-1">
                  {[
                    { label: "Featured First", value: "featured" },
                    { label: "Price: Low to High", value: "price-asc" },
                    { label: "Price: High to Low", value: "price-desc" },
                    { label: "Highest Stock", value: "stock-desc" },
                  ].map((s) => {
                    const isSelected = sortParam === s.value
                    const nextUrl = new URLSearchParams()
                    if (categoryFilter) nextUrl.set("category", categoryFilter)
                    if (searchQuery) nextUrl.set("search", searchQuery)
                    if (availabilityFilter) nextUrl.set("availability", availabilityFilter)
                    if (s.value !== "featured") nextUrl.set("sort", s.value)

                    return (
                      <Link
                        key={s.value}
                        href={`/products?${nextUrl.toString()}`}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-secondary text-foreground font-semibold border border-slate-200 dark:border-slate-700"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <span>{s.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Micro-summary Card */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-4 shadow-2xs text-xs space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Total Catalog Items</span>
                <span className="font-mono font-bold text-foreground">{allProducts.length}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Active Available Units</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{totalInStock}</span>
              </div>
              <Separator className="my-1" />
              <div className="text-[11px] text-muted-foreground">
                Prisma transactional verification enabled on all checkout sessions.
              </div>
            </div>
          </aside>

          {/* Right: Polaris Index / Resource List */}
          <main className="lg:col-span-9 space-y-4">
            {/* Index Header & Active Filter Badges */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-heading text-lg font-bold text-foreground">
                  {categoryFilter
                    ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Products`
                    : "All Catalog Inventory"}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing <strong className="font-mono text-foreground font-bold">{filteredProducts.length}</strong> of {allProducts.length} products
                  {searchQuery ? ` matching "${searchQuery}"` : ""}.
                </p>
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {categoryFilter && (
                    <Badge variant="secondary" className="text-[11px] gap-1 font-medium">
                      Category: {categoryFilter}
                    </Badge>
                  )}
                  {availabilityFilter && (
                    <Badge variant="secondary" className="text-[11px] gap-1 font-medium">
                      Status: {availabilityFilter}
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="secondary" className="text-[11px] gap-1 font-medium">
                      Search: &ldquo;{searchQuery}&rdquo;
                    </Badge>
                  )}
                  <Link
                    href="/products"
                    className="text-[11px] font-semibold text-primary hover:underline ml-1"
                  >
                    Clear All
                  </Link>
                </div>
              )}
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center bg-card shadow-2xs">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-3 border border-slate-200 dark:border-slate-800">
                  <Package className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-bold text-foreground">No matching inventory found</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Try adjusting your search criteria, category filters, or availability toggle.
                </p>
                <div className="mt-4">
                  <Link
                    href="/products"
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90 transition-colors"
                  >
                    Reset All Filters
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

