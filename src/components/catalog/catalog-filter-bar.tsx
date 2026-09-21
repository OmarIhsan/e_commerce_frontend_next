"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ArrowUpDown, Check, Filter, RotateCcw, SlidersHorizontal } from "lucide-react"

interface CategoryOption {
  label: string
  value: string
  count?: number
}

interface CatalogFilterBarProps {
  categories: CategoryOption[]
  totalProducts: number
  filteredCount: number
}

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
]

export function CatalogFilterBar({
  categories,
  totalProducts,
  filteredCount,
}: CatalogFilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || ""
  const currentSort = searchParams.get("sort") || "featured"
  const inStockOnly = searchParams.get("inStock") === "true" || searchParams.get("availability") === "instock"
  const currentSearch = searchParams.get("search") || ""

  const [mobileOpen, setMobileOpen] = React.useState(false)

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "" || (key === "sort" && val === "featured")) {
        params.delete(key)
      } else {
        params.set(key, val)
      }
    })
    // If availability was previously set, clean it up into inStock
    if (updates.inStock !== undefined) {
      params.delete("availability")
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const resetAll = () => {
    router.push(pathname)
    setMobileOpen(false)
  }

  const hasActiveFilters = Boolean(
    currentCategory ||
    inStockOnly ||
    currentSearch ||
    (currentSort && currentSort !== "featured")
  )

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === currentSort)?.label || "Featured"

  return (
    <div className="space-y-4 mb-6">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {currentCategory
              ? `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Collection`
              : "Product Catalog"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Showing <strong className="font-mono text-foreground font-semibold">{filteredCount}</strong> of {totalProducts} products
            {currentSearch && <span> matching &ldquo;{currentSearch}&rdquo;</span>}
          </p>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* In-Stock Toggle Button */}
          <button
            type="button"
            onClick={() => updateFilters({ inStock: inStockOnly ? null : "true" })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              inStockOnly
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shadow-2xs"
                : "bg-background text-muted-foreground border-slate-200 dark:border-slate-800 hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                inStockOnly ? "bg-emerald-600 dark:bg-emerald-400 animate-pulse" : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
            <span>In Stock Only</span>
          </button>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-background text-foreground hover:bg-muted/50 transition-colors shadow-2xs cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Sort: {currentSortLabel}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1 rounded-lg">
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => updateFilters({ sort: opt.value })}
                  className="flex items-center justify-between text-xs py-2 cursor-pointer"
                >
                  <span>{opt.label}</span>
                  {currentSort === opt.value && <Check className="w-3.5 h-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Filter Sheet Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-background text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Filters</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <SheetHeader>
                  <SheetTitle className="text-base font-bold text-foreground">Filters &amp; Sort</SheetTitle>
                </SheetHeader>

                {/* Categories */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categories</span>
                  <div className="flex flex-col gap-1.5">
                    {categories.map((cat) => {
                      const active = currentCategory === cat.value
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => {
                            updateFilters({ category: cat.value || null })
                            setMobileOpen(false)
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                            active
                              ? "bg-primary text-primary-foreground font-semibold"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <span>{cat.label}</span>
                          {cat.count !== undefined && (
                            <span className="text-[11px] opacity-75 font-mono">({cat.count})</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* In Stock */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Availability</span>
                  <button
                    type="button"
                    onClick={() => updateFilters({ inStock: inStockOnly ? null : "true" })}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      inStockOnly
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "hover:bg-muted text-foreground border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <span>In Stock Only</span>
                    {inStockOnly && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAll}
                  className="w-full text-xs font-semibold gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </Button>
              )}
            </SheetContent>
          </Sheet>

          {/* Reset Filters Link */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-colors cursor-pointer ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Pill Carousel / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = currentCategory === cat.value
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => updateFilters({ category: cat.value || null })}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-card border border-slate-200 dark:border-slate-800 text-muted-foreground hover:text-foreground hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <span
                  className={`text-[10px] font-mono rounded-full px-1.5 py-0.2 ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
