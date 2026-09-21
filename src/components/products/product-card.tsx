import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "./add-to-cart-button"
import { Product } from "@/types/product"
import { Package, Zap } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 5
  const displayImage =
    product.imageUrl ||
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0].url : undefined)

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-card overflow-hidden shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200">
      {/* 1. Image: Aspect-Square with Smooth Hover Scaling */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full overflow-hidden bg-muted/40 border-b border-slate-200/80 dark:border-slate-800/80 block"
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/30 text-muted-foreground/50">
            <Package className="h-12 w-12 stroke-[1.2]" />
          </div>
        )}

        {/* Stock Status Pill (Only if low or sold out to minimize clutter) */}
        {isOutOfStock ? (
          <div className="absolute top-2.5 right-2.5 z-10">
            <Badge variant="critical" className="text-[10px] font-semibold px-2 py-0.5 shadow-2xs">
              Sold Out
            </Badge>
          </div>
        ) : isLowStock ? (
          <div className="absolute top-2.5 right-2.5 z-10">
            <Badge variant="warning" className="text-[10px] font-semibold px-2 py-0.5 shadow-2xs">
              Only {product.stock} left
            </Badge>
          </div>
        ) : null}
      </Link>

      {/* Structured Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {/* 2. Title & Category */}
        <div>
          {product.category && (
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {product.category}
            </p>
          )}
          <Link href={`/products/${product.id}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-medium text-sm text-foreground line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* 3. Price & Action */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold font-mono tracking-tight text-foreground">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <AddToCartButton product={product} size="default" />
        </div>
      </div>
    </div>
  )
}

