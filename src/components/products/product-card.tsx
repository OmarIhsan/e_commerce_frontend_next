import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "./add-to-cart-button"
import { Product } from "@/types/product"
import { Package } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <Card className="group relative flex flex-col overflow-hidden border border-border/60 bg-card/80 transition-all hover:border-border hover:shadow-lg hover:-translate-y-1 duration-300">
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/40 border-b border-border/30">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/30 text-muted-foreground">
            <Package className="h-16 w-16 stroke-[1.2] opacity-40 transition-transform group-hover:scale-110 duration-300" />
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.category && (
            <Badge
              variant="secondary"
              className="text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md bg-background/80 shadow-xs"
            >
              {product.category}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <Badge variant="destructive" className="text-[11px] font-medium shadow-xs">
              Out of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge
              variant="outline"
              className="text-[11px] font-medium border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 backdrop-blur-md"
            >
              Only {product.stock} left
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[11px] font-medium border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 backdrop-blur-md"
            >
              In Stock
            </Badge>
          )}
        </div>
      </div>

      {/* Product Details */}
      <CardHeader className="p-4 pb-2">
        <Link href={`/products/${product.id}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-heading font-semibold text-base leading-snug line-clamp-1 text-foreground">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-end">
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-xl font-bold font-mono tracking-tight text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.sku && (
            <span className="text-[11px] text-muted-foreground font-mono">
              SKU: {product.sku}
            </span>
          )}
        </div>
      </CardContent>

      {/* Add To Cart Client Node */}
      <CardFooter className="p-4 pt-0">
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  )
}
