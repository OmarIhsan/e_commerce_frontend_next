"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/store/use-cart-store"
import { checkoutAction } from "@/actions/checkout"
import { OrderConfirmation } from "@/types/product"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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
  Tag,
  Check,
  Package,
  Store,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react"

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart, hasHydrated } = useCartStore()
  const mounted = useMounted()

  const [submitting, setSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [confirmedOrder, setConfirmedOrder] = React.useState<OrderConfirmation | null>(null)

  // Shipping Method
  const [shippingMethod, setShippingMethod] = React.useState<"standard" | "express">("standard")

  // Discount Code
  const [promoInput, setPromoInput] = React.useState("")
  const [appliedDiscount, setAppliedDiscount] = React.useState<{ code: string; percent: number } | null>(null)
  const [promoError, setPromoError] = React.useState<string | null>(null)

  // Form State
  const [formData, setFormData] = React.useState({
    email: "",
    phone: "",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "CA",
    postalCode: "",
    country: "United States",
    cardNumber: "**** **** **** 4242",
    expDate: "12/28",
    cvv: "***",
  })

  // Touched state for inline validation feedback
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const subtotal = mounted && hasHydrated ? getSubtotal() : 0

  // Shipping cost calculation
  const standardShippingFee = subtotal >= 50 || subtotal === 0 ? 0 : 12.0
  const expressShippingFee = 18.0
  const shippingFee = shippingMethod === "express" ? expressShippingFee : standardShippingFee

  // Discount calculation
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0
  const discountedSubtotal = Math.max(0, subtotal - discountAmount)

  // Tax and Total
  const estimatedTax = discountedSubtotal * 0.08
  const totalAmount = discountedSubtotal + shippingFee + estimatedTax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError(null)
    const normalized = promoInput.trim().toUpperCase()

    if (!normalized) return

    if (normalized === "POLARIS10" || normalized === "DISCOUNT10") {
      setAppliedDiscount({ code: normalized, percent: 10 })
      setPromoInput("")
    } else if (normalized === "VIP20") {
      setAppliedDiscount({ code: normalized, percent: 20 })
      setPromoInput("")
    } else {
      setPromoError("Invalid discount code. Try 'POLARIS10'")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (items.length === 0) {
      setErrorMessage("Your shopping cart is empty.")
      return
    }

    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.postalCode || !formData.email) {
      setErrorMessage("Please complete all required fields (marked with *).")
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
          phone: formData.phone || undefined,
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

  // Confirmed Order View
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-muted/15 py-12">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card shadow-lg overflow-hidden">
            {/* Header Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-8 text-center border-b border-emerald-200 dark:border-emerald-800/50">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <Badge variant="success" className="font-mono text-xs px-2.5 py-0.5 mb-2">
                Order Confirmed &bull; Atomic Transaction Sealed
              </Badge>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mt-1">
                Thank you for your order!
              </h1>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto">
                We&apos;ve reserved your inventory and sent a confirmation receipt to{" "}
                <strong className="text-foreground">{formData.email || "your email"}</strong>.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Order Status Timeline (Polaris style) */}
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-muted/20 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Delivery Timeline
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
                      ✓
                    </div>
                    <span className="font-bold text-foreground mt-1 text-[11px]">Placed</span>
                    <span className="text-[10px] text-muted-foreground font-mono">Today</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold animate-pulse">
                      2
                    </div>
                    <span className="font-bold text-foreground mt-1 text-[11px]">Processing</span>
                    <span className="text-[10px] text-muted-foreground">In Queue</span>
                  </div>
                  <div className="flex flex-col items-center opacity-50">
                    <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-[11px] font-bold">
                      3
                    </div>
                    <span className="font-medium text-foreground mt-1 text-[11px]">Dispatched</span>
                    <span className="text-[10px] text-muted-foreground">Est. 24h</span>
                  </div>
                  <div className="flex flex-col items-center opacity-50">
                    <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-[11px] font-bold">
                      4
                    </div>
                    <span className="font-medium text-foreground mt-1 text-[11px]">Delivered</span>
                    <span className="text-[10px] text-muted-foreground">Courier</span>
                  </div>
                </div>
              </div>

              {/* Order Metadata Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-xs">
                <div>
                  <span className="text-muted-foreground">Order Reference:</span>
                  <p className="font-mono font-bold text-foreground text-sm mt-0.5">
                    {confirmedOrder.orderNumber || confirmedOrder.id}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Shipping Method:</span>
                  <p className="font-bold text-foreground text-sm mt-0.5 capitalize">
                    {shippingMethod === "express" ? "Priority Express (1-2 Days)" : "Standard Delivery"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Paid:</span>
                  <p className="font-mono font-bold text-primary text-sm mt-0.5">
                    ${confirmedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Itemized Receipt */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Purchased Items ({confirmedOrder.items.length})
                </h4>
                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-card">
                  {confirmedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-foreground">
                          {item.name || `Item ID: ${item.productId}`}
                        </p>
                        <p className="text-muted-foreground font-mono mt-0.5">
                          Quantity: {item.quantity} &times; ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-foreground">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "flex-1 h-10 text-xs font-bold rounded-lg cursor-pointer"
                  )}
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/account"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800 cursor-pointer"
                  )}
                >
                  View Order History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cart Empty State
  if (mounted && items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/15 py-20">
        <div className="container mx-auto max-w-md px-4 text-center">
          <div className="w-14 h-14 rounded-lg bg-muted border border-slate-200 dark:border-slate-800 flex items-center justify-center text-muted-foreground mx-auto mb-3">
            <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h2 className="font-heading text-lg font-bold text-foreground">Your cart is empty</h2>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            There are no products ready for checkout. Add items from our catalog to complete an order.
          </p>
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "default" }), "mt-5 text-xs font-semibold h-10 rounded-lg")}
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/15 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Catalog</span>
            </Link>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground mt-1.5">
              Secure Checkout
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted &bull; Prisma Atomic Transactions</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-3 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Multi-Section Polaris Form Container (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Section 1: Contact Information */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Contact Information</h3>
                </div>
                <span className="text-[11px] text-muted-foreground">Guest or Member</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Email Address *</span>
                    {touched.email && formData.email && (
                      <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Valid email
                      </span>
                    )}
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("email")}
                    placeholder="name@company.com"
                    required
                    className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Order confirmation and atomic dispatch receipt will be sent here.
                  </p>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Phone Number (Optional)
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    For real-time SMS delivery notifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Shipping Destination */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Shipping Address</h3>
                </div>
                <Badge variant="neutral" className="text-[10px]">
                  Physical Dispatch
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Full Recipient Name *</span>
                    {touched.fullName && formData.fullName && (
                      <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Recorded
                      </span>
                    )}
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="Alex Mercer"
                    required
                    className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Street Address *
                  </label>
                  <Input
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("addressLine1")}
                    placeholder="500 Market Street, Suite 200"
                    required
                    className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Apartment, Suite, Unit (Optional)
                  </label>
                  <Input
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Floor 4, Unit B"
                    className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    City *
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("city")}
                    placeholder="San Francisco"
                    required
                    className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    State / Region *
                  </label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="CA"
                    required
                    className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Postal / ZIP Code *
                  </label>
                  <Input
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("postalCode")}
                    placeholder="94105"
                    required
                    className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Country *
                  </label>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="United States"
                    required
                    className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Shipping Method Selection */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Shipping Method</h3>
                </div>
                <Truck className="w-4 h-4 text-muted-foreground" />
              </div>

              <div className="space-y-2.5">
                {/* Standard Shipping */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                    shippingMethod === "standard"
                      ? "border-primary bg-primary/5 shadow-2xs"
                      : "border-slate-200 dark:border-slate-800 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === "standard"}
                      onChange={() => setShippingMethod("standard")}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-foreground">Standard Ground Delivery</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">3–5 Business Days with tracking</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {standardShippingFee === 0 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase">FREE</span>
                    ) : (
                      `$${standardShippingFee.toFixed(2)}`
                    )}
                  </span>
                </label>

                {/* Priority Express */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                    shippingMethod === "express"
                      ? "border-primary bg-primary/5 shadow-2xs"
                      : "border-slate-200 dark:border-slate-800 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === "express"}
                      onChange={() => setShippingMethod("express")}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-foreground">Priority Express Courier</p>
                        <Badge variant="info" className="text-[9px] h-3.5">
                          Expedited
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">1–2 Business Days guaranteed</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-foreground">
                    ${expressShippingFee.toFixed(2)}
                  </span>
                </label>
              </div>
            </div>

            {/* Section 4: Payment Simulation */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Payment Authorization</h3>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Prisma Protected</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-muted/40 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Simulated Test Sandbox (No live card charge)</span>
                  <Badge variant="neutral" className="text-[10px]">
                    Sandbox Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Card Number
                    </label>
                    <Input
                      value={formData.cardNumber}
                      readOnly
                      className="h-10 text-xs font-mono bg-muted/30 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      Expiration Date
                    </label>
                    <Input
                      value={formData.expDate}
                      readOnly
                      className="h-10 text-xs font-mono bg-muted/30 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      CVV
                    </label>
                    <Input
                      value={formData.cvv}
                      readOnly
                      className="h-10 text-xs font-mono bg-muted/30 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sticky Polaris Order Summary Sidebar (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-sm sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                <h3 className="text-sm font-bold text-foreground">Order Summary</h3>
                <Badge variant="secondary" className="font-mono text-xs">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </Badge>
              </div>

              {/* Items List with Shopify-style overlay quantity badge */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-200/70 dark:divide-slate-800/70 pr-1">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Product Thumbnail with Shopify circular badge */}
                      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-muted border border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-muted-foreground/50" />
                        )}
                        {/* Circular quantity badge */}
                        <div className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-700 text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-xs">
                          {item.quantity}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <span className="font-mono font-bold text-xs text-foreground shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <Input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Discount code (e.g. POLARIS10)"
                    className="h-9 text-xs uppercase font-mono rounded-lg border-slate-200 dark:border-slate-800"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyPromo}
                    className="h-9 px-3 text-xs font-semibold border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer shrink-0"
                  >
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{promoError}</p>
                )}
                {appliedDiscount && (
                  <div className="mt-2 flex items-center justify-between p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code {appliedDiscount.code} ({appliedDiscount.percent}% OFF)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedDiscount(null)}
                      className="text-[11px] text-muted-foreground hover:text-rose-600 cursor-pointer font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-800" />

              {/* Price Calculation Lines */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground font-semibold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                    <span>Discount ({appliedDiscount.percent}%)</span>
                    <span className="font-mono font-semibold">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-mono text-foreground font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase">Free</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-foreground font-semibold">
                    ${estimatedTax.toFixed(2)}
                  </span>
                </div>

                <Separator className="my-2 bg-slate-200 dark:bg-slate-800" />

                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Grand Total</span>
                  <span className="font-mono text-primary text-base">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 text-xs font-bold shadow-xs cursor-pointer rounded-lg mt-2"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Atomic Transaction...</span>
                  </span>
                ) : (
                  <span>Place Order &bull; ${totalAmount.toFixed(2)} USD</span>
                )}
              </Button>

              <div className="pt-2 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Prisma Atomic Guarantee &bull; Zero Inventory Leakage</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
