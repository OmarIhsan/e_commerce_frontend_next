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
  Search,
  Package,
  Command,
  X,
  ArrowRight,
  Sparkles,
  Store,
} from "lucide-react"

interface HeaderProps {
  customer?: {
    id: string
    name: string
    email: string
  } | null
}

const QUICK_SUGGESTIONS = [
  { name: "Aether Pro Wireless Keyboard", category: "electronics", href: "/products?search=keyboard" },
  { name: "Hyperion ANC Studio Headphones", category: "electronics", href: "/products?search=headphones" },
  { name: "Nomad Minimalist Backpack", category: "apparel", href: "/products?search=backpack" },
  { name: "Vortex 4K 144Hz OLED Monitor", category: "electronics", href: "/products?search=monitor" },
  { name: "Merino Wool Thermal Tech Hoodie", category: "apparel", href: "/products?search=hoodie" },
  { name: "Pulse Titanium Smart Ring", category: "accessories", href: "/products?search=ring" },
]

export function Header({ customer }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { getTotalItems, setIsOpen, hasHydrated } = useCartStore()

  const mounted = useMounted()
  const itemCount = mounted && hasHydrated ? getTotalItems() : 0

  // Search dialog state
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  // Listen for Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      } else if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchOpen])

  React.useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  const handleLogout = async () => {
    await logoutAction()
    router.refresh()
    router.push("/login")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchOpen(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const navLinks = [
    { href: "/products", label: "Catalog" },
    { href: "/products?category=electronics", label: "Electronics" },
    { href: "/products?category=apparel", label: "Apparel" },
    { href: "/products?category=accessories", label: "Accessories" },
  ]

  const filteredSuggestions = searchQuery.trim()
    ? QUICK_SUGGESTIONS.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : QUICK_SUGGESTIONS.slice(0, 4)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-background/85 backdrop-blur-md transition-all shadow-2xs">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          {/* Brand Logo & Merchant Identity */}
          <div className="flex items-center gap-6 lg:gap-8 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
                <Store className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-base sm:text-lg font-bold tracking-tight leading-none text-foreground">
                  LUMEN<span className="text-primary font-normal">STORE</span>
                </span>
                <span className="text-[10px] tracking-wider text-muted-foreground font-mono uppercase mt-0.5">
                  Polaris Commerce
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Centered Search Bar (Polaris Quick Search with Ctrl+K) */}
          <div className="flex-1 max-w-md mx-auto hidden sm:block">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between h-9 px-3 text-xs text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span>Search catalog, inventory, SKU...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="inline-flex items-center gap-0.5 rounded border border-border/80 bg-background px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground shadow-2xs">
                  <Command className="w-2.5 h-2.5" />
                  <span>K</span>
                </kbd>
              </div>
            </button>
          </div>

          {/* Right Actions: Mobile Search, Account Dropdown & Cart Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Mobile Search Icon Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="sm:hidden rounded-lg"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search dialog"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Customer Account Dropdown */}
            {customer ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "gap-2 rounded-lg px-2.5 text-xs font-medium cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  )}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-xs">
                    {customer.name?.charAt(0).toUpperCase() || <User className="h-3.5 w-3.5" />}
                  </div>
                  <span className="hidden md:inline-block max-w-[110px] truncate text-foreground">
                    {customer.name || customer.email}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 p-1.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
                  <DropdownMenuLabel className="font-normal px-2 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-bold text-foreground truncate">{customer.name || "Customer"}</p>
                      <p className="text-[11px] font-mono text-muted-foreground truncate">{customer.email}</p>
                      <div className="pt-1">
                        <Badge variant="success" className="text-[10px] h-4">
                          Verified Session
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/account")}
                    className="cursor-pointer rounded-md text-xs py-2"
                  >
                    <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Order History &amp; Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/products")}
                    className="cursor-pointer rounded-md text-xs py-2"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Browse Catalog</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                    className="cursor-pointer rounded-md text-xs py-2 text-rose-600 dark:text-rose-400"
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
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted/60 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Persistent Cart Trigger (Polaris high-visibility drawer button) */}
            <Button
              variant="outline"
              size="default"
              className="relative gap-2 rounded-lg border-slate-200 dark:border-slate-800 bg-background hover:bg-muted/60 shadow-2xs transition-all cursor-pointer font-semibold text-xs px-3"
              onClick={() => setIsOpen(true)}
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingBag className="h-4 w-4 text-foreground" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 ? (
                <Badge
                  variant="default"
                  className="h-5 min-w-5 px-1.5 rounded-full text-[10px] font-mono font-bold leading-none bg-primary text-primary-foreground shadow-2xs"
                >
                  {itemCount}
                </Badge>
              ) : (
                <span className="hidden sm:inline text-muted-foreground font-mono text-xs">(0)</span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Global Interactive Quick-Search Modal / Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-card rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, category, or SKU..."
                className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground rounded border border-border/60 bg-muted/40"
              >
                ESC
              </button>
            </form>

            <div className="p-3 max-h-80 overflow-y-auto">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1">
                {searchQuery.trim() ? "Search Results" : "Quick Catalog Shortcuts"}
              </div>
              <div className="mt-1 space-y-1">
                {filteredSuggestions.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false)
                      router.push(item.href)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-muted/70 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral" className="text-[10px] capitalize">
                        {item.category}
                      </Badge>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 py-2.5 bg-muted/30 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Press <kbd className="font-mono font-semibold">Enter</kbd> to submit search query</span>
              <span>Polaris Search Engine</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

