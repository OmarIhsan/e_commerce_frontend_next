import { Metadata } from "next"
import { apiClient } from "@/lib/api-client"
import { ProductCard } from "@/components/products/product-card"
import { Product } from "@/types/product"
import { Sparkles, SlidersHorizontal } from "lucide-react"

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
    // Next.js 15 fetch with 300s ISR revalidation for sub-second performance
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
    // Backend offline fallback for local dev
    return MOCK_PRODUCTS
  }
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams
  const categoryFilter = resolvedParams?.category
  const searchQuery = resolvedParams?.search?.toLowerCase()

  const allProducts = await getProducts()

  // Apply filters
  const filteredProducts = allProducts.filter((product) => {
    if (categoryFilter && product.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false
    }
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery) &&
      !product.description?.toLowerCase().includes(searchQuery)
    ) {
      return false
    }
    return true
  })

  const categories = [
    { label: "All Categories", value: "" },
    { label: "Electronics", value: "electronics" },
    { label: "Apparel", value: "apparel" },
    { label: "Accessories", value: "accessories" },
  ]

  return (
    <div className="min-h-screen bg-muted/10 py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Catalog</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-black tracking-tight text-foreground">
              {categoryFilter
                ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}`
                : "All Products"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {filteredProducts.length} high-performance items in stock.
            </p>
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground mr-1 hidden sm:inline" />
            {categories.map((cat) => {
              const isSelected = (categoryFilter || "") === cat.value
              const href = cat.value ? `/products?category=${cat.value}` : "/products"

              return (
                <a
                  key={cat.value}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-background text-muted-foreground border-border/80 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.label}
                </a>
              )
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center bg-card">
            <h3 className="text-lg font-semibold text-foreground">No products found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search criteria or category filter.
            </p>
            <a
              href="/products"
              className="inline-block mt-4 text-xs font-semibold text-primary hover:underline"
            >
              Reset filters &rarr;
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
