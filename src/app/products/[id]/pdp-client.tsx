"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"
import { useCartStore } from "@/store/use-cart-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Package,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from "lucide-react"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, setIsOpen } = useCartStore()

  // Collect all gallery images
  const allImages: string[] = React.useMemo(() => {
    const list: string[] = []
    if (product.imageUrl) list.push(product.imageUrl)
    if (product.image && !list.includes(product.image)) list.push(product.image)
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (img.url && !list.includes(img.url)) {
          list.push(img.url)
        }
      })
    }
    return list
  }, [product])

  const [selectedImage, setSelectedImage] = React.useState<string | null>(
    allImages[0] || null
  )

  const [quantity, setQuantity] = React.useState(1)
  const [selectedVariant, setSelectedVariant] = React.useState<string>("Standard")
  const [isAdded, setIsAdded] = React.useState(false)

  // Accordion state
  const [openSections, setOpenSections] = React.useState<{ [key: string]: boolean }>({
    shipping: true,
    returns: false,
    specs: false,
  })

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  const handleAddToCart = () => {
    if (isOutOfStock) return

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: selectedImage || undefined,
        stock: product.stock,
      })
    }

    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      setIsOpen(true)
    }, 450)
  }

  // Common consumer specifications without internal codes
  const specs = [
    { label: "Category", value: product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "General" },
    { label: "Warranty", value: "1-Year Official Limited Warranty" },
    { label: "Packaging", value: "Eco-friendly recyclable retail box" },
    { label: "Availability", value: isOutOfStock ? "Out of Stock" : "In Stock & Ready to Ship" },
  ]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-foreground transition-colors">
            Catalog
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/products?category=${encodeURIComponent(product.category.toLowerCase())}`}
                className="hover:text-foreground capitalize transition-colors"
              >
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Photo Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Hero Photo */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted/40 border border-slate-200 dark:border-slate-800 shadow-xs">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted/30 text-muted-foreground/40">
                  <Package className="h-24 w-24 stroke-[1]" />
                </div>
              )}

              {/* Status Badges on Image */}
              <div className="absolute top-4 right-4 z-10">
                {isOutOfStock ? (
                  <Badge variant="critical" className="text-xs font-semibold px-3 py-1 shadow-md">
                    Sold Out
                  </Badge>
                ) : isLowStock ? (
                  <Badge variant="warning" className="text-xs font-semibold px-3 py-1 shadow-md">
                    Only {product.stock} Left
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-xs font-semibold px-3 py-1 shadow-md">
                    In Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation Row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => {
                  const isCurrent = selectedImage === img
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden bg-muted/50 border-2 transition-all cursor-pointer shrink-0 ${
                        isCurrent
                          ? "border-primary shadow-xs ring-2 ring-primary/20 scale-102"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Column: Focused Buying Hierarchy */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 1. Category & Product Title */}
            <div>
              {product.category && (
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  {product.category}
                </p>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            {/* 2. Price & Live Stock Indicator */}
            <div className="flex items-baseline gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-3xl font-bold font-mono text-foreground">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">
                USD &bull; Taxes included at checkout
              </span>
            </div>

            {/* 3. Description Summary */}
            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* 4. Variant Selectors */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Edition
              </span>
              <div className="flex flex-wrap gap-2.5">
                {["Standard", "Pro Bundle"].map((variant) => {
                  const isSelected = selectedVariant === variant
                  return (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                          : "bg-background text-foreground border-slate-200 dark:border-slate-800 hover:bg-muted/60"
                      }`}
                    >
                      {variant}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 5. Quantity Stepper & Add to Cart Action */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-background shadow-2xs p-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-9 w-9 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="w-10 text-center text-sm font-semibold tabular-nums text-foreground">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-9 w-9 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Primary Add to Cart Button */}
                <Button
                  variant="default"
                  size="lg"
                  className="flex-1 h-12 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart &bull; ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Confidence Guarantee */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Secure Checkout &bull; Free Shipping Over $50</span>
              </div>
            </div>

            {/* 6. Collapsible Information Accordions */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 divide-y divide-slate-200/80 dark:divide-slate-800/80">
              {/* Shipping & Delivery */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleSection("shipping")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>Shipping &amp; Delivery</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openSections.shipping ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.shipping && (
                  <div className="mt-2.5 text-xs text-muted-foreground leading-relaxed space-y-1">
                    <p>All orders ship from our temperature-controlled fulfillment center within 24 hours.</p>
                    <p>Standard delivery: 3–5 business days. Expedited next-day options available at checkout.</p>
                  </div>
                )}
              </div>

              {/* Returns & Warranty */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleSection("returns")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-primary" />
                    <span>30-Day Returns &amp; Warranty</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openSections.returns ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.returns && (
                  <div className="mt-2.5 text-xs text-muted-foreground leading-relaxed space-y-1">
                    <p>Hassle-free 30-day money-back guarantee with prepaid return shipping labels included.</p>
                    <p>Backed by a 1-year comprehensive hardware warranty covering manufacturing defects.</p>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleSection("specs")}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Specifications &amp; Care</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openSections.specs ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.specs && (
                  <div className="mt-2.5 divide-y divide-slate-100 dark:divide-slate-900 text-xs">
                    {specs.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1.5 text-muted-foreground">
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
