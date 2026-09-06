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
    <div className="min-h-screen bg-muted/10 py-12">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-black tracking-tight text-foreground">
              Customer Account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your personal details, active orders, and preferences.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Profile Details</CardTitle>
              </div>
              <CardDescription>Verified customer identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Full Name</span>
                <p className="font-semibold text-foreground text-sm">
                  {customer?.name || "Customer"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Email Address</span>
                <p className="font-semibold text-foreground text-sm">
                  {customer?.email || "customer@lumenstore.dev"}
                </p>
              </div>
              <div className="pt-2">
                <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Active Session
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Orders Overview */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">Recent Orders</CardTitle>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  Real-time
                </Badge>
              </div>
              <CardDescription>All orders placed via atomic checkout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-dashed p-8 text-center bg-card/60">
                <Package className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-foreground">No recent orders yet</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  When you complete checkout, your order reference number and delivery tracking will appear here.
                </p>
                <div className="mt-4">
                  <Link
                    href="/products"
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
