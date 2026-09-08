"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/use-cart-store"
import { Product } from "@/types/product"
import { ShoppingBag, Check, AlertCircle } from "lucide-react"

interface AddToCartButtonProps {
  product: Product
  size?: "sm" | "default" | "lg"
  className?: string
  showIcon?: boolean
}

export function AddToCartButton({
  product,
  size = "default",
  className = "",
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem, items, hasHydrated } = useCartStore()
  const [justAdded, setJustAdded] = React.useState(false)
  const [outOfStockError, setOutOfStockError] = React.useState(false)

  const isOutOfStock = product.stock <= 0

  // Check if quantity in cart already reached max available stock
  const currentInCart = hasHydrated
    ? items.find((i) => i.productId === product.id)?.quantity || 0
    : 0

  const isCartStockReached = currentInCart >= product.stock

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock || isCartStockReached) {
      setOutOfStockError(true)
      setTimeout(() => setOutOfStockError(false), 2000)
      return
    }

    const success = addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image,
      sku: product.sku,
    })

    if (success) {
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 1500)
    } else {
      setOutOfStockError(true)
      setTimeout(() => setOutOfStockError(false), 2000)
    }
  }

  if (isOutOfStock) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={`w-full text-xs font-semibold text-muted-foreground border-slate-200 dark:border-slate-800 bg-muted/30 cursor-not-allowed rounded-lg ${className}`}
      >
        Sold Out
      </Button>
    )
  }

  if (outOfStockError || isCartStockReached) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled={isCartStockReached}
        onClick={handleAdd}
        className={`w-full text-xs font-semibold text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 gap-1.5 rounded-lg ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
        <span>Max In Cart ({currentInCart})</span>
      </Button>
    )
  }

  return (
    <Button
      variant={justAdded ? "secondary" : "default"}
      size={size}
      onClick={handleAdd}
      className={`w-full text-xs font-bold transition-all duration-200 shadow-2xs rounded-lg active:scale-[0.98] cursor-pointer ${
        justAdded
          ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      } ${className}`}
    >
      {justAdded ? (
        <span className="flex items-center justify-center gap-1.5 animate-in zoom-in-90 duration-150">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Added to Order</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-1.5">
          {showIcon && <ShoppingBag className="w-3.5 h-3.5" />}
          <span>Quick Add</span>
        </span>
      )}
    </Button>
  )
}
