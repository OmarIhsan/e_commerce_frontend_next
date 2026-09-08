import { getCurrentCustomer } from "@/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Package, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react"

export default async function AccountPage() {
  const session = await getCurrentCustomer()

  if (!session.isAuthenticated) {
    redirect("/login?callbackUrl=/account")
  }

  const customer = session.customer

  return (
    <div className="min-h-screen bg-muted/15 py-10">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Customer Account
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your personal details, active orders, and delivery preferences.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Continue Shopping &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Details Card */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-2xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-3">
              <User className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Profile Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-medium text-muted-foreground">Full Name</span>
                <p className="font-bold text-foreground text-xs mt-0.5">
                  {customer?.name || "Customer"}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-medium text-muted-foreground">Email Address</span>
                <p className="font-bold text-foreground text-xs mt-0.5 font-mono">
                  {customer?.email || "customer@lumenstore.dev"}
                </p>
              </div>
              <div className="pt-2">
                <Badge variant="success" className="text-[10px] gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Authenticated Session</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Orders Overview */}
          <div className="md:col-span-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Recent Orders</h3>
              </div>
              <Badge variant="neutral" className="text-[10px]">
                Prisma Sync Active
              </Badge>
            </div>
            <div>
              <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center bg-muted/20">
                <Package className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2.5" />
                <h4 className="text-xs font-bold text-foreground">No recent orders yet</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  When you complete checkout, your order reference number and delivery tracking will appear here.
                </p>
                <div className="mt-4">
                  <Link
                    href="/products"
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground shadow-2xs hover:bg-primary/90 transition-colors"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
