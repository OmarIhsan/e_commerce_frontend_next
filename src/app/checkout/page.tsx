"use client"

import * as React from "react"
import Link from "next/link"
import { useCartStore } from "@/store/use-cart-store"
import { checkoutAction } from "@/actions/checkout"
import { OrderConfirmation } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useMounted } from "@/hooks/use-mounted"
import {
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  Lock,
  ArrowLeft,
  Loader2,
  AlertTriangle,
} from "lucide-react"

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart, hasHydrated } = useCartStore()

  const mounted = useMounted()
  const [submitting, setSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [confirmedOrder, setConfirmedOrder] = React.useState<OrderConfirmation | null>(null)

  // Form State
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    cardNumber: "**** **** **** 4242",
    expDate: "12/28",
    cvv: "***",
  })

  const subtotal = mounted && hasHydrated ? getSubtotal() : 0
  const shippingFee = subtotal > 50 || subtotal === 0 ? 0 : 12.0
  const estimatedTax = subtotal * 0.08
  const totalAmount = subtotal + shippingFee + estimatedTax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (items.length === 0) {
      setErrorMessage("Your shopping cart is empty.")
      return
    }

    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.postalCode) {
      setErrorMessage("Please fill in all required shipping address fields.")
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city,
          state: formData.state || "CA",
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: "credit_card",
      }

      const result = await checkoutAction(payload)

      if (result.success && result.order) {
        clearCart()
        setConfirmedOrder(result.order)
      } else {
        setErrorMessage(result.error || "Failed to process checkout transaction.")
      }
    } catch {
      setErrorMessage("An unexpected network error occurred during checkout.")
    } finally {
      setSubmitting(false)
    }
  }

  // Order Confirmed State
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-muted/10 py-16">
        <div className="container mx-auto max-w-2xl px-4">
          <Card className="border-emerald-500/20 shadow-xl overflow-hidden">
            <div className="bg-emerald-500/10 p-8 text-center border-b border-emerald-500/20">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 font-mono text-xs">
                Transaction Atomic &amp; Complete
              </Badge>
              <h1 className="font-heading text-3xl font-extrabold text-foreground mt-3">
                Order Confirmed!
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Thank you for your order. We&apos;ve sent receipt and tracking details to your email.
              </p>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-xl bg-muted/40 border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Order Reference</p>
                  <p className="font-mono text-base font-bold text-foreground mt-0.5">
                    {confirmedOrder.orderNumber || confirmedOrder.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</p>
                  <p className="font-mono text-base font-bold text-foreground mt-0.5">
                    ${confirmedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                  <Badge variant="secondary" className="mt-1 font-mono text-xs">
                    {confirmedOrder.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Purchased Items ({confirmedOrder.items.length})
                </h4>
                <div className="divide-y border rounded-xl overflow-hidden">
                  {confirmedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center text-sm bg-card">
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.name || `Item ID: ${item.productId}`}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-foreground">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="flex-1 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Return Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Cart Empty State
  if (mounted && items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/10 py-20">
        <div className="container mx-auto max-w-lg px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mt-2">
            You don&apos;t have any items ready for checkout. Browse our catalog to find gear you love.
          </p>
          <Link
            href="/products"
            className="inline-flex mt-6 h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10 py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shopping</span>
          </Link>
          <h1 className="font-heading text-3xl font-black tracking-tight text-foreground mt-2">
            Secure Checkout
          </h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted SSL 256-Bit Connection with Prisma Transaction Safety</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Shipping & Payment Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </div>
                <CardDescription>
                  Enter the destination address for order delivery.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Full Recipient Name *
                    </label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Street Address *
                    </label>
                    <Input
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="123 Tech Boulevard"
                      required
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Apartment, Suite, Unit (Optional)
                    </label>
                    <Input
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Suite 404"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      City *
                    </label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="San Francisco"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      State / Province *
                    </label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="CA"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Postal Code / ZIP *
                    </label>
                    <Input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="94107"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Country *
                    </label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Payment Simulation</CardTitle>
                </div>
                <CardDescription>
                  Secured simulated test payment credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-3">
                    <label className="text-xs font-medium text-foreground">
                      Card Number
                    </label>
                    <Input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      readOnly
                      className="bg-muted/40 font-mono"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Expiry Date
                    </label>
                    <Input
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleInputChange}
                      readOnly
                      className="bg-muted/40 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      CVC / CVV
                    </label>
                    <Input
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      readOnly
                      className="bg-muted/40 font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <Card className="sticky top-24 shadow-md">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Order Summary</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Items List */}
                <div className="max-h-64 overflow-y-auto divide-y pr-1 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center text-sm pt-3 first:pt-0"
                    >
                      <div className="min-w-0 pr-3">
                        <p className="font-semibold text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-foreground shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Calculations */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Shipping</span>
                    <span className="font-mono text-foreground">
                      {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-mono text-foreground">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-base font-bold text-foreground">
                    <span>Total</span>
                    <span className="font-mono text-primary">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 text-base font-bold shadow-md cursor-pointer mt-4"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Executing Atomic Transaction...</span>
                    </span>
                  ) : (
                    <span>Place Order (${totalAmount.toFixed(2)})</span>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Prisma Database Transaction Protection</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  )
}
