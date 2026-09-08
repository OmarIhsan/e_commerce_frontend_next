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
  Truck,
  CheckCircle,
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

  // Free shipping threshold ($50)
  const FREE_SHIPPING_THRESHOLD = 50
  const freeShippingMet = subtotal >= FREE_SHIPPING_THRESHOLD
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0 bg-card border-l border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between space-y-0 bg-background/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-muted text-foreground">
              <ShoppingBag className="w-4 h-4 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold text-foreground">Cart Review</SheetTitle>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {totalCount} {totalCount === 1 ? "item" : "items"} staged
              </p>
            </div>
          </div>
          <SheetDescription className="sr-only">
            Review and adjust items in your shopping bag before checkout.
          </SheetDescription>
        </SheetHeader>

        {/* Free Shipping Progress (Polaris Banner / Progress style) */}
        {mounted && items.length > 0 && (
          <div className="px-6 py-3 bg-muted/30 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-foreground">
                <Truck className="w-3.5 h-3.5 text-primary" />
                {freeShippingMet ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    You unlocked Free Priority Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong className="font-mono font-bold">${amountToFreeShipping.toFixed(2)}</strong> for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {freeShippingMet ? "100%" : `${Math.round(shippingProgress)}%`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  freeShippingMet ? "bg-emerald-600" : "bg-primary"
                }`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart items list: Polaris Resource List layout */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!mounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-slate-200 dark:border-slate-800">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Your cart is empty</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                Add products from our catalog to review order totals, inventory allocation, and expedited shipping.
              </p>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className={cn(buttonVariants({ variant: "default" }), "mt-5 text-xs font-semibold h-9 rounded-lg")}
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
              {items.map((item) => {
                const isMaxStock = item.quantity >= item.stock

                return (
                  <div
                    key={item.productId}
                    className="py-4 first:pt-0 last:pb-0 flex gap-3.5 group"
                  >
                    {/* Aspect-ratio locked thumbnail */}
                    <div className="relative w-18 h-18 rounded-lg overflow-hidden bg-muted/60 shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-muted-foreground/50" />
                      )}
                    </div>

                    {/* Details & Controls */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-muted-foreground hover:text-rose-600 transition-colors p-0.5 rounded cursor-pointer"
                            title="Remove item from order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>
                        <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                          ${item.price.toFixed(2)} each {item.sku ? `• SKU: ${item.sku}` : ""}
                        </p>
                      </div>

                      {/* Stepper Quantity control & Line Total */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-md bg-background shadow-2xs">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-6 w-6 rounded-none rounded-l-md hover:bg-muted cursor-pointer"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            title="Decrease count"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </Button>
                          <span className="w-7 text-center text-xs font-semibold tabular-nums text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-6 w-6 rounded-none rounded-r-md hover:bg-muted cursor-pointer"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={isMaxStock}
                            title={isMaxStock ? "Maximum inventory reached" : "Increase count"}
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold font-mono text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          {isMaxStock && (
                            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                              Max Stock
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="pt-3 flex justify-between items-center text-xs text-muted-foreground">
                <span className="text-[11px]">Real-time stock reserved</span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] font-medium text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with summary & checkout action */}
        {mounted && items.length > 0 && (
          <SheetFooter className="p-5 border-t border-slate-200 dark:border-slate-800 bg-muted/20 flex flex-col gap-3">
            <div className="space-y-1.5 w-full text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground font-mono">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Standard Shipping</span>
                <span className="font-mono text-foreground font-semibold">
                  {freeShippingMet ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase">Free</span>
                  ) : (
                    "$12.00"
                  )}
                </span>
              </div>
              <Separator className="my-1.5 bg-slate-200 dark:border-slate-800" />
              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>Estimated Total</span>
                <span className="font-mono text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-11 text-xs font-bold shadow-xs flex items-center justify-center gap-2 group mt-1 rounded-lg cursor-pointer"
              )}
            >
              <span>Continue to Secure Checkout</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prisma Atomic Database Transaction Guard</span>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

