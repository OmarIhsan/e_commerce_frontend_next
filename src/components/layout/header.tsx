"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCartStore } from "@/store/use-cart-store"
import { logoutAction } from "@/actions/auth"
import { useMounted } from "@/hooks/use-mounted"
import {
  ShoppingBag,
  User,
  LogOut,
  Sparkles,
  Search,
  Package,
} from "lucide-react"

interface HeaderProps {
  customer?: {
    id: string
    name: string
    email: string
  } | null
}

export function Header({ customer }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { getTotalItems, setIsOpen, hasHydrated } = useCartStore()

  const mounted = useMounted()
  const itemCount = mounted && hasHydrated ? getTotalItems() : 0

  const handleLogout = async () => {
    await logoutAction()
    router.refresh()
    router.push("/login")
  }

  const navLinks = [
    { href: "/products", label: "All Products" },
    { href: "/products?category=electronics", label: "Electronics" },
    { href: "/products?category=apparel", label: "Apparel" },
    { href: "/products?category=accessories", label: "Accessories" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-black tracking-tight leading-none">
                LUMEN<span className="text-primary font-normal">STORE</span>
              </span>
              <span className="text-[10px] tracking-widest text-muted-foreground font-mono uppercase">
                Next-Gen Commerce
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-foreground ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Actions: Search icon, Account Dropdown & Cart Trigger */}
        <div className="flex items-center gap-3">
          {/* Quick Search trigger link */}
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 h-9 px-3 text-xs text-muted-foreground bg-muted/60 hover:bg-muted rounded-lg border border-border/60 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search products...</span>
            <kbd className="hidden lg:inline-block rounded border bg-background px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
              /
            </kbd>
          </Link>

          {/* Customer Account */}
          {customer ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-2 rounded-full px-3 text-xs font-medium cursor-pointer"
                )}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="hidden sm:inline-block max-w-[120px] truncate">
                  {customer.name || customer.email || "Account"}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{customer.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/account")}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className="text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Cart Sheet Trigger Button */}
          <Button
            variant="outline"
            size="default"
            className="relative gap-2 rounded-xl border-border/80 shadow-xs hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => setIsOpen(true)}
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline text-xs font-medium">Cart</span>
            {itemCount > 0 && (
              <Badge
                variant="default"
                className="h-5 min-w-5 px-1.5 rounded-full text-[11px] font-mono font-bold leading-none bg-primary text-primary-foreground transition-transform"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
