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

  return (
    <div className="group relative flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-card overflow-hidden shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200">
      {/* Aspect-Ratio-Locked Image Container with Polaris border styling */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30 border-b border-slate-200/80 dark:border-slate-800/80">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-102"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/20 text-muted-foreground/60">
            <Package className="h-12 w-12 stroke-[1.2]" />
          </div>
        )}

        {/* Absolute Top-Left: Category Tag */}
        <div className="absolute top-2.5 left-2.5 z-10">
          {product.category && (
            <Badge
              variant="neutral"
              className="text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs bg-background/90 shadow-2xs"
            >
              {product.category}
            </Badge>
          )}
        </div>

        {/* Absolute Top-Right: Polaris Status Semantics */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <Badge variant="critical" className="text-[10px] font-bold shadow-2xs">
              Sold Out
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" className="text-[10px] font-bold shadow-2xs">
              Only {product.stock} Left
            </Badge>
          ) : (
            <Badge variant="success" className="text-[10px] font-bold shadow-2xs">
              In Stock
            </Badge>
          )}
        </div>
      </div>

      {/* Structured Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono mb-1">
            <span>{product.sku ? `SKU: ${product.sku}` : "INSTOCK-VERIFIED"}</span>
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
              <Zap className="w-3 h-3" />
              <span>Fast Ship</span>
            </span>
          </div>

          <Link href={`/products`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-heading font-bold text-sm leading-snug line-clamp-1 text-foreground">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing & Add to Order Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold font-mono tracking-tight text-foreground">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              USD &bull; Tax incl.
            </span>
          </div>

          <AddToCartButton product={product} size="default" />
        </div>
      </div>
    </div>
  )
}

