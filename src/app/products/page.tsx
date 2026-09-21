import { Metadata } from "next"
import Link from "next/link"
import { ProductCard } from "@/components/products/product-card"
import { CatalogFilterBar } from "@/components/catalog/catalog-filter-bar"
import { Product, Category } from "@/types/product"
import { Package, RotateCcw } from "lucide-react"

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse our curated collection of high-performance products.",
}

const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ecommercebackendbunprisma.vercel.app"

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
      next: { revalidate: 60, tags: ["products"] },
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      return []
    }

    const json = await res.json()
    if (Array.isArray(json)) return json
    if (json && Array.isArray(json.products)) return json.products
    if (json && Array.isArray(json.data)) return json.data
    return []
  } catch {
    return []
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/categories`, {
      next: { revalidate: 60, tags: ["categories"] },
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      return []
    }

    const json = await res.json()
    if (Array.isArray(json)) return json
    if (json && Array.isArray(json.categories)) return json.categories
    if (json && Array.isArray(json.data)) return json.data
    return []
  } catch {
    return []
  }
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
    availability?: string
    inStock?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams
  const categoryFilter = resolvedParams?.category?.toLowerCase()
  const searchQuery = resolvedParams?.search?.toLowerCase()
  const inStockOnly =
    resolvedParams?.inStock === "true" || resolvedParams?.availability === "instock"
  const sortParam = resolvedParams?.sort || "featured"

  const [allProducts, liveCategories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  // Derive unique categories from products or live categories
  const categoryMap = new Map<string, number>()
  allProducts.forEach((p) => {
    if (p.category) {
      const key = p.category.toLowerCase()
      categoryMap.set(key, (categoryMap.get(key) || 0) + 1)
    }
  })

  // Ensure default categories exist in list if empty
  const categoryList: Array<{ label: string; value: string; count?: number }> = [
    { label: "All", value: "", count: allProducts.length },
  ]

  if (liveCategories.length > 0) {
    liveCategories.forEach((cat) => {
      const key = cat.slug?.toLowerCase() || cat.name.toLowerCase()
      categoryList.push({
        label: cat.name,
        value: key,
        count: categoryMap.get(key) || 0,
      })
    })
  } else {
    // Derive from product data or standard catalog fallback categories
    const keys = Array.from(categoryMap.keys())
    const defaults = ["electronics", "footwear", "apparel", "accessories"]
    const unionKeys = Array.from(new Set([...keys, ...defaults]))
    unionKeys.forEach((key) => {
      categoryList.push({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: key,
        count: categoryMap.get(key) || 0,
      })
    })
  }

  // Filter products
  let filteredProducts = allProducts.filter((product) => {
    if (categoryFilter && product.category?.toLowerCase() !== categoryFilter) {
      return false
    }
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery) &&
      !product.description?.toLowerCase().includes(searchQuery)
    ) {
      return false
    }
    if (inStockOnly && product.stock <= 0) {
      return false
    }
    return true
  })

  // Sort products
  if (sortParam === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
  } else if (sortParam === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
  } else if (sortParam === "newest") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Horizontal Top Filter Bar */}
        <CatalogFilterBar
          categories={categoryList}
          totalProducts={allProducts.length}
          filteredCount={filteredProducts.length}
        />

        {/* Product Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-card shadow-2xs my-8">
            <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-3 border border-slate-200 dark:border-slate-800">
              <Package className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-foreground">No products found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
              Try adjusting your search criteria, clearing category filters, or turning off the in-stock filter.
            </p>
            <div className="mt-5">
              <Link
                href="/products"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
