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
        className={`w-full text-muted-foreground border-dashed cursor-not-allowed ${className}`}
      >
        Out of Stock
      </Button>
    )
  }

  if (outOfStockError || isCartStockReached) {
    return (
      <Button
        variant="secondary"
        size={size}
        disabled={isCartStockReached}
        onClick={handleAdd}
        className={`w-full text-amber-600 bg-amber-500/10 border-amber-500/20 gap-1.5 ${className}`}
      >
        <AlertCircle className="w-4 h-4 text-amber-600" />
        <span>Max in Cart ({currentInCart})</span>
      </Button>
    )
  }

  return (
    <Button
      variant={justAdded ? "secondary" : "default"}
      size={size}
      onClick={handleAdd}
      className={`w-full font-medium transition-all shadow-xs active:scale-[0.98] ${
        justAdded
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "hover:bg-primary/90"
      } ${className}`}
    >
      {justAdded ? (
        <span className="flex items-center gap-1.5">
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Added!</span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          {showIcon && <ShoppingBag className="w-4 h-4" />}
          <span>Add to Cart</span>
        </span>
      )}
    </Button>
  )
}
