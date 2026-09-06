"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/use-cart-store"
import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"

export function CartSheet() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTotalItems,
    hasHydrated,
  } = useCartStore()

  const mounted = useMounted()
  const totalCount = mounted && hasHydrated ? getTotalItems() : 0
  const subtotal = mounted && hasHydrated ? getSubtotal() : 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <SheetTitle className="text-lg font-bold">Shopping Cart</SheetTitle>
            <Badge variant="secondary" className="font-mono text-xs ml-1">
              {totalCount} {totalCount === 1 ? "item" : "items"}
            </Badge>
          </div>
          <SheetDescription className="sr-only">
            Review and adjust products in your shopping cart before checkout.
          </SheetDescription>
        </SheetHeader>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!mounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Looks like you haven&apos;t added any products yet. Start exploring our latest inventory!
              </p>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className={cn(buttonVariants({ variant: "default" }), "mt-6 font-medium")}
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const isMaxStock = item.quantity >= item.stock

                return (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-3 rounded-xl border bg-card/60 hover:bg-card transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center border">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-foreground truncate">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1 -mr-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity selector & line total */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                        <div className="flex items-center border rounded-md bg-background">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7 rounded-none rounded-l-md"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7 rounded-none rounded-r-md"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={isMaxStock}
                            title={isMaxStock ? "Max stock reached" : "Increase quantity"}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          {isMaxStock && (
                            <p className="text-[10px] text-amber-600 font-medium">
                              Max available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="flex justify-end pt-1">
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={clearCart}
                >
                  Clear entire cart
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with summary & checkout action */}
        {mounted && items.length > 0 && (
          <SheetFooter className="p-6 border-t bg-muted/20 flex flex-col gap-3">
            <div className="space-y-1.5 w-full text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground font-mono">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Shipping & Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-bold text-foreground">
                <span>Estimated Total</span>
                <span className="font-mono text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-11 text-base font-semibold shadow-md flex items-center justify-center gap-2 group mt-2 cursor-pointer"
              )}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe &amp; Encrypted Atomic Checkout</span>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
